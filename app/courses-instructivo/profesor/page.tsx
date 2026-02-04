"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { TareaService } from "@/lib/services/tarea.service";
import { ExamenService } from "@/lib/services/examen.service";

export default function InstructivoProfesorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const [tareas, setTareas] = useState<any[]>([]);
  const [examenes, setExamenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Navbar states
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Simulación de datos de profesor
  const professor = {
    name: "Juan Pérez",
    professorId: "PROF123",
    email: "juan.perez@innomatic.edu",
    avatar: "JP",
  };

  // Simulación de nombre de curso (puedes traerlo de tu API)
  const [courseName, setCourseName] = useState("Nombre del Curso");
  const [courseDescription, setCourseDescription] = useState("");

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);

    const token = localStorage.getItem("token");

    // Obtener datos del curso con fetch y token
    fetch(`/api/courses-intra/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setCourseName(data.nombre || "Nombre del Curso");
          setCourseDescription(data.description || "");
        } else {
          setCourseName("Nombre del Curso");
          setCourseDescription("");
        }
      })
      .catch(() => {
        setCourseName("Nombre del Curso");
        setCourseDescription("");
      });

    Promise.all([
      TareaService.getByCourse && TareaService.getByCourse(courseId, token),
      ExamenService.getByCourse && ExamenService.getByCourse(courseId, token),
    ])
      .then(([tareasRes, examenesRes]) => {
        setTareas(tareasRes || []);
        setExamenes(examenesRes || []);
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Aquí tu lógica de logout
    setTimeout(() => {
      setIsLoggingOut(false);
      router.push("/login");
    }, 1200);
  };

  function formatDate(dateString?: string) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/Lima",
      hour12: false,
    });
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <nav className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg fixed w-full z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-lg">I</span>
                </div>
                <span className="ml-3 text-xl font-bold text-white">
                  Innomatic Intranet
                </span>
                <span className="ml-3 px-3 py-1 bg-white bg-opacity-20 rounded-full text-black text-xs font-medium">
                  👨‍🏫 Profesor
                </span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link
                  href="/professor-dashboard"
                  className="border-b-2 border-white text-white inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/professor-courses"
                  className="border-b-2 border-transparent text-white hover:text-purple-100 hover:border-purple-200 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Mis Cursos
                </Link>
                <Link
                  href="/professor-students"
                  className="border-b-2 border-transparent text-white hover:text-purple-100 hover:border-purple-200 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Estudiantes
                </Link>
                <Link
                  href="/professor-grades"
                  className="border-b-2 border-transparent text-white hover:text-purple-100 hover:border-purple-200 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Calificaciones
                </Link>
                <Link
                  href="/meetings"
                  className="border-b-2 border-transparent text-white hover:text-purple-100 hover:border-purple-200 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Reuniones
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 relative">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
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
                    <p className="text-sm font-medium text-white">
                      {professor.name}
                    </p>
                    <p className="text-xs text-purple-100">
                      {professor.professorId}
                    </p>
                  </div>
                  <svg
                    className="ml-2 w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {professor.name}
                      </p>
                      <p className="text-xs text-gray-500">{professor.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
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
                          <svg
                            className="animate-spin w-4 h-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Cerrando...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
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

      {/* Contenido principal */}
      <div className="max-w-5xl mx-auto pt-28 pb-10 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            {courseName}
          </h1>
          <p className="text-gray-500">
            Instructivo del curso: consulta tareas y exámenes configurados.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-16">
            <svg
              className="animate-spin h-8 w-8 text-blue-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            <span className="text-blue-600 font-medium">
              Cargando información...
            </span>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Tabla de Tareas */}
            <section>
              <h2 className="text-lg font-semibold text-blue-700 mb-4">
                Tareas
              </h2>
              <div className="overflow-x-auto rounded shadow bg-white">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-blue-100 text-blue-800">
                      <th className="px-4 py-2 text-left font-semibold">
                        Nombre
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Fecha de entrega
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Estado
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tareas.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center text-gray-400 py-6"
                        >
                          No hay tareas configuradas.
                        </td>
                      </tr>
                    ) : (
                      tareas.map((t) => (
                        <tr key={t.id} className="hover:bg-blue-50 transition">
                          <td className="px-4 py-2">
                            {t.nombre || t.titulo || t.name}
                          </td>
                          <td className="px-4 py-2">
                            {formatDate(t.fechaEntrega)}
                          </td>
                          <td className="px-4 py-2">
                            <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700">
                              {t.estado || "Configurado"}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <span className="inline-block px-2 py-1 rounded bg-blue-600 text-white">
                              {t.id}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Tabla de Exámenes */}
            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-4">
                Exámenes
              </h2>
              <div className="overflow-x-auto rounded shadow bg-white">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-purple-100 text-purple-800">
                      <th className="px-4 py-2 text-left font-semibold">
                        Nombre
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Fecha
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">
                        Estado
                      </th>
                      <th className="px-4 py-2 text-left font-semibold">ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examenes.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center text-gray-400 py-6"
                        >
                          No hay exámenes configurados.
                        </td>
                      </tr>
                    ) : (
                      examenes.map((e) => (
                        <tr
                          key={e.id}
                          className="hover:bg-purple-50 transition"
                        >
                          <td className="px-4 py-2">
                            {e.nombre || e.titulo || e.name}
                          </td>
                          <td className="px-4 py-2">
                            {e.fecha || e.fecha_aplicacion || "-"}
                          </td>
                          <td className="px-4 py-2">
                            <span className="inline-block px-2 py-1 rounded bg-purple-100 text-purple-700">
                              {e.estado || "Configurado"}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <span className="inline-block px-2 py-1 rounded bg-purple-600 text-white">
                              {e.id}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
