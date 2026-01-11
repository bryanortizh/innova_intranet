'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ProfessorCoursesPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const courses = [
    {
      id: 1,
      name: 'Programación Web Avanzada',
      code: 'INF-305',
      semester: '2026-1',
      schedule: 'Lun, Mié 16:00-18:00',
      students: 35,
      pendingTasks: 8,
      averageGrade: 17.2,
      attendance: 92,
      color: 'purple',
      room: 'Lab 301',
      description: 'Desarrollo web moderno con React, Next.js y tecnologías actuales'
    },
    {
      id: 2,
      name: 'Desarrollo Mobile',
      code: 'INF-405',
      semester: '2026-1',
      schedule: 'Mar, Jue 14:00-16:00',
      students: 28,
      pendingTasks: 5,
      averageGrade: 16.5,
      attendance: 88,
      color: 'blue',
      room: 'Lab 205',
      description: 'Desarrollo de aplicaciones móviles con React Native y Flutter'
    },
    {
      id: 3,
      name: 'Bases de Datos',
      code: 'INF-201',
      semester: '2026-1',
      schedule: 'Vie 10:00-13:00',
      students: 42,
      pendingTasks: 7,
      averageGrade: 15.8,
      attendance: 85,
      color: 'green',
      room: 'Aula 102',
      description: 'Diseño, implementación y administración de bases de datos relacionales'
    },
    {
      id: 4,
      name: 'Arquitectura de Software',
      code: 'INF-502',
      semester: '2026-1',
      schedule: 'Lun, Mié 10:00-12:00',
      students: 37,
      pendingTasks: 3,
      averageGrade: 16.9,
      attendance: 94,
      color: 'indigo',
      room: 'Aula 501',
      description: 'Patrones de diseño y arquitecturas de software empresarial'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-lg">I</span>
                </div>
                <span className="ml-3 text-xl font-bold text-white">Innova Intranet</span>
                <span className="ml-3 px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-xs font-medium">
                  👨‍🏫 Profesor
                </span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link href="/professor-dashboard" className="border-b-2 border-transparent text-white hover:text-purple-100 hover:border-purple-200 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/professor-courses" className="border-b-2 border-white text-white inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Mis Cursos
                </Link>
                <Link href="/professor-students" className="border-b-2 border-transparent text-white hover:text-purple-100 hover:border-purple-200 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Estudiantes
                </Link>
                <Link href="/professor-grades" className="border-b-2 border-transparent text-white hover:text-purple-100 hover:border-purple-200 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Calificaciones
                </Link>
                <Link href="/meetings" className="border-b-2 border-transparent text-white hover:text-purple-100 hover:border-purple-200 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Reuniones
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold">
                ML
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Cursos 📚</h1>
          <p className="text-gray-600 mt-1">Gestiona tus cursos y contenido académico</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Cursos</p>
                <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl shadow-sm p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 mb-1">Total Estudiantes</p>
                <p className="text-3xl font-bold text-purple-600">{courses.reduce((acc, c) => acc + c.students, 0)}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl shadow-sm p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 mb-1">Tareas Pendientes</p>
                <p className="text-3xl font-bold text-orange-600">{courses.reduce((acc, c) => acc + c.pendingTasks, 0)}</p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl shadow-sm p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Promedio General</p>
                <p className="text-3xl font-bold text-green-600">
                  {(courses.reduce((acc, c) => acc + c.averageGrade, 0) / courses.length).toFixed(1)}
                </p>
              </div>
              <div className="text-4xl">⭐</div>
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
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos los cursos
              </button>
              <button
                onClick={() => setSelectedFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedFilter === 'active'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                En progreso
              </button>
              <button
                onClick={() => setSelectedFilter('semester')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedFilter === 'semester'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Este semestre
              </button>
            </div>
            <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition whitespace-nowrap">
              + Crear Nuevo Curso
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
              {/* Course Header */}
              <div className={`h-32 bg-gradient-to-br from-${course.color}-500 to-${course.color}-600 p-6 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <span className="inline-block px-3 py-1 bg-white bg-opacity-30 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                      {course.code}
                    </span>
                    {course.pendingTasks > 0 && (
                      <span className="px-3 py-1 bg-orange-500 rounded-full text-white text-xs font-bold">
                        {course.pendingTasks} pendientes
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-bold text-xl">{course.name}</h3>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">{course.description}</p>

                {/* Course Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.schedule}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {course.room}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {course.students} estudiantes
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 mb-1">Promedio</p>
                    <p className="text-xl font-bold text-green-600">{course.averageGrade}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 mb-1">Asistencia</p>
                    <p className="text-xl font-bold text-blue-600">{course.attendance}%</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition">
                    Gestionar Curso
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>

                {/* Quick Links */}
                <div className="mt-4 pt-4 border-t flex justify-between text-xs">
                  <button className="text-purple-600 hover:text-purple-700 font-medium">Ver Lista</button>
                  <button className="text-purple-600 hover:text-purple-700 font-medium">Calificaciones</button>
                  <button className="text-purple-600 hover:text-purple-700 font-medium">Material</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
