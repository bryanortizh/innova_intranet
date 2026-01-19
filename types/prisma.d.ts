// Declaración de tipos personalizados para Prisma
import { PrismaClient } from '@prisma/client';

declare global {
  namespace PrismaNamespace {
    interface CustomPrismaClient extends PrismaClient {
      horarios_intra: any;
      courses_intra: any;
      teachers_intra: any;
      students_intra: any;
      ciclos_intra: any;
      tareas_intra: any;
      tareas_entregadas: any;
      examenes_intra: any;
      examenes_realizados: any;
      recursos_intra: any;
    }
  }
}
