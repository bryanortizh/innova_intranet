'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated, logout } from '@/lib/services/authService';
import { CourseService, TeacherService } from '@/lib/services';

export default function ProfessorCoursesPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [teacherId, setTeacherId] = useState<number | null>(null);
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
    // Verificar autenticación
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const loadCourses = async () => {
      try {
        setIsLoading(true);
        const userData = getUser();
        
        if (!userData) {
          router.push('/login');
          return;
        }

        // Obtener datos del profesor
        const teachers = await TeacherService.getAll();
        const teacher = teachers.find((t: any) => t.userId === userData.id);
        
        if (!teacher) {
          console.error('No se encontró el profesor');
          return;
        }

        setTeacherId(teacher.id);

        // Obtener cursos del profesor
        const teacherCourses = await CourseService.getByTeacher(teacher.id);
        
        // Obtener estudiantes de cada curso
        const coursesWithData = await Promise.all(
          teacherCourses.map(async (course: any) => {
            const students = await CourseService.getStudents(course.id);
            
            return {
              id: course.id,
              name: course.nombre,
              code: course.codigo || `CURSO-${course.id}`,
              semester: '2026-1',
              schedule: course.horario || 'Horario por definir',
              students: students.length,
              pendingTasks: 0, // TODO: calcular tareas pendientes
              averageGrade: 0, // TODO: calcular promedio de notas
              attendance: 0, // TODO: calcular asistencia
              color: ['purple', 'blue', 'green', 'indigo', 'pink'][course.id % 5],
              room: course.aula || 'Por asignar',
              description: course.descripcion || 'Sin descripción'
            };
          })
        );

        setCourses(coursesWithData);
      } catch (error) {
        console.error('Error cargando cursos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push('/login');
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
                <span className="ml-3 px-3 py-1 bg-white bg-opacity-20 rounded-full text-black text-xs font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900">Mis Cursos 📚</h1>
          <p className="text-gray-600 mt-1">Gestiona tus cursos y contenido académico</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Cursos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoading ? '...' : courses.length}
                </p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl shadow-sm p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 mb-1">Total Estudiantes</p>
                <p className="text-3xl font-bold text-purple-600">
                  {isLoading ? '...' : courses.reduce((acc, c) => acc + c.students, 0)}
                </p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl shadow-sm p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 mb-1">Tareas Pendientes</p>
                <p className="text-3xl font-bold text-orange-600">
                  {isLoading ? '...' : courses.reduce((acc, c) => acc + c.pendingTasks, 0)}
                </p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl shadow-sm p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Promedio General</p>
                <p className="text-3xl font-bold text-green-600">
                  {isLoading ? '...' : courses.length > 0 ? (courses.reduce((acc, c) => acc + c.averageGrade, 0) / courses.length).toFixed(1) : '0.0'}
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
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Cargando cursos...</p>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes cursos asignados</h3>
            <p className="text-gray-600 mb-6">Cuando te asignen cursos, aparecerán aquí</p>
            <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition">
              Contactar administración
            </button>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">
              {/* Course Header */}
              <div className={`h-32 bg-gradient-to-br from-${course.color}-500 to-${course.color}-600 p-6 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-2">
                    <span className="inline-block px-3 py-1 bg-white text-black bg-opacity-30 backdrop-blur-sm rounded-full  text-xs font-medium">
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
        )}
      </main>
    </div>
  );
}
