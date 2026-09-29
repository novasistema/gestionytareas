export type UserRole = 'dueño' | 'encargado' | 'mostrador' | 'deposito' | 'compras';

export type UserStatus = 'disponible' | 'ocupado' | 'ausente';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatar?: string;
  status: UserStatus;
  phone?: string;
  createdAt: string;
}

export type Department = 
  | 'inventario' 
  | 'deposito' 
  | 'mostrador' 
  | 'compras' 
  | 'mantenimiento' 
  | 'despacho';

export type TaskPriority = 'baja' | 'media' | 'alta' | 'urgente';

export type TaskStatus = 'pendiente' | 'en_progreso' | 'en_revision' | 'completada' | 'bloqueada';

export interface TaskStep {
  id: string;
  text: string;
  completed: boolean;
  completedBy?: string;
  completedByName?: string;
  completedAt?: string;
  notes?: string;
}

export interface HardwareTask {
  id: string;
  title: string;
  description: string;
  department: Department;
  priority: TaskPriority;
  status: TaskStatus;
  assignedToUid: string;
  assignedToName: string;
  assignedToRole?: string;
  createdByUid: string;
  createdByName: string;
  estimatedMinutes?: number;
  dueDate?: string;
  steps: TaskStep[];
  blockerReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 
  | 'task_assigned' 
  | 'step_completed' 
  | 'status_changed' 
  | 'task_completed' 
  | 'task_blocked';

export interface AppNotification {
  id: string;
  userId: string;
  taskId: string;
  taskTitle: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdByUid: string;
  createdByName: string;
  createdAt: string;
}

export interface SupplierLead {
  id: string;
  supplierName: string;
  category: string;
  contactInfo: string;
  priceNotes: string;
  status: 'contacto_inicial' | 'cotizacion_recibida' | 'analizando' | 'aprobado';
  potentialSavings?: string;
  createdByUid: string;
  createdAt: string;
}

export interface FerreteriaPreset {
  title: string;
  department: Department;
  priority: TaskPriority;
  estimatedMinutes: number;
  description: string;
  steps: string[];
}
