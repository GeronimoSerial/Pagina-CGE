import type { Escuela } from '@/shared/interfaces';

export async function getEscuelas(): Promise<Escuela[]> {
  const escuelas: any[] = (
    await import('@/features/escuelas/data/escuelas.json')
  ).default;
  const processedEscuelas = escuelas.map((escuela: any) => {
    let fechaFundacion2: number | undefined = undefined;
    if (typeof escuela.fechaFundacion2 === 'string') {
      const parsed = parseInt(escuela.fechaFundacion2, 10);
      fechaFundacion2 = isNaN(parsed) ? undefined : parsed;
    } else if (typeof escuela.fechaFundacion2 === 'number') {
      fechaFundacion2 = escuela.fechaFundacion2;
    }

    const categoria = escuela.categoria?.toString();

    return {
      ...escuela,
      fechaFundacion2,
      categoria,
    } as Escuela;
  });

  return processedEscuelas;
}

export function agruparEscuelasPorDepartamento(escuelas: Escuela[]) {
  const mapa: { [key: string]: Escuela[] } = {};
  escuelas.forEach((escuela) => {
    if (!mapa[escuela.departamento]) mapa[escuela.departamento] = [];
    mapa[escuela.departamento].push(escuela);
  });
  return mapa;
}
