 import { prisma } from "@lib/prisma";
import type { Prisma } from "../../generated/prisma";

  const PLANILLA_ESTADOS = ["BORRADOR", "ENVIADA", "VALIDADA", "OBSERVADA"] as const;
  export type PlanillaEstado = (typeof PLANILLA_ESTADOS)[number];

  const ESTADOS_PENDIENTES: PlanillaEstado[] = ["BORRADOR", "ENVIADA", "OBSERVADA"];

  const planillaInclude: Prisma.planilla_novedadesInclude = {
    escuela: {
      select: {
        id_escuela: true,
        cue: true,
        nombre: true,
      },
    },
    usuario: {
      select: {
        id_usuario: true,
        username: true,
        persona: {
          select: {
            id_persona: true,
            nombre: true,
            apellido: true,
            documento: true,
          },
        },
      },
    },
  };

  const DEFAULT_ORDER: Prisma.planilla_novedadesOrderByWithRelationInput[] = [
    { anio: "desc" },
    { mes: "desc" },
    { fecha_envio: "desc" },
  ];

  type CreatePlanillaInput = {
    idEscuela: number;
    mes: number;
    anio: number;
    datos: Prisma.JsonValue;
    usuarioEnvio: number;
    estado?: PlanillaEstado;
  };

  function parseId(value: number | string | bigint): bigint {
    try {
      if (typeof value === "bigint") return value;
      if (typeof value === "number") return BigInt(value);
      return BigInt(value);
    } catch {
      throw new Error("ID de planilla inválido");
    }
  }

  function ensureMes(mes: number) {
    if (!Number.isInteger(mes) || mes < 1 || mes > 12) {
      throw new Error("Mes inválido (1-12)");
    }
  }

  function ensureAnio(anio: number) {
    if (!Number.isInteger(anio) || anio < 2000 || anio > 2100) {
      throw new Error("Año inválido");
    }
  }

  function ensureEstado(estado: PlanillaEstado) {
    if (!PLANILLA_ESTADOS.includes(estado)) {
      throw new Error(`Estado de planilla inválido: ${estado}`);
    }
  }

  async function ensureUsuarioRelacionado(
    tx: Prisma.TransactionClient,
    idEscuela: number,
    idUsuario: number,
  ) {
    const relacion = await tx.usuario_escuela.findUnique({
      where: {
        id_usuario_id_escuela: {
          id_usuario: idUsuario,
          id_escuela: idEscuela,
        },
      },
      select: { id_usuario: true },
    });

    if (!relacion) {
      const error = new Error("El usuario no está habilitado para esta escuela");
      (error as any).status = 403;
      throw error;
    }
  }

  async function ensurePlanillaUnica(
    tx: Prisma.TransactionClient,
    idEscuela: number,
    mes: number,
    anio: number,
  ) {
    const existente = await tx.planilla_novedades.findFirst({
      where: { id_escuela: idEscuela, mes, anio },
      select: { id_planilla: true, estado: true },
    });

    if (existente) {
      const error = new Error("Ya existe una planilla para la escuela/mes/año indicados");
      (error as any).status = 409;
      (error as any).meta = existente;
      throw error;
    }
  }

  export async function getPlanillas() {
    return prisma.planilla_novedades.findMany({
      include: planillaInclude,
      orderBy: DEFAULT_ORDER,
    });
  }

  export async function getPlanillasPorID(id_planilla: number | string | bigint) {
    return prisma.planilla_novedades.findUnique({
      where: { id_planilla: parseId(id_planilla) },
      include: planillaInclude,
    });
  }

  export async function getPlanillasPorEscuela(id_escuela: number) {
    return prisma.planilla_novedades.findMany({
      where: { id_escuela },
      include: planillaInclude,
      orderBy: DEFAULT_ORDER,
    });
  }

  export async function getPlanillasPorAnio(anio: number) {
    ensureAnio(anio);
    return prisma.planilla_novedades.findMany({
      where: { anio },
      include: planillaInclude,
      orderBy: DEFAULT_ORDER,
    });
  }

  export async function getPlanillasPorMes(mes: number, anio?: number) {
    ensureMes(mes);
    return prisma.planilla_novedades.findMany({
      where: { mes, ...(anio ? { anio } : {}) },
      include: planillaInclude,
      orderBy: DEFAULT_ORDER,
    });
  }

  export async function getPlanillasPendientes() {
    return prisma.planilla_novedades.findMany({
      where: { estado: { in: ESTADOS_PENDIENTES } },
      include: planillaInclude,
      orderBy: DEFAULT_ORDER,
    });
  }

  export async function createPlanilla(input: CreatePlanillaInput) {
    const { idEscuela, mes, anio, datos, usuarioEnvio, estado = "BORRADOR" } = input;

    ensureMes(mes);
    ensureAnio(anio);
    ensureEstado(estado);

    if (datos === null || typeof datos === "undefined") {
      throw new Error("El campo datos es obligatorio");
    }

    return prisma.$transaction(async (tx) => {
      await ensureUsuarioRelacionado(tx, idEscuela, usuarioEnvio);
      await ensurePlanillaUnica(tx, idEscuela, mes, anio);

      const planilla = await tx.planilla_novedades.create({
        data: {
          id_escuela: idEscuela,
          mes,
          anio,
          datos,
          usuario_envio: usuarioEnvio,
          estado,
          fecha_envio: new Date(), // asegura timestamp inmediato
        },
        include: planillaInclude,
      });

      // TODO: volcar versión inicial en audit.planilla_historial cuando el modelo esté disponible.
      return planilla;
    });
  }

// import { prisma } from "@lib/prisma";



// // lectura
// export async function getPlanillas() {
    
// }


// export async function getPlanillasPorID(id_planilla: number) {
// }



// export async function getPlanillasPorEscuela(id_escuela: number) {
// }


// export async function getPlanillasPorAnio(anio: number) {
// }


// export async function getPlanillasPorMes(mes: number) {
// }

// export async function getPlanillasPendientes() {
    
// }

// //escritura 
// export async function createPlanilla() {
// }


// Reglas

// Solo 1 planilla por escuela/mes/año.

// Si ya existe, devolver 409 Conflict.

// Registrar fecha_envio automáticamente.

// RLS o verificación del id_usuario para que no cree otra escuela.



// actualizar planilla (solo ciertos campos)

// PUT /api/planillas/:id	Actualiza toda la planilla (solo borradores).
// PATCH /api/planillas/:id/estado	Cambia el estado: BORRADOR → ENVIADA → VALIDADA → OBSERVADA.
// PATCH /api/planillas/:id/datos	Actualiza parcialmente el campo datos (JSONB merge).


// Resumen técnico

// Entidad principal: institucional.planilla_novedades

// Relaciones: id_escuela, usuario_envio, estado (enum), datos (jsonb)

// Apoyo: audit.planilla_historial para versionado y auditoría

// Roles esperados:

// Director (crea y edita)

// Supervisor (observa)

// Liquidaciones (valida)

// Administrador (elimina y audita)