"use client";

import { useSearchParams } from "next/navigation";

// Vista para que el estudiante vea el instructivo del curso
export default function InstructivoEstudiantePage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");

  // Modelo fijo de ejemplo (en producción, esto vendría de la API)
  const items = [
    { id: 1, tipo: "Tarea", nombre: "Tarea 1" },
    { id: 2, tipo: "Tarea", nombre: "Tarea 2" },
    { id: 3, tipo: "Tarea", nombre: "Tarea 3" },
    { id: 4, tipo: "Tarea", nombre: "Tarea 4" },
    { id: 5, tipo: "Examen", nombre: "Examen 1" },
    { id: 6, tipo: "Examen", nombre: "Examen 2" },
    { id: 7, tipo: "Examen", nombre: "Examen Final" },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Instructivo del Curso</h1>
      <p className="mb-4 text-gray-600">Este es el instructivo configurado por el profesor para este curso.</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="bg-gray-100 rounded px-4 py-2">
            <b>{item.tipo}:</b> {item.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}
