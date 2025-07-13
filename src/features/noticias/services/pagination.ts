export const generatePagination = (currentPage: number, totalPages: number) => {
  //si hay 7 páginas o menos, se muestran todas sin puntos suspensivos

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  //si la página actual está cerca del principio
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }
  //si la página actual está cerca del final
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }
  //Si la página actual está en el medio
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
