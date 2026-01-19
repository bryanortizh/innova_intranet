'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, logout, isAuthenticated } from '@/lib/services/authService';
import { StudentService, TareaService } from '@/lib/services';

interface Student {
  id: number;
  userId: number;
  course: {
    id: number;
    nombre: string;
    teacher?: {
      user: {
        nombre: string;
        apellido: string;
      };
    };
  };
}

interface Tarea {
  id: number;
  titulo: string;
  courseId: number;
  fechaLimite?: string;
}

interface Entrega {
  id: number;
  studentId: number;
  tareaId: number;
}

interface Course {
  id: number;
  name: string;
  professor: string;
  progress: number;
  color: string;
}

interface UpcomingTask {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  delivered: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([]);
  const [stats, setStats] = useState({
    coursesCount: 0,
    tasksCount: 0,
    average: 0,
    meetings: 0
  });
  const [user, setUser] = useState({
    name: '',
    email: '',
    avatar: '',
    studentId: ''
  });

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Cargar datos del usuario y sus cursos/tareas
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const userData = getUser();
        if (userData) {
          setUser({
            name: `${userData.nombre} ${userData.apellido}`,
            email: userData.email,
            avatar: `${userData.nombre[0]}${userData.apellido[0]}`.toUpperCase(),
            studentId: `ALU-${String(userData.id).padStart(3, '0')}`
          });

          // Obtener datos del estudiante
          const students = await StudentService.getAll();
          const currentStudent = students.find((s: Student) => s.userId === userData.id);
          
          if (!currentStudent) {
            console.error('No se encontró el estudiante');
            return;
          }

          // Cargar curso del estudiante
          const courseData = currentStudent.course;
          const coursesData = [{
            id: courseData.id,
            name: courseData.nombre,
            professor: courseData.teacher 
              ? `Prof. ${courseData.teacher.user.nombre} ${courseData.teacher.user.apellido}`
              : 'Sin profesor',
            progress: 0, // TODO: calcular progreso real
            color: ['blue', 'green', 'purple', 'pink'][courseData.id % 4]
          }];
          setRecentCourses(coursesData);

          // Cargar tareas del curso
          try {
            const allTareas = await TareaService.getAll();
            const courseTareas = allTareas.filter((t: Tarea) => t.courseId === courseData.id);
            
            // Obtener tareas con entregas
            const tasksWithDeliveries = await Promise.all(
              courseTareas.slice(0, 3).map(async (tarea: Tarea) => {
                try {
                  const entregas = await TareaService.getEntregas(tarea.id);
                  const myDelivery = entregas.find((e: Entrega) => e.studentId === currentStudent.id);
                  
                  return {
                    id: tarea.id,
                    title: tarea.titulo,
                    course: courseData.nombre,
                    dueDate: tarea.fechaLimite ? new Date(tarea.fechaLimite).toLocaleDateString('es-ES') : 'Sin fecha',
                    priority: (myDelivery ? 'low' : 'high') as 'low' | 'medium' | 'high',
                    delivered: !!myDelivery
                  };
                } catch (error) {
                  return {
                    id: tarea.id,
                    title: tarea.titulo,
                    course: courseData.nombre,
                    dueDate: tarea.fechaLimite ? new Date(tarea.fechaLimite).toLocaleDateString('es-ES') : 'Sin fecha',
                    priority: 'medium' as 'low' | 'medium' | 'high',
                    delivered: false
                  };
                }
              })
            );

            const pendingTasks = tasksWithDeliveries.filter(t => !t.delivered);
            setUpcomingTasks(pendingTasks);

            // Actualizar stats
            setStats({
              coursesCount: 1,
              tasksCount: pendingTasks.length,
              average: 0, // TODO: calcular promedio real
              meetings: 0 // TODO: implementar reuniones
            });
          } catch (error) {
            console.error('Error cargando tareas:', error);
          }
        }
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push('/login');
  };

  const statsDisplay = [
    { label: 'Cursos Activos', value: stats.coursesCount.toString(), icon: '📚', color: 'from-blue-500 to-blue-600' },
    { label: 'Tareas Pendientes', value: stats.tasksCount.toString(), icon: '📝', color: 'from-orange-500 to-orange-600' },
    { label: 'Promedio General', value: stats.average > 0 ? stats.average.toFixed(1) : '--', icon: '⭐', color: 'from-green-500 to-green-600' },
    { label: 'Próximas Reuniones', value: stats.meetings.toString(), icon: '📹', color: 'from-purple-500 to-purple-600' },
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
              <div className="ml-4 flex items-center relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center focus:outline-none"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.avatar}
                  </div>
                  <div className="ml-3 hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-700">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.studentId}</p>
                  </div>
                  <svg className="ml-2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
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
          <h1 className="text-3xl font-bold text-gray-900">¡Bienvenido, {user.name}! 👋</h1>
          <p className="text-gray-600 mt-1">Aquí está tu resumen de actividades académicas</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-20"></div>
              </div>
            ))
          ) : (
            statsDisplay.map((stat, index) => (
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
          )))}
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
                {isLoading ? (
                  <div className="text-center py-8">
                    <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : recentCourses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No tienes cursos asignados</p>
                  </div>
                ) : (
                  recentCourses.map((course) => (
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
                  ))
                )}
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
                {isLoading ? (
                  <div className="text-center py-8">
                    <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : upcomingTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>¡Genial! No tienes tareas pendientes</p>
                  </div>
                ) : (
                  upcomingTasks.map((task) => (
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
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 mt-6 text-white">
              <h3 className="text-lg font-bold mb-4">Acciones Rápidas</h3>
              <div className="space-y-2">
                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-4 py-3 text-left transition text-black">
                  📝 Enviar Tarea
                </button>
                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-4 py-3 text-left transition text-black">
                  📹 Unirse a Reunión
                </button>
                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-4 py-3 text-left transition text-black">
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
