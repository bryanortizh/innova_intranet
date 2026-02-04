'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, logout, isAuthenticated } from '@/lib/services/authService';
import { CourseService, TeacherService } from '@/lib/services';
import type { courses_intra } from '@prisma/client';

export default function ProfessorDashboardPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [professor] = useState(() => {
    const userData = getUser();
    if (userData) {
      return {
        name: `Prof. ${userData.nombre} ${userData.apellido}`,
        email: userData.email,
        avatar: `${userData.nombre[0]}${userData.apellido[0]}`.toUpperCase(),
        professorId: `PROF-${String(userData.id).padStart(3, '0')}`,
        userId: userData.id
      };
    }
    return {
      name: '',
      email: '',
      avatar: '',
      professorId: '',
      userId: null
    };
  });

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Cargar datos del profesor y sus cursos
    const loadTeacherData = async () => {
      try {
        setIsLoading(true);

        // Obtener datos del profesor por userId
        const teachers = await TeacherService.getAll();
        const teacher = teachers.find((t: any) => t.userId === professor.userId);

        if (!teacher) {
          console.error('No se encontró el profesor');
          return;
        }

        setTeacherId(teacher.id);

        // Obtener cursos del profesor
        const courses = await CourseService.getByTeacher(teacher.id);

        // Obtener todos los estudiantes de todos los cursos en una sola llamada
        let studentsByCourse: Record<number, any[]> = {};
        try {
          // Llama solo una vez al endpoint con 'all'
          const token = localStorage.getItem('token');
          const res = await fetch('/api/courses-intra/all/students', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            studentsByCourse = data.studentsByCourse || {};
          }
        } catch (err) {
          console.error('Error obteniendo estudiantes:', err);
        }

        // Calcular el total de estudiantes únicos en todos los cursos
        // Sumar el total de estudiantes de todos los cursos (puede haber repetidos si un estudiante está en varios cursos)
        let studentsCount = Object.values(studentsByCourse).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0);
        // Fallback: si studentsByCourse está vacío, sumar los students de los cursos
        if (studentsCount === 0 && courses.length > 0) {
          studentsCount = courses.reduce((acc: number, course: any) => acc + (Array.isArray(course.students) ? course.students.length : 0), 0);
        }

        const coursesWithData = courses.map((course: any) => {
          const students = studentsByCourse[course.id] || [];
          return {
            id: course.id,
            name: course.nombre,
            code: course.codigo || `CURSO-${course.id}`,
            students: students.length,
            schedule: course.horario || 'Horario por definir',
            pending: 0, // TODO: calcular tareas pendientes
            color: ['purple', 'blue', 'green', 'indigo', 'pink'][course.id % 5],
            cantidadEstudiantes: course.students.length,
          };
        });

        setMyCourses(coursesWithData);
        setTotalStudents(studentsCount);
      } catch (error) {
        console.error('Error cargando datos del profesor:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeacherData();
  }, [router, professor.userId]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push('/login');
  };

  const stats = [
    { label: 'Mis Cursos', value: myCourses.length.toString(), icon: '📚', color: 'from-blue-500 to-blue-600' },
    { label: 'Total Estudiantes', value: totalStudents.toString(), icon: '👥', color: 'from-green-500 to-green-600' },
    { label: 'Tareas Pendientes', value: '0', icon: '📝', color: 'from-orange-500 to-orange-600' },
    { label: 'Reuniones Hoy', value: '0', icon: '📹', color: 'from-purple-500 to-purple-600' },
  ];



  const recentActivity = [
    { 
      id: 1, 
      type: 'submission', 
      message: 'Juan Pérez entregó "Proyecto Final React"', 
      course: 'INF-305',
      time: 'Hace 10 min',
      icon: '📄'
    },
    { 
      id: 2, 
      type: 'question', 
      message: 'María García preguntó sobre el Examen Parcial', 
      course: 'INF-405',
      time: 'Hace 25 min',
      icon: '❓'
    },
    { 
      id: 3, 
      type: 'grade', 
      message: 'Calificaste 12 tareas de "Bases de Datos"', 
      course: 'INF-201',
      time: 'Hace 1 hora',
      icon: '✅'
    },
    { 
      id: 4, 
      type: 'meeting', 
      message: 'Reunión "Tutoría Grupal" finalizada', 
      course: 'INF-305',
      time: 'Hace 2 horas',
      icon: '🎥'
    },
  ];

  const upcomingMeetings = [
    { 
      id: 1, 
      title: 'Clase Virtual INF-305', 
      time: '16:00 - 18:00', 
      platform: 'Zoom',
      students: 35 
    },
    { 
      id: 2, 
      title: 'Asesoría Individual', 
      time: '18:30 - 19:00', 
      platform: 'Google Meet',
      students: 1 
    },
    { 
      id: 3, 
      title: 'Clase Virtual INF-502', 
      time: '19:00 - 21:00', 
      platform: 'Microsoft Teams',
      students: 37 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
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
                <Link href="/professor-dashboard" className="border-b-2 border-white text-white inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/professor-courses" className="border-b-2 border-transparent text-white hover:text-purple-100 hover:border-purple-200 inline-flex items-center px-1 pt-1 text-sm font-medium">
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
              <button className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 relative">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
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
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">¡Bienvenido, {professor.name}! 👋</h1>
          <p className="text-gray-600 mt-1">Aquí está tu resumen del día</p>
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
          {/* My Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Mis Cursos 📚</h2>
                <Link href="/professor-courses" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  Ver todos →
                </Link>
              </div>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <svg className="animate-spin h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : myCourses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg">📚</p>
                    <p className="mt-2">No tienes cursos asignados</p>
                  </div>
                ) : (
                  myCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{course.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium bg-${course.color}-100 text-${course.color}-700`}>
                            {course.code}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{course.schedule}</p>
                      </div>
                      {course.pending > 0 && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          {course.pending} pendientes
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {course.cantidadEstudiantes} estudiantes
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700 transition">
                          Ver Curso
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50 transition">
                          Gestionar
                        </button>
                        <a
                          href={`/courses-instructivo/profesor?id=${course.id}`}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition"
                        >
                          Ver Instructivo
                        </a>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Actividad Reciente 📊</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-purple-600 font-medium">{activity.course}</span>
                        <span className="text-xs text-gray-500">• {activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div>
            {/* Today's Meetings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Reuniones de Hoy 🎥</h2>
                <Link href="/meetings" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  Ver todas →
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50 rounded-r-lg">
                    <h4 className="font-medium text-gray-900 text-sm">{meeting.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                      <span>🕐 {meeting.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">{meeting.platform} • {meeting.students} estudiantes</span>
                      <button className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition">
                        Unirse
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-sm p-6 mt-6 text-white">
              <h3 className="text-lg font-bold mb-4">Acciones Rápidas</h3>
              <div className="space-y-2">
                <button className="w-full bg-white text-black bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-4 py-3 text-left transition">
                  📝 Crear Nueva Tarea
                </button>
                <button className="w-full bg-white text-black bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-4 py-3 text-left transition">
                  📊 Registrar Calificaciones
                </button>
                <button className="w-full bg-white text-black bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-4 py-3 text-left transition">
                  📹 Programar Reunión
                </button>
                <button className="w-full bg-white text-black bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-4 py-3 text-left transition">
                  📢 Enviar Anuncio
                </button>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Horario de Consulta 🕐</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Lunes - Viernes</span>
                  <span className="font-medium text-gray-900">18:00 - 19:00</span>
                </div>
                <div className="pt-3 border-t">
                  <button className="w-full py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition">
                    Modificar Horario
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
