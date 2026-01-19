'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated, logout } from '@/lib/services/authService';
import { StudentService, TareaService, ExamenService } from '@/lib/services';

interface Examen {
  id: number;
  courseId: number;
  titulo: string;
}

interface ExamenRealizado {
  studentId: number;
  calificacion?: number | null | undefined;
  finalizadoAt?: string | null | undefined;
}

interface Tarea {
  id: number;
  courseId: number;
  titulo: string;
}

interface TareaEntregada {
  studentId: number;
  calificacion?: number | null | undefined;
  entregadoAt: string;
}

interface Student {
  id: number;
  userId: number;
  course: {
    id: number;
    nombre: string;
  };
}

interface Evaluation {
  name: string;
  grade: number;
  weight: number;
  date: string;
  type: string;
}

export default function GradesPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('2026-1');
  const [isLoading, setIsLoading] = useState(true);
  const [grades, setGrades] = useState<Array<{
    id: number;
    course: string;
    code: string;
    evaluations: Evaluation[];
    finalGrade: number;
    color: string;
  }>>([]);
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

    const loadGradesData = async () => {
      try {
        setIsLoading(true);
        const userData = getUser();
        
        if (!userData) {
          router.push('/login');
          return;
        }

        // Obtener datos del estudiante
        const students = await StudentService.getAll();
        const currentStudent = students.find((s: Student) => s.userId === userData.id);
        
        if (!currentStudent) {
          console.error('No se encontró el estudiante');
          return;
        }

        const courseData = currentStudent.course;
        
        // Obtener tareas con calificaciones
        const allTareas = await TareaService.getAll();
        const courseTareas = allTareas.filter((t: Tarea) => t.courseId === courseData.id);
        
        const tareasEvaluations = await Promise.all(
          courseTareas.map(async (tarea: Tarea) => {
            try {
              const entregas = await TareaService.getEntregas(tarea.id);
              const myDelivery = entregas.find((e: TareaEntregada) => e.studentId === currentStudent.id);
              
              if (myDelivery && myDelivery.calificacion !== null) {
                return {
                  name: tarea.titulo,
                  grade: myDelivery.calificacion,
                  weight: 10,
                  date: new Date(myDelivery.entregadoAt).toLocaleDateString('es-ES'),
                  type: 'tarea'
                };
              }
              return null;
            } catch (error) {
              return null;
            }
          })
        );

        // Obtener exámenes con calificaciones
        const allExamenes = await ExamenService.getAll();
        const courseExamenes = allExamenes.filter((e: Examen) => e.courseId === courseData.id);
        
        const examenesEvaluations = await Promise.all(
          courseExamenes.map(async (examen: Examen) => {
            try {
              const realizados = await ExamenService.getRealizados(examen.id);
              const myExam = realizados.find((r: ExamenRealizado) => r.studentId === currentStudent.id);
              
              if (myExam && myExam.calificacion !== null) {
                return {
                  name: examen.titulo,
                  grade: myExam.calificacion,
                  weight: 20,
                  date: myExam.finalizadoAt ? new Date(myExam.finalizadoAt).toLocaleDateString('es-ES') : 'N/A',
                  type: 'examen'
                };
              }
              return null;
            } catch (error) {
              return null;
            }
          })
        );

        const allEvaluations = [...tareasEvaluations, ...examenesEvaluations].filter(Boolean) as Evaluation[];
        
        if (allEvaluations.length > 0) {
          const finalGrade = allEvaluations.reduce((acc, e: Evaluation) => acc + e.grade, 0) / allEvaluations.length;
          
          setGrades([{
            id: courseData.id,
            course: courseData.nombre,
            code: `CURSO-${courseData.id}`,
            evaluations: allEvaluations,
            finalGrade: parseFloat(finalGrade.toFixed(2)),
            color: ['blue', 'green', 'purple', 'pink'][courseData.id % 4]
          }]);
        } else {
          setGrades([]);
        }
      } catch (error) {
        console.error('Error cargando notas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGradesData();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push('/login');
  };

  const overallAverage = grades.length > 0 
    ? (grades.reduce((acc, g) => acc + g.finalGrade, 0) / grades.length).toFixed(2)
    : '0.00';
  
  const totalEvaluations = grades.reduce((acc, g) => acc + g.evaluations.length, 0);
  const bestGrade = grades.length > 0 
    ? Math.max(...grades.map(g => g.finalGrade)).toFixed(1)
    : '0.0';

  const getGradeColor = (grade: number) => {
    if (grade >= 18) return 'text-green-600';
    if (grade >= 14) return 'text-blue-600';
    if (grade >= 11) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeStatus = (grade: number) => {
    if (grade >= 18) return '🌟 Excelente';
    if (grade >= 14) return '✅ Aprobado';
    if (grade >= 11) return '⚠️ Regular';
    return '❌ Desaprobado';
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
                <Link href="/grades" className="border-b-2 border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900">Mis Notas 📊</h1>
          <p className="text-gray-600 mt-1">Visualiza tu rendimiento académico y calificaciones</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Promedio General</p>
                <p className="text-4xl font-bold">{overallAverage}</p>
              </div>
              <div className="text-5xl">⭐</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Cursos Aprobados</p>
                <p className="text-3xl font-bold text-gray-900">{grades.length}/{grades.length}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mejor Nota</p>
                <p className="text-3xl font-bold text-green-600">{bestGrade}</p>
              </div>
              <div className="text-4xl">🏆</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Evaluaciones</p>
                <p className="text-3xl font-bold text-gray-900">{totalEvaluations}</p>
              </div>
              <div className="text-4xl">📝</div>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Periodo Académico</h2>
              <p className="text-sm text-gray-500">Selecciona el periodo que deseas ver</p>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="2026-1">2026-1 (Actual)</option>
              <option value="2025-2">2025-2</option>
              <option value="2025-1">2025-1</option>
            </select>
          </div>
        </div>

        {/* Grades by Course */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Cargando tus calificaciones...</p>
            </div>
          </div>
        ) : grades.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes calificaciones registradas</h3>
            <p className="text-gray-600">Las calificaciones aparecerán aquí cuando tus profesores las publiquen</p>
          </div>
        ) : (
        <div className="space-y-6">
          {grades.map((courseGrade) => (
            <div key={courseGrade.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Course Header */}
              <div className={`bg-gradient-to-r from-${courseGrade.color}-500 to-${courseGrade.color}-600 p-6`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-white">
                    <p className="text-sm opacity-90 mb-1">{courseGrade.code}</p>
                    <h3 className="text-xl font-bold">{courseGrade.course}</h3>
                  </div>
                  <div className="mt-4 sm:mt-0 text-right">
                    <p className="text-white text-sm opacity-90 mb-1">Nota Final</p>
                    <p className="text-4xl font-bold text-white">{courseGrade.finalGrade}</p>
                    <p className="text-white text-sm mt-1">{getGradeStatus(courseGrade.finalGrade)}</p>
                  </div>
                </div>
              </div>

              {/* Evaluations Table */}
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Evaluación</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Fecha</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Peso (%)</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Nota</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courseGrade.evaluations.map((evaluation, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50 transition">
                          <td className="py-3 px-4">
                            <p className="text-sm font-medium text-gray-900">{evaluation.name}</p>
                          </td>
                          <td className="py-3 px-4 text-center text-sm text-gray-600">
                            {evaluation.date}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block px-2 py-1 bg-gray-100 rounded text-sm font-medium text-gray-700">
                              {evaluation.weight}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`text-lg font-bold ${getGradeColor(evaluation.grade)}`}>
                              {evaluation.grade}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {evaluation.grade >= 14 ? (
                              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                Aprobado
                              </span>
                            ) : evaluation.grade >= 11 ? (
                              <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                Regular
                              </span>
                            ) : (
                              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                Desaprobado
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Progress to Final Grade */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progreso de Evaluaciones</span>
                    <span className="text-sm text-gray-600">
                      {courseGrade.evaluations.reduce((acc, e) => acc + e.weight, 0)}% completado
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r from-${courseGrade.color}-400 to-${courseGrade.color}-600 h-2 rounded-full`}
                      style={{ width: `${courseGrade.evaluations.reduce((acc, e) => acc + e.weight, 0)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Performance Chart Placeholder */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Evolución de Notas 📈</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-5xl mb-3">📊</div>
              <p className="text-gray-500">Gráfico de evolución de notas</p>
              <p className="text-sm text-gray-400 mt-1">Próximamente: visualización interactiva</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
