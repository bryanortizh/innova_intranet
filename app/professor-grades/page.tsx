'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated, logout } from '@/lib/services/authService';

export default function ProfessorGradesPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('INF-305');
  const [selectedEvaluation, setSelectedEvaluation] = useState('all');
  const [professor] = useState(() => {
    const userData = getUser();
    if (userData) {
      return {
        name: `Prof. ${userData.nombre} ${userData.apellido}`,
        email: userData.email,
        avatar: `${userData.nombre[0]}${userData.apellido[0]}`.toUpperCase(),
        professorId: `PROF-${String(userData.id).padStart(3, '0')}`,
      };
    }
    return {
      name: '',
      email: '',
      avatar: 'ML',
      professorId: '',
    };
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push('/login');
  };

  const courses = [
    { code: 'INF-305', name: 'Programación Web Avanzada' },
    { code: 'INF-405', name: 'Desarrollo Mobile' },
    { code: 'INF-201', name: 'Bases de Datos' },
    { code: 'INF-502', name: 'Arquitectura de Software' }
  ];

  const evaluations = [
    { id: 'all', name: 'Todas las evaluaciones' },
    { id: 'project-1', name: 'Proyecto Final React', weight: 30, date: '2026-01-04' },
    { id: 'exam-1', name: 'Examen Parcial 1', weight: 25, date: '2026-01-09' },
    { id: 'task-1', name: 'Tarea HTML/CSS', weight: 10, date: '2026-01-07' },
    { id: 'task-2', name: 'Tarea JavaScript', weight: 15, date: '2026-01-10' }
  ];

  const grades = [
    {
      studentId: '2024-001',
      studentName: 'Ana María Rodríguez',
      avatar: 'AR',
      evaluations: [
        { id: 'project-1', grade: 19, submitted: true, date: '2026-01-04' },
        { id: 'exam-1', grade: 18, submitted: true, date: '2026-01-09' },
        { id: 'task-1', grade: 20, submitted: true, date: '2026-01-07' },
        { id: 'task-2', grade: 17, submitted: true, date: '2026-01-10' }
      ],
      average: 18.5
    },
    {
      studentId: '2024-002',
      studentName: 'Carlos Eduardo Pérez',
      avatar: 'CP',
      evaluations: [
        { id: 'project-1', grade: 17, submitted: true, date: '2026-01-04' },
        { id: 'exam-1', grade: 16, submitted: true, date: '2026-01-09' },
        { id: 'task-1', grade: 18, submitted: true, date: '2026-01-07' },
        { id: 'task-2', grade: null, submitted: false, date: null }
      ],
      average: 17.0
    },
    {
      studentId: '2024-003',
      studentName: 'María Fernanda López',
      avatar: 'ML',
      evaluations: [
        { id: 'project-1', grade: 18, submitted: true, date: '2026-01-03' },
        { id: 'exam-1', grade: 17, submitted: true, date: '2026-01-09' },
        { id: 'task-1', grade: 19, submitted: true, date: '2026-01-07' },
        { id: 'task-2', grade: 18, submitted: true, date: '2026-01-10' }
      ],
      average: 18.0
    },
    {
      studentId: '2024-004',
      studentName: 'Juan Pablo Martínez',
      avatar: 'JM',
      evaluations: [
        { id: 'project-1', grade: 16, submitted: true, date: '2026-01-04' },
        { id: 'exam-1', grade: 15, submitted: true, date: '2026-01-09' },
        { id: 'task-1', grade: 17, submitted: true, date: '2026-01-07' },
        { id: 'task-2', grade: 16, submitted: true, date: '2026-01-09' }
      ],
      average: 16.0
    },
    {
      studentId: '2024-005',
      studentName: 'Laura Isabel García',
      avatar: 'LG',
      evaluations: [
        { id: 'project-1', grade: 19, submitted: true, date: '2026-01-04' },
        { id: 'exam-1', grade: null, submitted: false, date: null },
        { id: 'task-1', grade: 20, submitted: true, date: '2026-01-06' },
        { id: 'task-2', grade: 18, submitted: true, date: '2026-01-10' }
      ],
      average: 19.0
    }
  ];

  const getGradeColor = (grade: number | null) => {
    if (grade === null) return 'text-gray-400';
    if (grade >= 18) return 'text-green-600';
    if (grade >= 16) return 'text-blue-600';
    if (grade >= 14) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredEvaluations = selectedEvaluation === 'all' 
    ? evaluations.filter(e => e.id !== 'all')
    : evaluations.filter(e => e.id === selectedEvaluation);

  const courseAverage = (grades.reduce((acc, s) => acc + s.average, 0) / grades.length).toFixed(1);
  const submittedCount = grades.filter(s => 
    s.evaluations.some(e => e.submitted && (selectedEvaluation === 'all' || e.id === selectedEvaluation))
  ).length;

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
                <span className="ml-3 px-3 py-1 bg-white bg-opacity-20 rounded-full text-black text-xs font-medium">
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
                <Link href="/professor-students" className="border-b-2 border-transparent text-white hover:text-purple-100 hover:border-purple-200 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Estudiantes
                </Link>
                <Link href="/professor-grades" className="border-b-2 border-white text-white inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Calificaciones
                </Link>
                <Link href="/meetings" className="border-b-2 border-transparent text-white hover:text-purple-100 hover:border-purple-200 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Reuniones
                </Link>
              </div>
            </div>
            <div className="ml-4 flex items-center relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center focus:outline-none"
              >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold">
                  {professor.avatar}
                </div>
                <div className="ml-3 hidden lg:block text-left">
                  <p className="text-sm font-medium text-white">{professor.name}</p>
                  <p className="text-xs text-purple-100">{professor.professorId}</p>
                </div>
                <svg className="ml-2 w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{professor.name}</p>
                    <p className="text-xs text-gray-500">{professor.email}</p>
                  </div>
                  <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Mi Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {isLoggingOut ? (
                      <>
                        <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cerrando...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Calificaciones 📊</h1>
          <p className="text-gray-600 mt-1">Registra y gestiona las calificaciones de tus estudiantes</p>
        </div>

        {/* Course & Evaluation Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Curso</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              {courses.map(course => (
                <option key={course.code} value={course.code}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Evaluación</label>
            <select
              value={selectedEvaluation}
              onChange={(e) => setSelectedEvaluation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              {evaluations.map(evaluation => (
                <option key={evaluation.id} value={evaluation.id}>
                  {evaluation.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Estudiantes</p>
                <p className="text-3xl font-bold text-gray-900">{grades.length}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl shadow-sm p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Promedio del Curso</p>
                <p className="text-3xl font-bold text-green-600">{courseAverage}</p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl shadow-sm p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">Entregas Completadas</p>
                <p className="text-3xl font-bold text-blue-600">{submittedCount}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl shadow-sm p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 mb-1">Pendientes de Calificar</p>
                <p className="text-3xl font-bold text-orange-600">
                  {grades.length - submittedCount}
                </p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition">
            + Registrar Nueva Evaluación
          </button>
          <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition">
            📊 Exportar Calificaciones
          </button>
          <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition">
            📈 Ver Estadísticas
          </button>
        </div>

        {/* Grades Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 sticky left-0 bg-gray-50">
                    Estudiante
                  </th>
                  {filteredEvaluations.map(evaluation => (
                    <th key={evaluation.id} className="text-center py-4 px-6 text-sm font-semibold text-gray-700">
                      <div>{evaluation.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{evaluation.weight}% • {evaluation.date}</div>
                    </th>
                  ))}
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700 bg-purple-50">
                    Promedio
                  </th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {grades.map((student) => (
                  <tr key={student.studentId} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6 sticky left-0 bg-white">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {student.avatar}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{student.studentName}</p>
                          <p className="text-xs text-gray-500">{student.studentId}</p>
                        </div>
                      </div>
                    </td>
                    {filteredEvaluations.map(evaluation => {
                      const evalData = student.evaluations.find(e => e.id === evaluation.id);
                      return (
                        <td key={evaluation.id} className="py-4 px-6 text-center">
                          {evalData?.submitted ? (
                            evalData.grade !== null ? (
                              <div>
                                <span className={`text-xl font-bold ${getGradeColor(evalData.grade)}`}>
                                  {evalData.grade}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">{evalData.date}</p>
                              </div>
                            ) : (
                              <button className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700 transition">
                                Calificar
                              </button>
                            )
                          ) : (
                            <span className="text-sm text-gray-400">No entregado</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="py-4 px-6 text-center bg-purple-50">
                      <span className={`text-2xl font-bold ${getGradeColor(student.average)}`}>
                        {student.average}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grade Distribution Chart */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Distribución de Calificaciones 📊</h2>
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <div className="bg-red-100 rounded-lg p-4 mb-2">
                <p className="text-3xl font-bold text-red-600">0</p>
              </div>
              <p className="text-sm text-gray-600">0-10</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-lg p-4 mb-2">
                <p className="text-3xl font-bold text-orange-600">0</p>
              </div>
              <p className="text-sm text-gray-600">11-13</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-lg p-4 mb-2">
                <p className="text-3xl font-bold text-yellow-600">1</p>
              </div>
              <p className="text-sm text-gray-600">14-15</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-lg p-4 mb-2">
                <p className="text-3xl font-bold text-blue-600">2</p>
              </div>
              <p className="text-sm text-gray-600">16-17</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-lg p-4 mb-2">
                <p className="text-3xl font-bold text-green-600">2</p>
              </div>
              <p className="text-sm text-gray-600">18-20</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
