'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated, logout } from '@/lib/services/authService';
import { StudentService, HorarioService } from '@/lib/services';

export default function SchedulePage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [horarios, setHorarios] = useState<any[]>([]);
  const [horariosOrganizados, setHorariosOrganizados] = useState<Record<string, any[]>>({});
  const [courseData, setCourseData] = useState<any>(null);
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
      avatar: 'ES',
      studentId: '',
    };
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const loadSchedule = async () => {
      try {
        setIsLoading(true);
        const userData = getUser();
        
        if (!userData) {
          router.push('/login');
          return;
        }

        // Obtener datos del estudiante
        const students = await StudentService.getAll();
        const currentStudent = students.find((s: any) => s.userId === userData.id);
        
        if (!currentStudent) {
          console.error('No se encontró el estudiante');
          return;
        }

        const course = currentStudent.course;
        setCourseData(course);
        
        // Obtener horarios del curso
        const horariosData = await HorarioService.getByCourse(course.id);
        setHorarios(horariosData);
        
        // Organizar por día
        const organizados = HorarioService.organizarPorDia(horariosData);
        setHorariosOrganizados(organizados);
        
      } catch (error) {
        console.error('Error cargando horarios:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSchedule();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push('/login');
  };

  const dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
  const diasCortos = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const getModalidadColor = (modalidad: string | null | undefined) => {
    switch (modalidad?.toUpperCase()) {
      case 'PRESENCIAL':
        return 'bg-blue-100 text-blue-700';
      case 'VIRTUAL':
        return 'bg-green-100 text-green-700';
      case 'HIBRIDO':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getModalidadIcon = (modalidad: string | null | undefined) => {
    switch (modalidad?.toUpperCase()) {
      case 'PRESENCIAL':
        return '🏫';
      case 'VIRTUAL':
        return '💻';
      case 'HIBRIDO':
        return '🔄';
      default:
        return '📚';
    }
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
                <Link href="/courses" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Cursos
                </Link>
                <Link href="/schedule" className="border-b-2 border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Horario
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
          <h1 className="text-3xl font-bold text-gray-900">Mi Horario 📅</h1>
          <p className="text-gray-600 mt-1">Visualiza tu horario semanal de clases</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Cargando tu horario...</p>
            </div>
          </div>
        ) : horarios.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay horarios disponibles</h3>
            <p className="text-gray-600">Tu curso aún no tiene horarios asignados</p>
          </div>
        ) : (
          <>
            {/* Course Info Card */}
            {courseData && (
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{courseData.nombre}</h2>
                    <p className="text-blue-100">
                      Profesor: {courseData.teacher?.user?.nombre} {courseData.teacher?.user?.apellido}
                    </p>
                  </div>
                  <div className="text-6xl">📚</div>
                </div>
              </div>
            )}

            {/* Weekly Schedule Grid */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Hora
                        </th>
                        {diasCortos.map((dia, idx) => (
                          <th key={idx} className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            {dia}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Generate time slots from 7 AM to 9 PM */}
                      {Array.from({ length: 14 }, (_, i) => {
                        const hora = 7 + i;
                        const horaStr = `${hora.toString().padStart(2, '0')}:00`;
                        const horaDisplay = `${hora > 12 ? hora - 12 : hora}:00 ${hora >= 12 ? 'PM' : 'AM'}`;
                        
                        return (
                          <tr key={hora} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {horaDisplay}
                            </td>
                            {dias.map((dia, idx) => {
                              const clasesEnHora = horariosOrganizados[dia]?.filter((h: any) => {
                                const inicio = parseInt(h.horaInicio.split(':')[0]);
                                const fin = parseInt(h.horaFin.split(':')[0]);
                                return hora >= inicio && hora < fin;
                              }) || [];
                              
                              return (
                                <td key={idx} className="px-3 py-2 text-center">
                                  {clasesEnHora.length > 0 ? (
                                    <div className="space-y-1">
                                      {clasesEnHora.map((clase: any) => (
                                        <div
                                          key={clase.id}
                                          className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-3 text-white text-left shadow-sm"
                                        >
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-semibold">
                                              {HorarioService.formatearHora(clase.horaInicio)} - {HorarioService.formatearHora(clase.horaFin)}
                                            </span>
                                            <span className="text-lg">
                                              {getModalidadIcon(clase.modalidad)}
                                            </span>
                                          </div>
                                          {clase.aula && (
                                            <p className="text-xs text-blue-100">📍 {clase.aula}</p>
                                          )}
                                          {clase.ciclo && (
                                            <p className="text-xs text-blue-100 mt-1">
                                              {clase.ciclo.titulo}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="h-16"></div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Schedule List View (Mobile Friendly) */}
            <div className="mt-8 lg:hidden space-y-4">
              {dias.map((dia, idx) => {
                const clasesDelDia = horariosOrganizados[dia] || [];
                if (clasesDelDia.length === 0) return null;
                
                return (
                  <div key={dia} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
                      <h3 className="text-lg font-bold text-white">{diasCortos[idx]} - {dia}</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {clasesDelDia.map((clase: any) => (
                        <div key={clase.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {HorarioService.formatearHora(clase.horaInicio)} - {HorarioService.formatearHora(clase.horaFin)}
                              </p>
                              {clase.aula && (
                                <p className="text-sm text-gray-600 mt-1">📍 {clase.aula}</p>
                              )}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getModalidadColor(clase.modalidad)}`}>
                              {getModalidadIcon(clase.modalidad)} {clase.modalidad || 'Sin especificar'}
                            </span>
                          </div>
                          {clase.ciclo && (
                            <p className="text-sm text-gray-600 mt-2">
                              📚 {clase.ciclo.titulo}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Modalidades</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getModalidadColor('PRESENCIAL')}`}>
                    🏫 Presencial
                  </span>
                  <span className="text-sm text-gray-600">Clases en el campus</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getModalidadColor('VIRTUAL')}`}>
                    💻 Virtual
                  </span>
                  <span className="text-sm text-gray-600">Clases en línea</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getModalidadColor('HIBRIDO')}`}>
                    🔄 Híbrido
                  </span>
                  <span className="text-sm text-gray-600">Combinación de ambas</span>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
