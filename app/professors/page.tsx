'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ProfessorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const professors = [
    {
      id: 1,
      name: 'Ana García Flores',
      professorId: 'PROF-001',
      email: 'ana.garcia@Innomatic.edu',
      phone: '+51 987 111 001',
      avatar: 'AG',
      department: 'Matemáticas',
      specialization: 'Cálculo y Álgebra',
      courses: ['MAT-301', 'MAT-201'],
      students: 58,
      experience: '15 años',
      rating: 4.8,
      status: 'active',
      color: 'blue',
      officeHours: 'Lun-Mié 15:00-17:00'
    },
    {
      id: 2,
      name: 'Carlos Martínez López',
      professorId: 'PROF-002',
      email: 'carlos.martinez@Innomatic.edu',
      phone: '+51 987 111 002',
      avatar: 'CM',
      department: 'Física',
      specialization: 'Física Cuántica',
      courses: ['FIS-402', 'FIS-301'],
      students: 44,
      experience: '12 años',
      rating: 4.6,
      status: 'active',
      color: 'green',
      officeHours: 'Mar-Jue 14:00-16:00'
    },
    {
      id: 3,
      name: 'María López Sánchez',
      professorId: 'PROF-003',
      email: 'maria.lopez@Innomatic.edu',
      phone: '+51 987 111 003',
      avatar: 'ML',
      department: 'Informática',
      specialization: 'Desarrollo Web',
      courses: ['INF-305', 'INF-405'],
      students: 70,
      experience: '10 años',
      rating: 4.9,
      status: 'active',
      color: 'purple',
      officeHours: 'Lun-Vie 18:00-19:00'
    },
    {
      id: 4,
      name: 'Roberto Sánchez Torres',
      professorId: 'PROF-004',
      email: 'roberto.sanchez@Innomatic.edu',
      phone: '+51 987 111 004',
      avatar: 'RS',
      department: 'Literatura',
      specialization: 'Literatura Clásica',
      courses: ['LIT-201', 'LIT-301'],
      students: 62,
      experience: '20 años',
      rating: 4.7,
      status: 'active',
      color: 'pink',
      officeHours: 'Mar-Jue 10:00-12:00'
    },
    {
      id: 5,
      name: 'Laura Fernández Ruiz',
      professorId: 'PROF-005',
      email: 'laura.fernandez@Innomatic.edu',
      phone: '+51 987 111 005',
      avatar: 'LF',
      department: 'Química',
      specialization: 'Química Orgánica',
      courses: ['QUI-303', 'QUI-403'],
      students: 50,
      experience: '8 años',
      rating: 4.5,
      status: 'active',
      color: 'yellow',
      officeHours: 'Vie 13:00-16:00'
    },
    {
      id: 6,
      name: 'Diego Torres Vargas',
      professorId: 'PROF-006',
      email: 'diego.torres@Innomatic.edu',
      phone: '+51 987 111 006',
      avatar: 'DT',
      department: 'Historia',
      specialization: 'Historia Contemporánea',
      courses: ['HIS-202', 'HIS-302'],
      students: 64,
      experience: '18 años',
      rating: 4.8,
      status: 'active',
      color: 'indigo',
      officeHours: 'Lun-Mié 16:00-18:00'
    },
    {
      id: 7,
      name: 'Patricia Ramírez Castro',
      professorId: 'PROF-007',
      email: 'patricia.ramirez@Innomatic.edu',
      phone: '+51 987 111 007',
      avatar: 'PR',
      department: 'Biología',
      specialization: 'Biología Molecular',
      courses: ['BIO-301', 'BIO-401'],
      students: 48,
      experience: '14 años',
      rating: 4.7,
      status: 'active',
      color: 'teal',
      officeHours: 'Mar 09:00-12:00'
    },
    {
      id: 8,
      name: 'Fernando Silva Medina',
      professorId: 'PROF-008',
      email: 'fernando.silva@Innomatic.edu',
      phone: '+51 987 111 008',
      avatar: 'FS',
      department: 'Ingeniería',
      specialization: 'Ingeniería Civil',
      courses: ['ING-301', 'ING-401'],
      students: 55,
      experience: '16 años',
      rating: 4.6,
      status: 'vacation',
      color: 'orange',
      officeHours: 'Lun-Jue 17:00-19:00'
    }
  ];

  const departments = [
    { code: 'all', name: 'Todos los departamentos' },
    { code: 'Matemáticas', name: 'Matemáticas' },
    { code: 'Física', name: 'Física' },
    { code: 'Informática', name: 'Informática' },
    { code: 'Literatura', name: 'Literatura' },
    { code: 'Química', name: 'Química' },
    { code: 'Historia', name: 'Historia' },
    { code: 'Biología', name: 'Biología' },
    { code: 'Ingeniería', name: 'Ingeniería' }
  ];

  const filteredProfessors = professors.filter(professor => {
    const matchesSearch = professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         professor.professorId.includes(searchTerm) ||
                         professor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         professor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || professor.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">✅ Disponible</span>;
      case 'busy':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">⏳ Ocupado</span>;
      case 'vacation':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">🏖️ Vacaciones</span>;
      default:
        return null;
    }
  };

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="text-yellow-400">⭐</span>
        ))}
        {hasHalfStar && <span className="text-yellow-400">⭐</span>}
        <span className="text-sm font-medium text-gray-700 ml-1">{rating}</span>
      </div>
    );
  };

  const stats = {
    total: professors.length,
    active: professors.filter(p => p.status === 'active').length,
    totalStudents: professors.reduce((acc, p) => acc + p.students, 0),
    averageRating: (professors.reduce((acc, p) => acc + p.rating, 0) / professors.length).toFixed(1)
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
                <Link href="/students" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Alumnos
                </Link>
                <Link href="/professors" className="border-b-2 border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900">Directorio de Profesores 👨‍🏫</h1>
          <p className="text-gray-600 mt-1">Consulta la información del cuerpo docente</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Profesores</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="text-4xl">👨‍🏫</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl shadow-sm p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Disponibles</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl shadow-sm p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">Total Estudiantes</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-xl shadow-sm p-6 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 mb-1">Rating Promedio</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.averageRating}</p>
              </div>
              <div className="text-4xl">⭐</div>
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
                  placeholder="Buscar por nombre, ID, especialización..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div className="md:w-64">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {departments.map(dept => (
                  <option key={dept.code} value={dept.code}>{dept.name}</option>
                ))}
              </select>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition whitespace-nowrap">
              + Nuevo Profesor
            </button>
          </div>
        </div>

        {/* Professors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessors.map((professor) => (
            <div key={professor.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
              {/* Professor Header */}
              <div className={`h-24 bg-gradient-to-br from-${professor.color}-500 to-${professor.color}-600 relative`}>
                <div className="absolute -bottom-12 left-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {professor.avatar}
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  {getStatusBadge(professor.status)}
                </div>
              </div>

              {/* Professor Info */}
              <div className="pt-16 px-6 pb-6">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{professor.name}</h3>
                  <p className="text-sm text-gray-500">ID: {professor.professorId}</p>
                  <p className="text-sm font-medium text-blue-600 mt-1">{professor.department}</p>
                </div>

                <div className="mb-4">
                  {getRatingStars(professor.rating)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{professor.specialization}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{professor.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {professor.phone}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Estudiantes</p>
                    <p className="text-xl font-bold text-gray-900">{professor.students}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Experiencia</p>
                    <p className="text-xl font-bold text-gray-900">{professor.experience}</p>
                  </div>
                </div>

                {/* Courses */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-2">Cursos que imparte:</p>
                  <div className="flex flex-wrap gap-2">
                    {professor.courses.map((course, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Office Hours */}
                <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-start">
                    <svg className="w-4 h-4 text-purple-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-xs font-medium text-purple-700">Horario de consulta:</p>
                      <p className="text-xs text-purple-600">{professor.officeHours}</p>
                    </div>
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
        {filteredProfessors.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron profesores</h3>
            <p className="text-gray-500">Intenta con otros términos de búsqueda o filtros</p>
          </div>
        )}
      </main>
    </div>
  );
}
