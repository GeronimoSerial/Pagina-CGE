import {
  getEscuelasPorModalidad,
  getEscuelasPorZona,
  getTodasCategorias,
  getTodosDepartamentos,
  getTodosSupervisores,
} from '@dashboard/actions/escuelas';
import { EscuelasFiltersView } from './escuelas-filters-view';

export async function EscuelasFilters() {
  const [
    modalidadesData,
    zonasData,
    categoriasData,
    departamentosData,
    supervisoresData,
  ] = await Promise.all([
    getEscuelasPorModalidad(),
    getEscuelasPorZona(),
    getTodasCategorias(),
    getTodosDepartamentos(),
    getTodosSupervisores(),
  ]);

  const modalidades = modalidadesData.map((m) => ({
    label: m.modalidad || 'Sin Modalidad',
    value: m.id.toString(),
  }));

  const zonas = zonasData.map((z) => ({
    label: z.zona || 'Sin Zona',
    value: z.id.toString(),
  }));

  const categorias = categoriasData.map((c) => ({
    label: c.descripcion || 'Sin Categoría',
    value: c.id_categoria.toString(),
  }));

  const departamentos = departamentosData.map((d) => ({
    label: d.nombre,
    value: d.id_departamento.toString(),
  }));

  const supervisores = supervisoresData.map((s) => ({
    label: s.nombre_completo,
    value: s.id_persona.toString(),
  }));

  return (
    <EscuelasFiltersView
      modalidades={modalidades}
      zonas={zonas}
      categorias={categorias}
      departamentos={departamentos}
      supervisores={supervisores}
    />
  );
}
