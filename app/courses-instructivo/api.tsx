"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TareaService } from "@/lib/services/tarea.service";
import { ExamenService } from "@/lib/services/examen.service";

export default function InstructivoConfigApiPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const [tareas, setTareas] = useState<any[]>([]);
  const [examenes, setExamenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    Promise.all([
      TareaService.getByCourse && TareaService.getByCourse(courseId, token),
      ExamenService.getByCourse && ExamenService.getByCourse(courseId, token),
    ]).then(([tareasRes, examenesRes]) => {
      setTareas(tareasRes || []);
      setExamenes(examenesRes || []);
    }).finally(() => setLoading(false));
  }, [courseId]);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Instructivo del Curso (API)</h1>
      <p className="mb-4 text-gray-600">Configuración dinámica usando los endpoints de tareas y exámenes.</p>
      {loading ? (
        <div className="text-center py-8">Cargando...</div>
      ) : (
        <>
          <h2 className="text-lg font-semibold mt-4 mb-2">Tareas</h2>
          <ul className="space-y-2 mb-4">
            {tareas.length === 0 && <li className="text-gray-400">No hay tareas configuradas.</li>}
            {tareas.map((t) => (
              <li key={t.id} className="bg-gray-100 rounded px-4 py-2 flex justify-between items-center">
                <span><b>{t.nombre || t.titulo || t.name}</b></span>
                <span className="text-xs text-gray-500">ID: {t.id}</span>
              </li>
            ))}
          </ul>
          <h2 className="text-lg font-semibold mt-4 mb-2">Exámenes</h2>
          <ul className="space-y-2">
            {examenes.length === 0 && <li className="text-gray-400">No hay exámenes configurados.</li>}
            {examenes.map((e) => (
              <li key={e.id} className="bg-gray-100 rounded px-4 py-2 flex justify-between items-center">
                <span><b>{e.nombre || e.titulo || e.name}</b></span>
                <span className="text-xs text-gray-500">ID: {e.id}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
