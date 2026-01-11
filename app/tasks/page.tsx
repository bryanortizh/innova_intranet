'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function TasksPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const tasks = [
    {
      id: 1,
      title: 'Ensayo sobre el Siglo de Oro',
      course: 'Literatura Española',
      courseCode: 'LIT-201',
      description: 'Escribir un ensayo de 1500 palabras sobre las características principales del Siglo de Oro español',
      dueDate: '2026-01-15',
      status: 'pending',
      priority: 'high',
      points: 20,
      color: 'pink'
    },
    {
      id: 2,
      title: 'Laboratorio de Ondas',
      course: 'Física Cuántica',
      courseCode: 'FIS-402',
      description: 'Completar el laboratorio sobre el comportamiento ondulatorio de partículas',
      dueDate: '2026-01-16',
      status: 'in-progress',
      priority: 'medium',
      points: 15,
      color: 'green'
    },
    {
      id: 3,
      title: 'Proyecto Final React',
      course: 'Programación Web',
      courseCode: 'INF-305',
      description: 'Desarrollar una aplicación web completa usando React y Next.js con autenticación y base de datos',
      dueDate: '2026-01-18',
      status: 'in-progress',
      priority: 'high',
      points: 30,
      color: 'purple'
    },
    {
      id: 4,
      title: 'Ejercicios de Cálculo Integral',
      course: 'Matemáticas Avanzadas',
      courseCode: 'MAT-301',
      description: 'Resolver los ejercicios 15-30 del capítulo 8 sobre integrales múltiples',
      dueDate: '2026-01-17',
      status: 'pending',
      priority: 'medium',
      points: 10,
      color: 'blue'
    },
    {
      id: 5,
      title: 'Informe de Reacciones Orgánicas',
      course: 'Química Orgánica',
      courseCode: 'QUI-303',
      description: 'Redactar informe del experimento de síntesis de ésteres en laboratorio',
      dueDate: '2026-01-19',
      status: 'pending',
      priority: 'low',
      points: 12,
      color: 'yellow'
    },
    {
      id: 6,
      title: 'Presentación: Segunda Guerra Mundial',
      course: 'Historia Universal',
      courseCode: 'HIS-202',
      description: 'Preparar presentación de 15 minutos sobre las causas de la Segunda Guerra Mundial',
      dueDate: '2026-01-14',
      status: 'completed',
      priority: 'high',
      points: 18,
      color: 'indigo'
    },
    {
      id: 7,
      title: 'Quiz Teórico de Programación',
      course: 'Programación Web',
      courseCode: 'INF-305',
      description: 'Estudiar conceptos de JavaScript, hooks de React y Next.js para el quiz',
      dueDate: '2026-01-13',
      status: 'completed',
      priority: 'medium',
      points: 8,
      color: 'purple'
    },
    {
      id: 8,
      title: 'Tarea de Vectores',
      course: 'Matemáticas Avanzadas',
      courseCode: 'MAT-301',
      description: 'Resolver problemas de espacios vectoriales y transformaciones lineales',
      dueDate: '2026-01-20',
      status: 'pending',
      priority: 'low',
      points: 10,
      color: 'blue'
    }
  ];

  const filteredTasks = tasks.filter(task => {
    if (selectedFilter === 'all') return true;
    return task.status === selectedFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">✅ Completada</span>;
      case 'in-progress':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">⏳ En progreso</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">📝 Pendiente</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Alta</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Media</span>;
      case 'low':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">Baja</span>;
      default:
        return null;
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date('2026-01-11');
    const due = new Date(dueDate);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">I</span>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-800">Innomatic Intranet</span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link href="/dashboard" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/courses" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Cursos
                </Link>
                <Link href="/grades" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Notas
                </Link>
                <Link href="/tasks" className="border-b-2 border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Tareas
                </Link>
                <Link href="/meetings" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Reuniones
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                JP
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Tareas 📝</h1>
          <p className="text-gray-600 mt-1">Gestiona tus asignaciones y entregas académicas</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Tareas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl shadow-sm p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 mb-1">Pendientes</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <div className="text-4xl">⏰</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl shadow-sm p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">En Progreso</p>
                <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="text-4xl">⚡</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl shadow-sm p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Completadas</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas ({stats.total})
              </button>
              <button
                onClick={() => setSelectedFilter('pending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedFilter === 'pending'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pendientes ({stats.pending})
              </button>
              <button
                onClick={() => setSelectedFilter('in-progress')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedFilter === 'in-progress'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                En progreso ({stats.inProgress})
              </button>
              <button
                onClick={() => setSelectedFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedFilter === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completadas ({stats.completed})
              </button>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition">
              + Nueva Tarea
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => {
            const daysRemaining = getDaysRemaining(task.dueDate);
            const isOverdue = daysRemaining < 0 && task.status !== 'completed';
            const isUrgent = daysRemaining <= 2 && daysRemaining >= 0 && task.status !== 'completed';

            return (
              <div
                key={task.id}
                className={`bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden ${
                  isOverdue ? 'border-l-4 border-red-500' : isUrgent ? 'border-l-4 border-orange-500' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <div className="mt-1">
                          <input
                            type="checkbox"
                            checked={task.status === 'completed'}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            readOnly
                          />
                        </div>

                        {/* Task Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className={`text-lg font-bold ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                {task.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-sm font-medium text-${task.color}-600`}>
                                  {task.course}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm text-gray-500">{task.courseCode}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-2">
                            {getStatusBadge(task.status)}
                            {getPriorityBadge(task.priority)}
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                              {task.points} puntos
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="lg:text-right">
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 mb-1">Fecha de entrega</p>
                        <p className={`text-sm font-bold ${
                          isOverdue ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-gray-900'
                        }`}>
                          📅 {task.dueDate}
                        </p>
                        {task.status !== 'completed' && (
                          <p className={`text-xs mt-1 ${
                            isOverdue ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-gray-500'
                          }`}>
                            {isOverdue
                              ? `⚠️ Vencida hace ${Math.abs(daysRemaining)} día(s)`
                              : daysRemaining === 0
                              ? '⚠️ Vence hoy'
                              : `Faltan ${daysRemaining} día(s)`
                            }
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex lg:flex-col gap-2">
                        {task.status !== 'completed' && (
                          <button className="flex-1 lg:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                            Enviar Tarea
                          </button>
                        )}
                        <button className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No hay tareas</h3>
            <p className="text-gray-500">
              {selectedFilter === 'all'
                ? 'No tienes tareas asignadas en este momento'
                : `No tienes tareas en estado "${selectedFilter}"`
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
