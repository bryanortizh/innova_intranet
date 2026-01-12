'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ProfessorStudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  const students = [
    {
      id: 1,
      name: 'Ana María Rodríguez',
      studentId: '2024-001',
      email: 'ana.rodriguez@estudiante.com',
      course: 'INF-305',
      courseName: 'Programación Web Avanzada',
      grade: 18.5,
      attendance: 98,
      lastSubmission: '2026-01-11',
      status: 'excellent',
      avatar: 'AR'
    },
    {
      id: 2,
      name: 'Carlos Eduardo Pérez',
      studentId: '2024-002',
      email: 'carlos.perez@estudiante.com',
      course: 'INF-405',
      courseName: 'Desarrollo Mobile',
      grade: 17.2,
      attendance: 94,
      lastSubmission: '2026-01-10',
      status: 'good',
      avatar: 'CP'
    },
    {
      id: 3,
      name: 'María Fernanda López',
      studentId: '2024-003',
      email: 'maria.lopez@estudiante.com',
      course: 'INF-201',
      courseName: 'Bases de Datos',
      grade: 16.8,
      attendance: 92,
      lastSubmission: '2026-01-11',
      status: 'good',
      avatar: 'ML'
    },
    {
      id: 4,
      name: 'Juan Pablo Martínez',
      studentId: '2024-004',
      email: 'juan.martinez@estudiante.com',
      course: 'INF-502',
      courseName: 'Arquitectura de Software',
      grade: 15.5,
      attendance: 85,
      lastSubmission: '2026-01-09',
      status: 'warning',
      avatar: 'JM'
    },
    {
      id: 5,
      name: 'Laura Isabel García',
      studentId: '2024-005',
      email: 'laura.garcia@estudiante.com',
      course: 'INF-305',
      courseName: 'Programación Web Avanzada',
      grade: 17.9,
      attendance: 96,
      lastSubmission: '2026-01-11',
      status: 'excellent',
      avatar: 'LG'
    },
    {
      id: 6,
      name: 'Diego Alejandro Torres',
      studentId: '2024-006',
      email: 'diego.torres@estudiante.com',
      course: 'INF-405',
      courseName: 'Desarrollo Mobile',
      grade: 16.2,
      attendance: 88,
      lastSubmission: '2026-01-10',
      status: 'good',
      avatar: 'DT'
    },
    {
      id: 7,
      name: 'Sofía Valentina Ruiz',
      studentId: '2024-007',
      email: 'sofia.ruiz@estudiante.com',
      course: 'INF-201',
      courseName: 'Bases de Datos',
      grade: 14.8,
      attendance: 78,
      lastSubmission: '2026-01-08',
      status: 'warning',
      avatar: 'SR'
    },
    {
      id: 8,
      name: 'Andrés Felipe Castro',
      studentId: '2024-008',
      email: 'andres.castro@estudiante.com',
      course: 'INF-502',
      courseName: 'Arquitectura de Software',
      grade: 17.5,
      attendance: 93,
      lastSubmission: '2026-01-11',
      status: 'excellent',
      avatar: 'AC'
    }
  ];

  const courses = [
    { code: 'all', name: 'Todos los cursos' },
    { code: 'INF-305', name: 'Programación Web Avanzada' },
    { code: 'INF-405', name: 'Desarrollo Mobile' },
    { code: 'INF-201', name: 'Bases de Datos' },
    { code: 'INF-502', name: 'Arquitectura de Software' }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.includes(searchTerm) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || student.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">⭐ Excelente</span>;
      case 'good':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">✅ Bien</span>;
      case 'warning':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">⚠️ Atención</span>;
      default:
        return null;
    }
  };

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
                <span className="ml-3 text-xl font-bold text-white">Innomatic Intranet</span>
                <span className="ml-3 px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-xs font-medium">
                  👨‍🏫 Profesor
                </span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link href="/professor-dashboard" className="border-b-2 border-transparent text-white hover:text-purple-100 hover:border-purple-200 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/professor-courses" className="border-b-2 border-transparent text-white hover:text-purple-100 hover:border-purple-200 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Mis Cursos
                </Link>
                <Link href="/professor-students" className="border-b-2 border-white text-white inline-flex items-center px-1 pt-1 text-sm font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900">Mis Estudiantes 👨‍🎓</h1>
          <p className="text-gray-600 mt-1">Consulta y gestiona el desempeño de tus estudiantes</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Estudiantes</p>
                <p className="text-3xl font-bold text-gray-900">{students.length}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl shadow-sm p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Rendimiento Excelente</p>
                <p className="text-3xl font-bold text-green-600">
                  {students.filter(s => s.status === 'excellent').length}
                </p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-xl shadow-sm p-6 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 mb-1">Requieren Atención</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {students.filter(s => s.status === 'warning').length}
                </p>
              </div>
              <div className="text-4xl">⚠️</div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl shadow-sm p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 mb-1">Promedio General</p>
                <p className="text-3xl font-bold text-purple-600">
                  {(students.reduce((acc, s) => acc + s.grade, 0) / students.length).toFixed(1)}
                </p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, ID o correo..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                {courses.map(course => (
                  <option key={course.code} value={course.code}>{course.name}</option>
                ))}
              </select>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition whitespace-nowrap">
              Exportar Lista
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Estudiante</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Curso</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Promedio</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Asistencia</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Última Entrega</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Estado</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {student.avatar}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.studentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-900">{student.courseName}</p>
                      <p className="text-xs text-gray-500">{student.course}</p>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`text-lg font-bold ${
                        student.grade >= 18 ? 'text-green-600' : 
                        student.grade >= 16 ? 'text-blue-600' : 
                        student.grade >= 14 ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {student.grade}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`font-medium ${
                        student.attendance >= 90 ? 'text-green-600' : 
                        student.attendance >= 80 ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {student.attendance}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-gray-600">
                      {student.lastSubmission}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron estudiantes</h3>
            <p className="text-gray-500">Intenta con otros términos de búsqueda o filtros</p>
          </div>
        )}
      </main>
    </div>
  );
}
