'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface MiroTalkMeeting {
  id: string;
  name: string;
  date: string;
  time: string;
  room: string;
  [key: string]: unknown;
}

export default function MeetingsPage() {
  const [selectedView, setSelectedView] = useState('upcoming');
  const [apiMeetings, setApiMeetings] = useState<MiroTalkMeeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creatingMeeting, setCreatingMeeting] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState<string | null>(null);

  const API_KEY_SECRET = "mirotalk_default_secret";
  const MIROTALK_BASE_URL = "https://mirotalk-webrtc-p2p-production-fbb6.up.railway.app";

  // Función para crear una reunión
  const createMeeting = async () => {
    setCreatingMeeting(true);
    setError(null);
    
    try {
      const response = await fetch(`${MIROTALK_BASE_URL}/api/v1/meeting`, {
        method: "POST",
        headers: {
          authorization: API_KEY_SECRET,
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        console.log("Error creando reunión:", data.error);
      } else if (data.meeting) {
        setMeetingUrl(data.meeting);
        console.log("Reunión creada:", data.meeting);
        // Abrir la reunión en una nueva pestaña
        window.open(data.meeting, '_blank');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear la reunión";
      setError(errorMessage);
      console.error("Error creating meeting:", err);
    } finally {
      setCreatingMeeting(false);
    }
  };

  // Función para obtener reuniones desde MiroTalk API
  const getMeetingsFromAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${MIROTALK_BASE_URL}/api/v1/meetings`, {
        method: "GET",
        headers: {
          authorization: API_KEY_SECRET,
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        console.log("Error:", data.error);
      } else {
        if (data && data.meetings) {
          setApiMeetings(data.meetings);
          console.log("Meetings loaded:", data.meetings);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar las reuniones";
      setError(errorMessage);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar reuniones al montar el componente
  useEffect(() => {
    getMeetingsFromAPI();
  }, []);

  const meetings = [
    {
      id: 1,
      title: 'Clase Virtual - Matemáticas Avanzadas',
      course: 'Matemáticas Avanzadas',
      courseCode: 'MAT-301',
      professor: 'Prof. Ana García',
      date: '2026-01-12',
      time: '10:00 - 12:00',
      platform: 'Zoom',
      link: 'https://zoom.us/j/123456789',
      participants: 28,
      status: 'upcoming',
      color: 'blue',
      description: 'Clase sobre integrales múltiples y aplicaciones'
    },
    {
      id: 2,
      title: 'Laboratorio Virtual - Física Cuántica',
      course: 'Física Cuántica',
      courseCode: 'FIS-402',
      professor: 'Prof. Carlos Martínez',
      date: '2026-01-12',
      time: '14:00 - 16:00',
      platform: 'Google Meet',
      link: 'https://meet.google.com/abc-defg-hij',
      participants: 22,
      status: 'upcoming',
      color: 'green',
      description: 'Experimento virtual sobre dualidad onda-partícula'
    },
    {
      id: 3,
      title: 'Tutoría Grupal - Programación Web',
      course: 'Programación Web',
      courseCode: 'INF-305',
      professor: 'Prof. María López',
      date: '2026-01-13',
      time: '16:00 - 17:30',
      platform: 'Microsoft Teams',
      link: 'https://teams.microsoft.com/l/meetup-join/...',
      participants: 12,
      status: 'upcoming',
      color: 'purple',
      description: 'Resolución de dudas sobre el proyecto final'
    },
    {
      id: 4,
      title: 'Presentación de Ensayos',
      course: 'Literatura Española',
      courseCode: 'LIT-201',
      professor: 'Prof. Roberto Sánchez',
      date: '2026-01-14',
      time: '10:00 - 12:00',
      platform: 'Zoom',
      link: 'https://zoom.us/j/987654321',
      participants: 30,
      status: 'upcoming',
      color: 'pink',
      description: 'Exposición de trabajos sobre el Siglo de Oro'
    },
    {
      id: 5,
      title: 'Asesoría Individual',
      course: 'Química Orgánica',
      courseCode: 'QUI-303',
      professor: 'Prof. Laura Fernández',
      date: '2026-01-11',
      time: '15:00 - 15:30',
      platform: 'Zoom',
      link: 'https://zoom.us/j/111222333',
      participants: 1,
      status: 'completed',
      color: 'yellow',
      description: 'Consulta sobre el informe de laboratorio'
    },
    {
      id: 6,
      title: 'Clase Virtual - Historia Universal',
      course: 'Historia Universal',
      courseCode: 'HIS-202',
      professor: 'Prof. Diego Torres',
      date: '2026-01-10',
      time: '14:00 - 16:00',
      platform: 'Google Meet',
      link: 'https://meet.google.com/xyz-abcd-efg',
      participants: 32,
      status: 'completed',
      color: 'indigo',
      description: 'Análisis de la Segunda Guerra Mundial'
    }
  ];

  const filteredMeetings = meetings.filter(meeting => 
    selectedView === 'all' || meeting.status === selectedView
  );

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Zoom':
        return '🎥';
      case 'Google Meet':
        return '📹';
      case 'Microsoft Teams':
        return '💼';
      default:
        return '🔗';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">📅 Próxima</span>;
      case 'live':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium animate-pulse">🔴 En vivo</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">✅ Finalizada</span>;
      default:
        return null;
    }
  };

  const upcomingCount = meetings.filter(m => m.status === 'upcoming').length;
  const completedCount = meetings.filter(m => m.status === 'completed').length;

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
                <Link href="/grades" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Notas
                </Link>
                <Link href="/tasks" className="border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Tareas
                </Link>
                <Link href="/meetings" className="border-b-2 border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900">Sala de Reuniones 📹</h1>
          <p className="text-gray-600 mt-1">Accede a tus clases virtuales y reuniones programadas</p>
        </div>

        {/* Quick Join Card */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">🚀 Unirse a una reunión</h2>
              <p className="text-blue-100 mb-4">Ingresa el código o link de la reunión para unirte rápidamente</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Código de reunión o link"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white outline-none"
                />
                <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
                  Unirse Ahora
                </button>
              </div>
            </div>
            <div className="text-6xl">💻</div>
          </div>
        </div>

        {/* MiroTalk API Meetings Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          {/* Crear Reunión */}
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">🎬 Crear Nueva Reunión</p>
                <p className="text-sm text-gray-600">Inicia una videollamada instantánea con MiroTalk</p>
              </div>
              <button 
                onClick={createMeeting}
                disabled={creatingMeeting}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition disabled:opacity-50"
              >
                {creatingMeeting ? '⏳ Creando...' : '➕ Nueva Reunión'}
              </button>
            </div>
            {meetingUrl && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-green-300">
                <p className="text-sm text-gray-600 mb-1">🔗 Última reunión creada:</p>
                <a 
                  href={meetingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm font-mono break-all"
                >
                  {meetingUrl}
                </a>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">🌐 Reuniones MiroTalk</h2>
            <button 
              onClick={getMeetingsFromAPI}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? '⏳ Cargando...' : '🔄 Actualizar'}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              ⚠️ {error}
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin text-4xl mb-2">⏳</div>
              <p className="text-gray-500">Cargando reuniones...</p>
            </div>
          ) : apiMeetings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apiMeetings.map((meeting, index) => (
                <div key={meeting.id || index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                  <h3 className="font-semibold text-gray-900 mb-2">{meeting.name || `Reunión ${index + 1}`}</h3>
                  {meeting.room && (
                    <p className="text-sm text-gray-600 mb-1">🔗 Sala: {meeting.room}</p>
                  )}
                  {meeting.date && (
                    <p className="text-sm text-gray-600 mb-1">📅 {meeting.date}</p>
                  )}
                  {meeting.time && (
                    <p className="text-sm text-gray-600 mb-1">🕐 {meeting.time}</p>
                  )}
                  <button className="mt-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition">
                    Unirse
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📭</div>
              <p>No hay reuniones activas en MiroTalk</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Reuniones Totales</p>
                <p className="text-3xl font-bold text-gray-900">{meetings.length}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl shadow-sm p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 mb-1">Próximas</p>
                <p className="text-3xl font-bold text-blue-600">{upcomingCount}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl shadow-sm p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Completadas</p>
                <p className="text-3xl font-bold text-green-600">{completedCount}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedView('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedView === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setSelectedView('upcoming')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedView === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Próximas
            </button>
            <button
              onClick={() => setSelectedView('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedView === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Finalizadas
            </button>
          </div>
        </div>

        {/* Meetings List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMeetings.map((meeting) => (
            <div key={meeting.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
              {/* Meeting Header */}
              <div className={`h-2 bg-gradient-to-r from-${meeting.color}-500 to-${meeting.color}-600`}></div>
              
              <div className="p-6">
                {/* Title and Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{meeting.title}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`font-medium text-${meeting.color}-600`}>{meeting.course}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{meeting.courseCode}</span>
                    </div>
                  </div>
                  {getStatusBadge(meeting.status)}
                </div>

                {/* Professor */}
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm">
                    {meeting.professor.split(' ')[1]?.[0] || 'P'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{meeting.professor}</p>
                    <p className="text-xs text-gray-500">{meeting.participants} participantes</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">{meeting.description}</p>

                {/* Meeting Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">{meeting.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{meeting.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2 text-lg">{getPlatformIcon(meeting.platform)}</span>
                    <span className="font-medium">{meeting.platform}</span>
                  </div>
                </div>

                {/* Actions */}
                {meeting.status === 'upcoming' && (
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition">
                      Unirse a la reunión
                    </button>
                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                )}

                {meeting.status === 'completed' && (
                  <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
                    Ver Grabación
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMeetings.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No hay reuniones</h3>
            <p className="text-gray-500">No tienes reuniones programadas en este momento</p>
          </div>
        )}

        {/* Calendar View */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Calendario de Reuniones 📆</h2>
          <div className="grid grid-cols-7 gap-2">
            {/* Calendar Header */}
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
            
            {/* Calendar Days - Simplified */}
            {Array.from({ length: 35 }, (_, i) => {
              const dayNumber = i - 4; // Starting from day 1 being on Monday
              const isToday = dayNumber === 11;
              const hasMeeting = [10, 11, 12, 13, 14].includes(dayNumber);
              
              return (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm ${
                    dayNumber < 1 || dayNumber > 31
                      ? 'text-gray-300'
                      : isToday
                      ? 'bg-blue-600 text-white font-bold'
                      : hasMeeting
                      ? 'bg-blue-100 text-blue-700 font-medium cursor-pointer hover:bg-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                  }`}
                >
                  {dayNumber > 0 && dayNumber <= 31 ? dayNumber : ''}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-gray-600">Hoy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 rounded"></div>
              <span className="text-gray-600">Con reuniones</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
