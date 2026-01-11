'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DashboardPage() {
  const [user] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@estudiante.com',
    avatar: 'JP',
    studentId: '2024-001'
  });

  const stats = [
    { label: 'Cursos Activos', value: '6', icon: '📚', color: 'from-blue-500 to-blue-600' },
    { label: 'Tareas Pendientes', value: '8', icon: '📝', color: 'from-orange-500 to-orange-600' },
    { label: 'Promedio General', value: '16.5', icon: '⭐', color: 'from-green-500 to-green-600' },
    { label: 'Próximas Reuniones', value: '3', icon: '📹', color: 'from-purple-500 to-purple-600' },
  ];

  const recentCourses = [
    { id: 1, name: 'Matemáticas Avanzadas', professor: 'Prof. García', progress: 75, color: 'blue' },
    { id: 2, name: 'Física Cuántica', professor: 'Prof. Martínez', progress: 60, color: 'green' },
    { id: 3, name: 'Programación Web', professor: 'Prof. López', progress: 90, color: 'purple' },
    { id: 4, name: 'Literatura Española', professor: 'Prof. Sánchez', progress: 45, color: 'pink' },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Ensayo de Literatura', course: 'Literatura Española', dueDate: '2026-01-15', priority: 'high' },
    { id: 2, title: 'Laboratorio de Física', course: 'Física Cuántica', dueDate: '2026-01-16', priority: 'medium' },
    { id: 3, title: 'Proyecto Final React', course: 'Programación Web', dueDate: '2026-01-18', priority: 'high' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
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
                <Link href="/dashboard" className="border-b-2 border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/courses" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Cursos
                </Link>
                <Link href="/grades" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Notas
                </Link>
                <Link href="/tasks" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Tareas
                </Link>
                <Link href="/meetings" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Reuniones
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="ml-4 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.avatar}
                </div>
                <div className="ml-3 hidden lg:block">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.studentId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">¡Bienvenido, {user.name}! 👋</h1>
          <p className="text-gray-600 mt-1">Aquí está tu resumen de actividades académicas</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-3xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Mis Cursos</h2>
                <Link href="/courses" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Ver todos →
                </Link>
              </div>
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.name}</h3>
                        <p className="text-sm text-gray-500">{course.professor}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${course.color}-100 text-${course.color}-700`}>
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r from-${course.color}-400 to-${course.color}-600 h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Próximas Tareas</h2>
                <Link href="/tasks" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Ver todas →
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="border-l-4 border-orange-500 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{task.course}</p>
                      </div>
                      {task.priority === 'high' && (
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          Urgente
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">📅 {task.dueDate}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 mt-6 text-white">
              <h3 className="text-lg font-bold mb-4">Acciones Rápidas</h3>
              <div className="space-y-2">
                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-4 py-3 text-left transition">
                  📝 Enviar Tarea
                </button>
                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-4 py-3 text-left transition">
                  📹 Unirse a Reunión
                </button>
                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-4 py-3 text-left transition">
                  💬 Contactar Profesor
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
