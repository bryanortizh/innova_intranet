"use client";
import { useEffect, useState } from "react";

interface Course {
  id: number;
  nombre: string;
  descripcion?: string;
  cover?: string;
  estado: boolean;
  enrollmentId: number;
  enrollmentEstado: string;
  enrollmentCreatedAt: string;
  teacher?: {
    user: {
      nombre: string;
      apellido: string;
      email: string;
    };
  };
}

interface UserCoursesProps {
  userId: number;
}

export default function UserCourses({ userId }: UserCoursesProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/users/${userId}/courses`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron obtener los cursos");
        return res.json();
      })
      .then((data) => {
        setCourses(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Cargando cursos...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (courses.length === 0) return <div>No está inscrito en ningún curso.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2">Mis Cursos</h2>
      <ul className="space-y-2">
        {courses.map((course) => (
          <li key={course.id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            {course.cover && (
              <img src={course.cover} alt={course.nombre} className="w-16 h-16 object-cover rounded" />
            )}
            <div className="flex-1">
              <div className="font-semibold text-lg">{course.nombre}</div>
              <div className="text-gray-500 text-sm">{course.descripcion}</div>
              <div className="text-xs mt-1 text-gray-400">
                Estado: {course.enrollmentEstado} | Inscrito el: {new Date(course.enrollmentCreatedAt).toLocaleDateString()}
              </div>
              {course.teacher && (
                <div className="text-xs text-gray-600 mt-1">
                  Profesor: {course.teacher.user.nombre} {course.teacher.user.apellido}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
