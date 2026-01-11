'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  const students = [
    {
      id: 1,
      name: 'Ana María Rodríguez',
      studentId: '2024-001',
      email: 'ana.rodriguez@estudiante.com',
      phone: '+51 987 654 321',
      avatar: 'AR',
      course: 'MAT-301',
      courseName: 'Matemáticas Avanzadas',
      grade: 17.5,
      attendance: 95,
      status: 'active',
      color: 'blue'
    },
    {
      id: 2,
      name: 'Carlos Eduardo Pérez',
      studentId: '2024-002',
      email: 'carlos.perez@estudiante.com',
      phone: '+51 987 654 322',
      avatar: 'CP',
      course: 'FIS-402',
      courseName: 'Física Cuántica',
      grade: 16.3,
      attendance: 88,
      status: 'active',
      color: 'green'
    },
    {
      id: 3,
      name: 'María Fernanda López',
      studentId: '2024-003',
      email: 'maria.lopez@estudiante.com',
      phone: '+51 987 654 323',
      avatar: 'ML',
      course: 'INF-305',
      courseName: 'Programación Web',
      grade: 18.5,
      attendance: 98,
      status: 'active',
      color: 'purple'
    },
    {
      id: 4,
      name: 'Juan Pablo Martínez',
      studentId: '2024-004',
      email: 'juan.martinez@estudiante.com',
      phone: '+51 987 654 324',
      avatar: 'JM',
      course: 'LIT-201',
      courseName: 'Literatura Española',
      grade: 16.0,
      attendance: 92,
      status: 'active',
      color: 'pink'
    },
    {
      id: 5,
      name: 'Laura Isabel García',
      studentId: '2024-005',
      email: 'laura.garcia@estudiante.com',
      phone: '+51 987 654 325',
      avatar: 'LG',
      course: 'QUI-303',
      courseName: 'Química Orgánica',
      grade: 15.9,
      attendance: 85,
      status: 'active',
      color: 'yellow'
    },
    {
      id: 6,
      name: 'Diego Alejandro Torres',
      studentId: '2024-006',
      email: 'diego.torres@estudiante.com',
      phone: '+51 987 654 326',
      avatar: 'DT',
      course: 'HIS-202',
      courseName: 'Historia Universal',
      grade: 17.8,
      attendance: 97,
      status: 'active',
      color: 'indigo'
    },
    {
      id: 7,
      name: 'Sofía Valentina Ruiz',
      studentId: '2024-007',
      email: 'sofia.ruiz@estudiante.com',
      phone: '+51 987 654 327',
      avatar: 'SR',
      course: 'MAT-301',
      courseName: 'Matemáticas Avanzadas',
      grade: 18.2,
      attendance: 100,
      status: 'active',
      color: 'blue'
    },
    {
      id: 8,
      name: 'Andrés Felipe Castro',
      studentId: '2024-008',
      email: 'andres.castro@estudiante.com',
      phone: '+51 987 654 328',
      avatar: 'AC',
      course: 'INF-305',
      courseName: 'Programación Web',
      grade: 17.9,
      attendance: 94,
      status: 'active',
      color: 'purple'
    },
    {
      id: 9,
      name: 'Camila Andrea Vargas',
      studentId: '2024-009',
      email: 'camila.vargas@estudiante.com',
      phone: '+51 987 654 329',
      avatar: 'CV',
      course: 'FIS-402',
      courseName: 'Física Cuántica',
      grade: 15.5,
      attendance: 78,
      status: 'warning',
      color: 'green'
    },
    {
      id: 10,
      name: 'Roberto Carlos Sánchez',
      studentId: '2024-010',
      email: 'roberto.sanchez@estudiante.com',
      phone: '+51 987 654 330',
      avatar: 'RS',
      course: 'LIT-201',
      courseName: 'Literatura Española',
      grade: 14.8,
      attendance: 82,
      status: 'active',
      color: 'pink'
    }
  ];

  const courses = [
    { code: 'all', name: 'Todos los cursos' },
    { code: 'MAT-301', name: 'Matemáticas Avanzadas' },
    { code: 'FIS-402', name: 'Física Cuántica' },
    { code: 'INF-305', name: 'Programación Web' },
    { code: 'LIT-201', name: 'Literatura Española' },
    { code: 'QUI-303', name: 'Química Orgánica' },
    { code: 'HIS-202', name: 'Historia Universal' }
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
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">✅ Activo</span>;
      case 'warning':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">⚠️ Atención</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">❌ Inactivo</span>;
      default:
        return null;
    }
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-600';
    if (attendance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'active').length,
    averageGrade: (students.reduce((acc, s) => acc + s.grade, 0) / students.length).toFixed(2),
    averageAttendance: (students.reduce((acc, s) => acc + s.attendance, 0) / students.length).toFixed(1)
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
                <Link href="/students" className="border-b-2 border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Alumnos
                </Link>
                <Link href="/professors" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Profesores
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
          <h1 className="text-3xl font-bold text-gray-900">Directorio de Alumnos 👨‍🎓</h1>
          <p className="text-gray-600 mt-1">Consulta y gestiona la información de los estudiantes</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Alumnos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl shadow-sm p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Activos</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl shadow-sm p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">Promedio General</p>
                <p className="text-3xl font-bold text-blue-600">{stats.averageGrade}</p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl shadow-sm p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 mb-1">Asistencia Media</p>
                <p className="text-3xl font-bold text-purple-600">{stats.averageAttendance}%</p>
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {courses.map(course => (
                  <option key={course.code} value={course.code}>{course.name}</option>
                ))}
              </select>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition whitespace-nowrap">
              + Nuevo Alumno
            </button>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div key={student.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
              {/* Student Header */}
              <div className={`h-24 bg-gradient-to-br from-${student.color}-500 to-${student.color}-600 relative`}>
                <div className="absolute -bottom-12 left-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {student.avatar}
                  </div>
                </div>
              </div>

              {/* Student Info */}
              <div className="pt-16 px-6 pb-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-500">ID: {student.studentId}</p>
                  </div>
                  {getStatusBadge(student.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {student.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="truncate">{student.courseName}</span>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 mb-1">Promedio</p>
                    <p className="text-2xl font-bold text-blue-600">{student.grade}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 mb-1">Asistencia</p>
                    <p className={`text-2xl font-bold ${getAttendanceColor(student.attendance)}`}>
                      {student.attendance}%
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    Ver Perfil
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron alumnos</h3>
            <p className="text-gray-500">Intenta con otros términos de búsqueda o filtros</p>
          </div>
        )}
      </main>
    </div>
  );
}
