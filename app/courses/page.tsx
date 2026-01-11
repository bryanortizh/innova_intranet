'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CoursesPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const courses = [
    {
      id: 1,
      name: 'Matemáticas Avanzadas',
      code: 'MAT-301',
      professor: 'Prof. Ana García',
      schedule: 'Lun, Mié, Vie 10:00-12:00',
      progress: 75,
      students: 28,
      semester: '2026-1',
      color: 'blue',
      description: 'Cálculo diferencial e integral avanzado con aplicaciones prácticas'
    },
    {
      id: 2,
      name: 'Física Cuántica',
      code: 'FIS-402',
      professor: 'Prof. Carlos Martínez',
      schedule: 'Mar, Jue 14:00-16:00',
      progress: 60,
      students: 22,
      semester: '2026-1',
      color: 'green',
      description: 'Introducción a la mecánica cuántica y sus principios fundamentales'
    },
    {
      id: 3,
      name: 'Programación Web',
      code: 'INF-305',
      professor: 'Prof. María López',
      schedule: 'Lun, Mié 16:00-18:00',
      progress: 90,
      students: 35,
      semester: '2026-1',
      color: 'purple',
      description: 'Desarrollo web moderno con React, Next.js y tecnologías actuales'
    },
    {
      id: 4,
      name: 'Literatura Española',
      code: 'LIT-201',
      professor: 'Prof. Roberto Sánchez',
      schedule: 'Mar, Jue 10:00-12:00',
      progress: 45,
      students: 30,
      semester: '2026-1',
      color: 'pink',
      description: 'Análisis de obras clásicas de la literatura española del Siglo de Oro'
    },
    {
      id: 5,
      name: 'Química Orgánica',
      code: 'QUI-303',
      professor: 'Prof. Laura Fernández',
      schedule: 'Vie 08:00-12:00',
      progress: 55,
      students: 25,
      semester: '2026-1',
      color: 'yellow',
      description: 'Estudio de compuestos orgánicos y sus reacciones químicas'
    },
    {
      id: 6,
      name: 'Historia Universal',
      code: 'HIS-202',
      professor: 'Prof. Diego Torres',
      schedule: 'Lun, Mié 14:00-16:00',
      progress: 70,
      students: 32,
      semester: '2026-1',
      color: 'indigo',
      description: 'Grandes acontecimientos históricos desde la antigüedad hasta la era moderna'
    }
  ];

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
                <Link href="/courses" className="border-b-2 border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900">Mis Cursos 📚</h1>
          <p className="text-gray-600 mt-1">Gestiona y accede a todos tus cursos del semestre actual</p>
        </div>

        {/* Filters and Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos los cursos
              </button>
              <button
                onClick={() => setSelectedFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedFilter === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                En progreso
              </button>
              <button
                onClick={() => setSelectedFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedFilter === 'completed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completados
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                <p className="text-xs text-gray-500">Cursos Activos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">16.5</p>
                <p className="text-xs text-gray-500">Promedio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group">
              {/* Course Header */}
              <div className={`h-32 bg-gradient-to-br from-${course.color}-500 to-${course.color}-600 p-6 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition"></div>
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-white bg-opacity-30 backdrop-blur-sm rounded-full text-white text-xs font-medium mb-2">
                    {course.code}
                  </span>
                  <h3 className="text-white font-bold text-lg line-clamp-2">{course.name}</h3>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">
                    {course.professor.split(' ')[1]?.[0] || 'P'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{course.professor}</p>
                    <p className="text-xs text-gray-500">{course.students} estudiantes</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.schedule}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600 font-medium">Progreso del curso</span>
                    <span className="text-xs font-bold text-gray-900">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r from-${course.color}-400 to-${course.color}-600 h-2 rounded-full transition-all`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    Ver Curso
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Horario Semanal 📅</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Hora</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Lunes</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Martes</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Miércoles</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Jueves</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Viernes</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 text-sm text-gray-600">08:00-10:00</td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4">
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-2 rounded">
                      <p className="text-xs font-medium text-yellow-800">Química Orgánica</p>
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-sm text-gray-600">10:00-12:00</td>
                  <td className="py-3 px-4">
                    <div className="bg-blue-100 border-l-4 border-blue-500 p-2 rounded">
                      <p className="text-xs font-medium text-blue-800">Matemáticas Avanzadas</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="bg-pink-100 border-l-4 border-pink-500 p-2 rounded">
                      <p className="text-xs font-medium text-pink-800">Literatura Española</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="bg-blue-100 border-l-4 border-blue-500 p-2 rounded">
                      <p className="text-xs font-medium text-blue-800">Matemáticas Avanzadas</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="bg-pink-100 border-l-4 border-pink-500 p-2 rounded">
                      <p className="text-xs font-medium text-pink-800">Literatura Española</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="bg-blue-100 border-l-4 border-blue-500 p-2 rounded">
                      <p className="text-xs font-medium text-blue-800">Matemáticas Avanzadas</p>
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-sm text-gray-600">14:00-16:00</td>
                  <td className="py-3 px-4">
                    <div className="bg-indigo-100 border-l-4 border-indigo-500 p-2 rounded">
                      <p className="text-xs font-medium text-indigo-800">Historia Universal</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="bg-green-100 border-l-4 border-green-500 p-2 rounded">
                      <p className="text-xs font-medium text-green-800">Física Cuántica</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="bg-indigo-100 border-l-4 border-indigo-500 p-2 rounded">
                      <p className="text-xs font-medium text-indigo-800">Historia Universal</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="bg-green-100 border-l-4 border-green-500 p-2 rounded">
                      <p className="text-xs font-medium text-green-800">Física Cuántica</p>
                    </div>
                  </td>
                  <td className="py-3 px-4"></td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-sm text-gray-600">16:00-18:00</td>
                  <td className="py-3 px-4">
                    <div className="bg-purple-100 border-l-4 border-purple-500 p-2 rounded">
                      <p className="text-xs font-medium text-purple-800">Programación Web</p>
                    </div>
                  </td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4">
                    <div className="bg-purple-100 border-l-4 border-purple-500 p-2 rounded">
                      <p className="text-xs font-medium text-purple-800">Programación Web</p>
                    </div>
                  </td>
                  <td className="py-3 px-4"></td>
                  <td className="py-3 px-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
