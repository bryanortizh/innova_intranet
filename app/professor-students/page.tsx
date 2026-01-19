'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated, logout } from '@/lib/services/authService';
import { CourseService, TeacherService } from '@/lib/services';

export default function ProfessorStudentsPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([{ code: 'all', name: 'Todos los cursos' }]);
  const [teacherCourses, setTeacherCourses] = useState<any[]>([]);
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
      return;
    }

    const loadStudentsData = async () => {
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

        // Obtener cursos del profesor
        const courses = await CourseService.getByTeacher(teacher.id);
        setTeacherCourses(courses);
        
        // Actualizar lista de cursos para el filtro
        const coursesForFilter = [
          { code: 'all', name: 'Todos los cursos', id: null },
          ...courses.map((course: any) => ({
            code: course.codigo || `CURSO-${course.id}`,
            name: course.nombre,
            id: course.id
          }))
        ];
        setCourses(coursesForFilter);

        // Cargar estudiantes de todos los cursos inicialmente
        await loadStudentsForCourses(courses);
      } catch (error) {
        console.error('Error cargando estudiantes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentsData();
  }, [router]);

  // Función para cargar estudiantes de cursos específicos
  const loadStudentsForCourses = async (coursesToLoad: any[]) => {
    try {
      const allStudents: any[] = [];
      
      for (const course of coursesToLoad) {
        const courseStudents = await CourseService.getStudents(course.id);
        
        courseStudents.forEach((student: any) => {
          const studentKey = `${student.id}-${course.id}`;
          
          allStudents.push({
            id: student.id,
            uniqueKey: studentKey,
            name: `${student.user.nombre} ${student.user.apellido}`,
            studentId: `EST-${String(student.id).padStart(3, '0')}`,
            email: student.user.email,
            course: course.codigo || `CURSO-${course.id}`,
            courseName: course.nombre,
            courseId: course.id,
            grade: 0, // TODO: calcular promedio real
            attendance: 0, // TODO: calcular asistencia real
            lastSubmission: '-',
            status: 'good',
            avatar: `${student.user.nombre[0]}${student.user.apellido[0]}`.toUpperCase()
          });
        });
      }

      setStudents(allStudents);
    } catch (error) {
      console.error('Error cargando estudiantes:', error);
    }
  };

  // Manejar cambio de curso en el select
  const handleCourseChange = async (courseCode: string) => {
    setSelectedCourse(courseCode);
    setIsLoading(true);

    try {
      if (courseCode === 'all') {
        // Cargar estudiantes de todos los cursos
        await loadStudentsForCourses(teacherCourses);
      } else {
        // Cargar estudiantes solo del curso seleccionado
        const selectedCourseData = courses.find(c => c.code === courseCode);
        if (selectedCourseData && selectedCourseData.id) {
          const courseStudents = await CourseService.getStudents(selectedCourseData.id);
          
          const studentsData = courseStudents.map((student: any) => ({
            id: student.id,
            uniqueKey: `${student.id}-${selectedCourseData.id}`,
            name: `${student.user.nombre} ${student.user.apellido}`,
            studentId: `EST-${String(student.id).padStart(3, '0')}`,
            email: student.user.email,
            course: selectedCourseData.code,
            courseName: selectedCourseData.name,
            courseId: selectedCourseData.id,
            grade: 0,
            attendance: 0,
            lastSubmission: '-',
            status: 'good',
            avatar: `${student.user.nombre[0]}${student.user.apellido[0]}`.toUpperCase()
          }));
          
          setStudents(studentsData);
        }
      }
    } catch (error) {
      console.error('Error al cambiar curso:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push('/login');
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.includes(searchTerm) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    // Ya no filtramos por curso aquí porque se hace en el backend
    return matchesSearch;
  });

  // Contar estudiantes únicos (sin duplicados)
  const uniqueStudentIds = new Set(students.map(s => s.id));
  const uniqueStudentCount = uniqueStudentIds.size;
  
  // Calcular estadísticas únicas
  const uniqueStudents = Array.from(uniqueStudentIds).map(id => {
    return students.find(s => s.id === id);
  }).filter(Boolean);

  const excellentCount = uniqueStudents.filter(s => s.status === 'excellent').length;
  const warningCount = uniqueStudents.filter(s => s.status === 'warning').length;
  const avgGrade = uniqueStudents.length > 0 
    ? (uniqueStudents.reduce((acc, s) => acc + s.grade, 0) / uniqueStudents.length).toFixed(1)
    : '0.0';

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
                <span className="ml-3 px-3 py-1 bg-white text-black bg-opacity-20 rounded-full text-xs font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900">Mis Estudiantes 👨‍🎓</h1>
          <p className="text-gray-600 mt-1">Consulta y gestiona el desempeño de tus estudiantes</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Estudiantes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoading ? '...' : uniqueStudentCount}
                </p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl shadow-sm p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Rendimiento Excelente</p>
                <p className="text-3xl font-bold text-green-600">
                  {isLoading ? '...' : excellentCount}
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
                  {isLoading ? '...' : warningCount}
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
                  {isLoading ? '...' : avgGrade}
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
                onChange={(e) => handleCourseChange(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Cargando estudiantes...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron estudiantes</h3>
            <p className="text-gray-500">
              {students.length === 0 
                ? 'No tienes estudiantes asignados en tus cursos'
                : 'Intenta con otros términos de búsqueda o filtros'
              }
            </p>
          </div>
        ) : (
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
                  <tr key={student.uniqueKey || student.id} className="border-b hover:bg-gray-50 transition">
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
        )}
      </main>
    </div>
  );
}
