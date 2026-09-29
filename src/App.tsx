/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import { Navbar, MainView } from './components/Navbar';
import { EmployeeQuickSwitcher } from './components/EmployeeQuickSwitcher';
import { TaskFiltersBar } from './components/TaskFiltersBar';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskListView } from './components/TaskListView';
import { MyTasksView } from './components/MyTasksView';
import { OwnerStrategyView } from './components/OwnerStrategyView';
import { TeamDirectoryView } from './components/TeamDirectoryView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { NotificationToast } from './components/NotificationToast';
import { TaskModal } from './components/TaskModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { HardwareTask } from './types';
import { Loader2 } from 'lucide-react';

function FerreteriaDashboard() {
  const { loading: authLoading, currentUser } = useAuth();
  const { tasks, loadingTasks, activeToastNotification, dismissToastNotification } = useTasks();

  const [activeView, setActiveView] = useState<MainView>('kanban');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [selectedTask, setSelectedTask] = useState<HardwareTask | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<HardwareTask | null>(null);

  // Keep selectedTask synchronized with the real-time tasks array
  const currentSelectedTask = selectedTask 
    ? (tasks.find(t => t.id === selectedTask.id) || selectedTask)
    : null;

  const handleOpenNewTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: HardwareTask) => {
    setSelectedTask(null);
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSelectTaskFromNotif = (taskId: string) => {
    const found = tasks.find(t => t.id === taskId);
    if (found) {
      setSelectedTask(found);
    }
  };

  if (authLoading && loadingTasks) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-xs font-semibold tracking-wide">Iniciando sistema de ferretería...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950">
      {/* Floating in-app Real-time Notification Toast */}
      <NotificationToast
        notification={activeToastNotification}
        onOpenTask={handleSelectTaskFromNotif}
        onDismiss={dismissToastNotification}
      />

      {/* Top Employee Quick Switcher */}
      <EmployeeQuickSwitcher />

      {/* PWA Mobile Add to Home Screen Banner */}
      <PWAInstallBanner />

      {/* Main Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenNewTaskModal={handleOpenNewTask}
        onSelectTaskFromNotif={handleSelectTaskFromNotif}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-3.5 sm:py-6 pb-28 md:pb-8">
        
        {/* Render Filters Bar for Kanban & List views */}
        {(activeView === 'kanban' || activeView === 'list') && (
          <TaskFiltersBar
            search={filterSearch}
            setSearch={setFilterSearch}
            department={filterDepartment}
            setDepartment={setFilterDepartment}
            assignee={filterAssignee}
            setAssignee={setFilterAssignee}
            status={filterStatus}
            setStatus={setFilterStatus}
            showStatusFilter={activeView === 'list'}
          />
        )}

        {/* View Routing */}
        {activeView === 'kanban' && (
          <KanbanBoard
            onSelectTask={(task) => setSelectedTask(task)}
            filterDepartment={filterDepartment}
            filterAssignee={filterAssignee}
            filterSearch={filterSearch}
          />
        )}

        {activeView === 'list' && (
          <TaskListView
            onSelectTask={(task) => setSelectedTask(task)}
            onEditTask={handleEditTask}
            filterDepartment={filterDepartment}
            filterAssignee={filterAssignee}
            filterSearch={filterSearch}
            filterStatus={filterStatus}
          />
        )}

        {activeView === 'my-tasks' && (
          <MyTasksView onSelectTask={(task) => setSelectedTask(task)} />
        )}

        {activeView === 'strategy' && (
          <OwnerStrategyView />
        )}

        {activeView === 'team' && (
          <TeamDirectoryView />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar & FAB */}
      <MobileBottomNav
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenNewTaskModal={handleOpenNewTask}
      />

      {/* Create / Edit Task Modal */}
      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setEditingTask(null);
          }}
          initialTask={editingTask}
        />
      )}

      {/* Task Detail Modal */}
      {currentSelectedTask && (
        <TaskDetailModal
          task={currentSelectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={handleEditTask}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <FerreteriaDashboard />
      </TaskProvider>
    </AuthProvider>
  );
}
