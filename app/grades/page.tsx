'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function GradesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('2026-1');

  const grades = [
    {
      id: 1,
      course: 'Matemáticas Avanzadas',
      code: 'MAT-301',
      evaluations: [
        { name: 'Examen Parcial 1', grade: 18, weight: 20, date: '2026-01-05' },
        { name: 'Tarea 1', grade: 17, weight: 10, date: '2026-01-08' },
        { name: 'Laboratorio', grade: 19, weight: 15, date: '2026-01-10' },
        { name: 'Participación', grade: 16, weight: 5, date: '2026-01-11' }
      ],
      finalGrade: 17.5,
      color: 'blue'
    },
    {
      id: 2,
      course: 'Física Cuántica',
      code: 'FIS-402',
      evaluations: [
        { name: 'Examen Parcial 1', grade: 16, weight: 20, date: '2026-01-06' },
        { name: 'Trabajo Práctico', grade: 18, weight: 15, date: '2026-01-09' },
        { name: 'Quiz', grade: 15, weight: 10, date: '2026-01-10' }
      ],
      finalGrade: 16.3,
      color: 'green'
    },
    {
      id: 3,
      course: 'Programación Web',
      code: 'INF-305',
      evaluations: [
        { name: 'Proyecto 1', grade: 19, weight: 25, date: '2026-01-04' },
        { name: 'Tarea HTML/CSS', grade: 20, weight: 10, date: '2026-01-07' },
        { name: 'Examen Teórico', grade: 18, weight: 20, date: '2026-01-09' },
        { name: 'Participación', grade: 17, weight: 5, date: '2026-01-11' }
      ],
      finalGrade: 18.5,
      color: 'purple'
    },
    {
      id: 4,
      course: 'Literatura Española',
      code: 'LIT-201',
      evaluations: [
        { name: 'Ensayo 1', grade: 16, weight: 20, date: '2026-01-05' },
        { name: 'Exposición', grade: 17, weight: 15, date: '2026-01-08' },
        { name: 'Análisis de Texto', grade: 15, weight: 10, date: '2026-01-10' }
      ],
      finalGrade: 16.0,
      color: 'pink'
    },
    {
      id: 5,
      course: 'Química Orgánica',
      code: 'QUI-303',
      evaluations: [
        { name: 'Laboratorio 1', grade: 17, weight: 15, date: '2026-01-06' },
        { name: 'Examen Parcial', grade: 15, weight: 20, date: '2026-01-09' },
        { name: 'Informe', grade: 16, weight: 10, date: '2026-01-11' }
      ],
      finalGrade: 15.9,
      color: 'yellow'
    },
    {
      id: 6,
      course: 'Historia Universal',
      code: 'HIS-202',
      evaluations: [
        { name: 'Examen 1', grade: 18, weight: 20, date: '2026-01-05' },
        { name: 'Trabajo Grupal', grade: 17, weight: 15, date: '2026-01-08' },
        { name: 'Presentación', grade: 19, weight: 10, date: '2026-01-10' }
      ],
      finalGrade: 17.8,
      color: 'indigo'
    }
  ];

  const overallAverage = (grades.reduce((acc, g) => acc + g.finalGrade, 0) / grades.length).toFixed(2);

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
                <p className="text-3xl font-bold text-gray-900">6/6</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mejor Nota</p>
                <p className="text-3xl font-bold text-green-600">18.5</p>
              </div>
              <div className="text-4xl">🏆</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Evaluaciones</p>
                <p className="text-3xl font-bold text-gray-900">23</p>
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
