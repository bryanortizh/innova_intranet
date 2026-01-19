'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated, logout } from '@/lib/services/authService';
import { StudentService, HorarioService } from '@/lib/services';

export default function CoursesPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [studentData, setStudentData] = useState<any>(null);
  const [horarios, setHorarios] = useState<any[]>([]);
  const [horariosOrganizados, setHorariosOrganizados] = useState<Record<string, any[]>>({});
  const [student] = useState(() => {
    const userData = getUser();
    if (userData) {
      return {
        name: `${userData.nombre} ${userData.apellido}`,
        email: userData.email,
        avatar: `${userData.nombre[0]}${userData.apellido[0]}`.toUpperCase(),
        studentId: `EST-${String(userData.id).padStart(3, '0')}`,
      };
    }
    return {
      name: '',
      email: '',
      avatar: 'JP',
      studentId: '',
    };
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const loadStudentCourses = async () => {
      try {
        setIsLoading(true);
        const userData = getUser();
        
        if (!userData) {
          router.push('/login');
          return;
        }

        // Obtener todos los estudiantes para encontrar el del usuario actual
        const students = await StudentService.getAll();
        const currentStudent = students.find((s: any) => s.userId === userData.id);
        
        if (!currentStudent) {
          console.error('No se encontró el estudiante');
          return;
        }

        setStudentData(currentStudent);

        // El estudiante tiene un curso asignado
        const coursesData = [{
          id: currentStudent.course.id,
          name: currentStudent.course.nombre,
          code: `CURSO-${currentStudent.course.id}`,
          professor: currentStudent.course.teacher 
            ? `Prof. ${currentStudent.course.teacher.user.nombre} ${currentStudent.course.teacher.user.apellido}`
            : 'Sin profesor asignado',
          schedule: 'Horario por definir',
          progress: 0, // TODO: calcular progreso real
          students: 0, // TODO: contar estudiantes
          semester: '2026-1',
          color: ['blue', 'green', 'purple', 'pink', 'yellow', 'indigo'][currentStudent.course.id % 6],
          description: 'Curso activo del semestre actual'
        }];

        setCourses(coursesData);

        // Cargar horarios del curso
        try {
          const horariosData = await HorarioService.getByCourse(currentStudent.course.id);
          setHorarios(horariosData);
          
          // Organizar por día
          const organizados = HorarioService.organizarPorDia(horariosData);
          setHorariosOrganizados(organizados);
        } catch (error) {
          console.error('Error cargando horarios:', error);
        }
      } catch (error) {
        console.error('Error cargando cursos del estudiante:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentCourses();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push('/login');
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
            <div className="ml-4 flex items-center relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center focus:outline-none"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {student.avatar}
                </div>
                <div className="ml-3 hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.studentId}</p>
                </div>
                <svg className="ml-2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.email}</p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : courses.length}
                </p>
                <p className="text-xs text-gray-500">Cursos Activos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">--</p>
                <p className="text-xs text-gray-500">Promedio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Cargando tus cursos...</p>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes cursos asignados</h3>
            <p className="text-gray-600 mb-6">Cuando te asignen un curso, aparecerá aquí</p>
          </div>
        ) : (
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
        )}

        {/* Calendar Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Horario Semanal 📅</h2>
            <Link 
              href="/schedule" 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              Ver horario completo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {horarios.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📅</div>
              <p>No hay horarios disponibles</p>
            </div>
          ) : (
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
                  {Array.from({ length: 7 }, (_, i) => {
                    const hora = 8 + (i * 2);
                    const horaStr = `${hora.toString().padStart(2, '0')}:00`;
                    const horaFinStr = `${(hora + 2).toString().padStart(2, '0')}:00`;
                    const horaDisplay = `${hora > 12 ? hora - 12 : hora}:00-${hora + 2 > 12 ? (hora + 2) - 12 : hora + 2}:00 ${hora >= 12 ? 'PM' : 'AM'}`;
                    const dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
                    
                    return (
                      <tr key={hora} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600 font-medium">{horaDisplay}</td>
                        {dias.map((dia, idx) => {
                          const clasesEnHora = horariosOrganizados[dia]?.filter((h: any) => {
                            const inicio = parseInt(h.horaInicio.split(':')[0]);
                            const fin = parseInt(h.horaFin.split(':')[0]);
                            return hora >= inicio && hora < fin;
                          }) || [];
                          
                          const colors = ['blue', 'green', 'purple', 'pink', 'yellow', 'indigo'];
                          const color = colors[idx % colors.length];
                          
                          return (
                            <td key={idx} className="py-3 px-4">
                              {clasesEnHora.length > 0 ? (
                                <div className="space-y-1">
                                  {clasesEnHora.map((clase: any) => (
                                    <div
                                      key={clase.id}
                                      className={`bg-${color}-100 border-l-4 border-${color}-500 p-2 rounded hover:bg-${color}-200 transition cursor-pointer`}
                                      title={`${HorarioService.formatearHora(clase.horaInicio)} - ${HorarioService.formatearHora(clase.horaFin)}${clase.aula ? ` | ${clase.aula}` : ''}`}
                                    >
                                      <p className={`text-xs font-medium text-${color}-800`}>
                                        {clase.course?.nombre || 'Curso'}
                                      </p>
                                      {clase.aula && (
                                        <p className={`text-xs text-${color}-600 mt-1`}>📍 {clase.aula}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
