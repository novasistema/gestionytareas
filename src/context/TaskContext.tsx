import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';
import { useAuth } from './AuthContext';
import { 
  HardwareTask, 
  AppNotification, 
  SupplierLead, 
  TaskStep, 
  TaskStatus, 
  TaskPriority, 
  Department 
} from '../types';
import { FERRETERIA_PRESETS } from '../data/presets';
import { sound } from '../services/sound';
import { pushNotifications } from '../services/pushNotifications';
import confetti from 'canvas-confetti';

interface TaskContextType {
  tasks: HardwareTask[];
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  supplierLeads: SupplierLead[];
  loadingTasks: boolean;
  activeToastNotification: AppNotification | null;
  dismissToastNotification: () => void;
  notificationPermission: NotificationPermission;
  requestNotificationPermission: () => Promise<NotificationPermission>;
  createTask: (data: Omit<HardwareTask, 'id' | 'createdAt' | 'updatedAt' | 'createdByUid' | 'createdByName'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<HardwareTask>) => Promise<void>;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus, blockerReason?: string) => Promise<void>;
  toggleTaskStep: (taskId: string, stepId: string, notes?: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  createSupplierLead: (data: Omit<SupplierLead, 'id' | 'createdAt' | 'createdByUid'>) => Promise<void>;
  updateSupplierLead: (leadId: string, updates: Partial<SupplierLead>) => Promise<void>;
  deleteSupplierLead: (leadId: string) => Promise<void>;
  seedSampleHardwareTasks: () => Promise<void>;
  stats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    urgentTasks: number;
    hoursDelegatedSaved: number;
  };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, allUsers } = useAuth();
  const [tasks, setTasks] = useState<HardwareTask[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [supplierLeads, setSupplierLeads] = useState<SupplierLead[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [activeToastNotification, setActiveToastNotification] = useState<AppNotification | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    pushNotifications.getPermission()
  );

  const requestNotificationPermission = async () => {
    const res = await pushNotifications.requestPermission();
    setNotificationPermission(res);
    return res;
  };

  const dismissToastNotification = () => {
    setActiveToastNotification(null);
  };

  // Real-time listener for tasks
  useEffect(() => {
    const tasksRef = collection(db, 'tasks');
    const q = query(tasksRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: HardwareTask[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          ...data
        } as HardwareTask);
      });

      // Sort by priority and created date
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setTasks(items);
      setLoadingTasks(false);

      // Auto seed if completely empty
      if (items.length === 0 && !loadingTasks) {
        seedSampleHardwareTasks();
      }
    }, (error) => {
      console.warn('Tasks snapshot warning:', error);
      setLoadingTasks(false);
    });

    return () => unsubscribe();
  }, [loadingTasks]);

  // Real-time listener for notifications
  useEffect(() => {
    if (!currentUser) return;
    const notifsRef = collection(db, 'notifications');
    const q = query(notifsRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: AppNotification[] = [];
      snapshot.forEach((docSnap) => {
        const notif = { id: docSnap.id, ...docSnap.data() } as AppNotification;
        // User gets notifications addressed to them, or if they are the owner they get all task alerts
        if (notif.userId === currentUser.uid || currentUser.role === 'dueño') {
          items.push(notif);
        }
      });

      // Order most recent first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      const unreadItems = items.filter(n => !n.read);
      pushNotifications.updateBadge(unreadItems.length);

      // Check for incoming fresh notification
      const freshNotif = items.find(n => !n.read && (Date.now() - new Date(n.createdAt).getTime()) < 15000);
      if (freshNotif) {
        sound.playNotification();
        setActiveToastNotification(freshNotif);
        pushNotifications.showNotification(
          `Ferretería Bruzzone: ${freshNotif.taskTitle}`,
          freshNotif.message,
          { tag: freshNotif.id }
        );
      }

      setNotifications(items);
    }, (error) => {
      console.warn('Notifications snapshot warning:', error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Real-time listener for supplier leads
  useEffect(() => {
    const leadsRef = collection(db, 'supplier_leads');
    const q = query(leadsRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: SupplierLead[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as SupplierLead);
      });
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setSupplierLeads(items);
    }, (error) => {
      console.warn('Supplier leads snapshot warning:', error);
    });

    return () => unsubscribe();
  }, []);

  // Helper to create notifications
  const sendNotification = async (
    targetUserId: string,
    taskId: string,
    taskTitle: string,
    type: AppNotification['type'],
    message: string
  ) => {
    try {
      const notifId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const notifData: AppNotification = {
        id: notifId,
        userId: targetUserId,
        taskId,
        taskTitle,
        type,
        message,
        read: false,
        createdByUid: currentUser?.uid || 'system',
        createdByName: currentUser?.displayName || 'Sistema FerreTask',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'notifications', notifId), notifData);
    } catch (err) {
      console.warn('Notification error:', err);
    }
  };

  // Create new task with steps
  const createTask = async (
    data: Omit<HardwareTask, 'id' | 'createdAt' | 'updatedAt' | 'createdByUid' | 'createdByName'>
  ) => {
    if (!currentUser) return;
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const newTask: HardwareTask = {
      ...data,
      id: taskId,
      createdByUid: currentUser.uid,
      createdByName: currentUser.displayName,
      createdAt: now,
      updatedAt: now
    };

    try {
      await setDoc(doc(db, 'tasks', taskId), newTask);
      sound.playNotification();

      // Send instant notification to the assigned employee
      if (data.assignedToUid && data.assignedToUid !== currentUser.uid) {
        await sendNotification(
          data.assignedToUid,
          taskId,
          data.title,
          'task_assigned',
          `Se te ha asignado la tarea "${data.title}" con ${data.steps.length} pasos requeridos.`
        );
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `tasks/${taskId}`);
    }
  };

  // Update task generic
  const updateTask = async (taskId: string, updates: Partial<HardwareTask>) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${taskId}`);
    }
  };

  // Change task status with alerts
  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus, blockerReason?: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const updates: Partial<HardwareTask> = {
        status: newStatus,
        updatedAt: new Date().toISOString()
      };

      if (blockerReason !== undefined) {
        updates.blockerReason = blockerReason;
      }

      // If moving to completed, mark all steps as completed if not already
      if (newStatus === 'completada') {
        updates.steps = task.steps.map(s => ({
          ...s,
          completed: true,
          completedBy: s.completedBy || currentUser?.uid,
          completedByName: s.completedByName || currentUser?.displayName,
          completedAt: s.completedAt || new Date().toISOString()
        }));

        sound.playTaskComplete();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else if (newStatus === 'bloqueada') {
        sound.playBlockedAlert();
      }

      await updateDoc(doc(db, 'tasks', taskId), updates);

      // Notify the creator or assignee
      const notifyTarget = currentUser?.uid === task.assignedToUid ? task.createdByUid : task.assignedToUid;
      if (notifyTarget && notifyTarget !== currentUser?.uid) {
        let msg = `La tarea "${task.title}" cambió al estado ${newStatus.toUpperCase()}`;
        if (newStatus === 'bloqueada' && blockerReason) {
          msg = `⚠️ Tarea bloqueada: "${task.title}". Motivo: ${blockerReason}`;
        }
        await sendNotification(
          notifyTarget,
          taskId,
          task.title,
          newStatus === 'completada' ? 'task_completed' : newStatus === 'bloqueada' ? 'task_blocked' : 'status_changed',
          msg
        );
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${taskId}`);
    }
  };

  // Toggle single step inside a task
  const toggleTaskStep = async (taskId: string, stepId: string, stepNotes?: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedSteps = task.steps.map(step => {
      if (step.id === stepId) {
        const nextState = !step.completed;
        return {
          ...step,
          completed: nextState,
          completedBy: nextState ? (currentUser?.uid || 'user') : undefined,
          completedByName: nextState ? (currentUser?.displayName || 'Usuario') : undefined,
          completedAt: nextState ? new Date().toISOString() : undefined,
          notes: stepNotes !== undefined ? stepNotes : step.notes
        };
      }
      return step;
    });

    sound.playStepCheck();

    // Check if all steps are now completed
    const allDone = updatedSteps.length > 0 && updatedSteps.every(s => s.completed);
    const anyDone = updatedSteps.some(s => s.completed);

    let nextStatus: TaskStatus = task.status;
    if (allDone && task.status !== 'completada') {
      nextStatus = 'en_revision'; // Ready for final approval / review
    } else if (anyDone && task.status === 'pendiente') {
      nextStatus = 'en_progreso';
    }

    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        steps: updatedSteps,
        status: nextStatus,
        updatedAt: new Date().toISOString()
      });

      // Send step completion notice to creator if completed by another staff
      if (currentUser?.uid !== task.createdByUid) {
        const targetedStep = updatedSteps.find(s => s.id === stepId);
        if (targetedStep?.completed) {
          await sendNotification(
            task.createdByUid,
            taskId,
            task.title,
            'step_completed',
            `${currentUser?.displayName || 'El responsable'} avanzó un paso en "${task.title}": ${targetedStep.text}`
          );
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${taskId}`);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tasks/${taskId}`);
    }
  };

  const markNotificationRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), { read: true });
    } catch (err) {
      console.warn('Error marking read:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.read);
      for (const n of unread) {
        await updateDoc(doc(db, 'notifications', n.id), { read: true });
      }
    } catch (err) {
      console.warn('Error marking all read:', err);
    }
  };

  // Supplier leads for the owner's strategic purchasing time
  const createSupplierLead = async (data: Omit<SupplierLead, 'id' | 'createdAt' | 'createdByUid'>) => {
    const id = `lead_${Date.now()}`;
    const newLead: SupplierLead = {
      ...data,
      id,
      createdByUid: currentUser?.uid || 'dueño',
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'supplier_leads', id), newLead);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `supplier_leads/${id}`);
    }
  };

  const updateSupplierLead = async (leadId: string, updates: Partial<SupplierLead>) => {
    try {
      await updateDoc(doc(db, 'supplier_leads', leadId), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `supplier_leads/${leadId}`);
    }
  };

  const deleteSupplierLead = async (leadId: string) => {
    try {
      await deleteDoc(doc(db, 'supplier_leads', leadId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `supplier_leads/${leadId}`);
    }
  };

  // Auto seed hardware store sample tasks
  const seedSampleHardwareTasks = async () => {
    if (allUsers.length === 0) return;

    try {
      const sampleSeeds = [
        {
          preset: FERRETERIA_PRESETS[0], // Bulonería
          assignee: allUsers.find(u => u.role === 'deposito') || allUsers[0],
          status: 'en_progreso' as TaskStatus,
          completedStepsCount: 2
        },
        {
          preset: FERRETERIA_PRESETS[1], // Herramientas en Vidriera
          assignee: allUsers.find(u => u.role === 'mostrador') || allUsers[0],
          status: 'pendiente' as TaskStatus,
          completedStepsCount: 0
        },
        {
          preset: FERRETERIA_PRESETS[2], // Pedido Obra
          assignee: allUsers.find(u => u.role === 'encargado') || allUsers[0],
          status: 'pendiente' as TaskStatus,
          completedStepsCount: 1
        },
        {
          preset: FERRETERIA_PRESETS[4], // Máquina duplicadora llaves
          assignee: allUsers.find(u => u.role === 'mostrador') || allUsers[0],
          status: 'completada' as TaskStatus,
          completedStepsCount: 5
        }
      ];

      for (const item of sampleSeeds) {
        const taskId = `seed_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const steps: TaskStep[] = item.preset.steps.map((text, idx) => ({
          id: `step_${idx + 1}`,
          text,
          completed: idx < item.completedStepsCount,
          completedBy: idx < item.completedStepsCount ? item.assignee.uid : undefined,
          completedByName: idx < item.completedStepsCount ? item.assignee.displayName : undefined,
          completedAt: idx < item.completedStepsCount ? new Date().toISOString() : undefined
        }));

        const taskData: HardwareTask = {
          id: taskId,
          title: item.preset.title,
          description: item.preset.description,
          department: item.preset.department,
          priority: item.preset.priority,
          status: item.status,
          assignedToUid: item.assignee.uid,
          assignedToName: item.assignee.displayName,
          assignedToRole: item.assignee.role,
          createdByUid: currentUser?.uid || 'dueño_initial',
          createdByName: currentUser?.displayName || 'Dueño Ferretería',
          estimatedMinutes: item.preset.estimatedMinutes,
          dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          steps,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'tasks', taskId), taskData);
      }

      // Also seed 2 supplier leads to inspire the owner
      const lead1: SupplierLead = {
        id: `lead_bulones`,
        supplierName: 'Distribuidora Mayorista Bulones & Roscas Norte',
        category: 'Bulonería y Fijaciones',
        contactInfo: 'ventas@bulonesnorte.com.ar / WhatsApp: +54 9 11 5566-7788',
        priceNotes: 'Ofrecen 18% de descuento por compra de cajón cerrado de tirafondos y autoperforantes punta mecha. Entrega sin cargo en 24hs.',
        status: 'cotizacion_recibida',
        potentialSavings: 'Ahorro aprox: $180.000 / mes',
        createdByUid: currentUser?.uid || 'dueño',
        createdAt: new Date().toISOString()
      };

      const lead2: SupplierLead = {
        id: `lead_sanitarios`,
        supplierName: 'Tubos & Termofusión Andina',
        category: 'Plomería y Gas',
        contactInfo: 'comercial@andinasanitarios.com',
        priceNotes: 'Línea de accesorios con inserto de bronce para agua caliente. Lista de precios con pago a 30 días.',
        status: 'analizando',
        potentialSavings: 'Ahorro aprox: 12% vs proveedor actual',
        createdByUid: currentUser?.uid || 'dueño',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'supplier_leads', lead1.id), lead1);
      await setDoc(doc(db, 'supplier_leads', lead2.id), lead2);

    } catch (err) {
      console.warn('Seeding sample tasks warning:', err);
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Calculate owner productivity stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completada').length;
  const inProgressTasks = tasks.filter(t => t.status === 'en_progreso').length;
  const urgentTasks = tasks.filter(t => t.priority === 'urgente' && t.status !== 'completada').length;

  // Sum of minutes saved on completed tasks
  const totalMinutesSaved = tasks
    .filter(t => t.status === 'completada')
    .reduce((acc, t) => acc + (t.estimatedMinutes || 30), 0);
  const hoursDelegatedSaved = Math.round((totalMinutesSaved / 60) * 10) / 10;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        notifications,
        unreadNotificationsCount,
        supplierLeads,
        loadingTasks,
        activeToastNotification,
        dismissToastNotification,
        notificationPermission,
        requestNotificationPermission,
        createTask,
        updateTask,
        updateTaskStatus,
        toggleTaskStep,
        deleteTask,
        markNotificationRead,
        markAllNotificationsRead,
        createSupplierLead,
        updateSupplierLead,
        deleteSupplierLead,
        seedSampleHardwareTasks,
        stats: {
          totalTasks,
          completedTasks,
          inProgressTasks,
          urgentTasks,
          hoursDelegatedSaved
        }
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
