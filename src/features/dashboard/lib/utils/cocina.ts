export function normalizeFieldName(key: string): string {
  const fieldMap: Record<string, string> = {
    // Información básica
    mail: 'Email',
    cue: 'CUE',

    // Espacio físico
    tiene_espacio_fisico_comedor: '¿Tiene espacio físico para comedor?',
    lugar_alimencacion_sin_espacio: 'Lugar de alimentación (sin espacio)',

    // Servicio
    tipo_servicio_brindado: 'Tipo de servicio brindado',
    raciones_por_dia: 'Raciones por día',
    frecuencia_recepcion_alimentos: 'Frecuencia de recepción de alimentos',

    // Personal
    tiene_personal_especializado: '¿Tiene personal especializado?',
    quien_cocina_sin_personal: '¿Quién cocina? (sin personal)',

    // Cocina
    tipo_cocina: 'Tipo de cocina',
    tipo_de_garrafa: 'Tipo de garrafa',

    // Equipamiento
    equipamiento_disponible: 'Equipamiento disponible',
    refrigeradors_congeladores_dispoinibles:
      '¿Cuántos Refrigeradores/Congeladores dispone?',
    estado_refrigerador: 'Estado del refrigerador',
    capacidad_almacenamiento_seco: 'Capacidad de almacenamiento seco',

    // Mantenimiento
    tiene_plan_mantenimiento: '¿Tiene plan de mantenimiento?',
    prioridades_urgentes: 'Prioridades urgentes',

    // Vajilla
    cantidad_platos_playos: 'Cantidad de platos playos',
    cantidad_platos_hondos: 'Cantidad de platos hondos',
    cantidad_vasos: 'Cantidad de vasos',
    cantidad_jarras: 'Cantidad de jarras',
    cantidad_tenedores: 'Cantidad de tenedores',
    cantidad_cuchillos: 'Cantidad de cuchillos',
    cantidad_cucharas: 'Cantidad de cucharas',

    // Utensilios de cocina
    cantidad_ollas_cacerolas: 'Cantidad de ollas/cacerolas',
    cantidad_placas_horno: 'Cantidad de placas de horno',
    cantidad_cucharones: 'Cantidad de cucharones',
    cantidad_pelapapas: 'Cantidad de pelapapas',
    cantidad_batidores_alambre: 'Cantidad de batidores de alambre',
    cantidad_palos_amasar: 'Cantidad de palos de amasar',
    cantidad_cucharas_madera: 'Cantidad de cucharas de madera',
    cantidad_pavas: 'Cantidad de pavas',
    cantidad_teteras: 'Cantidad de teteras',
    cantidad_coladores_pasta: 'Cantidad de coladores de pasta',
    cantidad_coladores_mate_cocido: 'Cantidad de coladores de mate cocido',

    // Otros
    observaciones: 'Observaciones',
  };

  // Si existe en el mapeo, usar ese valor
  if (fieldMap[key]) {
    return fieldMap[key];
  }

  // Fallback: capitalizar y reemplazar guiones bajos por espacios
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const fieldCategories = {
  'Información General': [
    'mail',
    'cue',
    'tiene_espacio_fisico_comedor',
    'lugar_alimencacion_sin_espacio',
  ],
  'Servicio de Alimentación': [
    'tipo_servicio_brindado',
    'raciones_por_dia',
    'frecuencia_recepcion_alimentos',
  ],
  Personal: ['tiene_personal_especializado', 'quien_cocina_sin_personal'],
  Infraestructura: [
    'tipo_cocina',
    'tipo_de_garrafa',
    'equipamiento_disponible',
    'refrigeradors_congeladores_dispoinibles',
    'estado_refrigerador',
    'capacidad_almacenamiento_seco',
  ],
  Mantenimiento: ['tiene_plan_mantenimiento', 'prioridades_urgentes'],
  Vajilla: [
    'cantidad_platos_playos',
    'cantidad_platos_hondos',
    'cantidad_vasos',
    'cantidad_jarras',
    'cantidad_tenedores',
    'cantidad_cuchillos',
    'cantidad_cucharas',
  ],
  'Utensilios de Cocina': [
    'cantidad_ollas_cacerolas',
    'cantidad_placas_horno',
    'cantidad_cucharones',
    'cantidad_pelapapas',
    'cantidad_batidores_alambre',
    'cantidad_palos_amasar',
    'cantidad_cucharas_madera',
    'cantidad_pavas',
    'cantidad_teteras',
    'cantidad_coladores_pasta',
    'cantidad_coladores_mate_cocido',
  ],
};
