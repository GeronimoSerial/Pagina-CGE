import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { generatePagination } from '@/features/noticias/services/pagination';

interface PaginacionServerProps {
  currentPage: number;
  totalPages: number;
  // pageSize: number;
  searchParams?: { [key: string]: string | string[] | undefined };
  // onPageChange?: (page: number) => void;
  baseUrl: string;
}

export default function PaginacionServer({
  currentPage,
  totalPages,
  // pageSize,
  // onPageChange,
  baseUrl,
  searchParams,
}: PaginacionServerProps) {
  // const pageCount = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  const allPages = generatePagination(currentPage, totalPages);
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams();
    if (searchParams) {
      // Filtra los parámetros para no incluir valores undefined que se convierten en "undefined"
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, String(value));
        }
      });
    }
    params.set('page', pageNumber.toString());
    return `${baseUrl}?${params.toString()}`;
  };
  return (
    <nav aria-label="Pagination" className="flex justify-center items-center">
      <div className="flex items-center p-2 space-x-1 bg-white rounded-md border border-gray-200 shadow-sm">
        <PaginationLink
          direction="left"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage === 1}
        />
        <div className="flex items-center mx-2">
          {allPages.map((page, index) => {
            let position: PaginationPosition = 'single';
            if (allPages.length > 1) {
              if (index === 0) position = 'first';
              else if (index === allPages.length - 1) position = 'last';
              else if (page === '...') position = 'middle';
              else if (typeof allPages[index + 1] === 'string')
                position = 'first-after-ellipsis';
              else if (typeof allPages[index - 1] === 'string')
                position = 'last-before-ellipsis';
            }
            return (
              <PaginationNumber
                key={`${page}-${index}`}
                href={createPageURL(page)}
                page={page}
                isActive={currentPage === page}
                position={position}
              />
            );
          })}
        </div>
        <PaginationLink
          direction="right"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </nav>
  );
}

// Componente interno para los botones de Anterior/Siguiente
function PaginationLink({
  direction,
  href,
  isDisabled,
}: {
  direction: 'left' | 'right';
  href: string;
  isDisabled: boolean;
}) {
  const className = `flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors rounded-md ${
    isDisabled ? 'pointer-events-none text-gray-400' : ''
  }`;

  const icon =
    direction === 'left' ? (
      <ChevronLeft className="w-4 h-4" />
    ) : (
      <ChevronRight className="w-4 h-4" />
    );

  return (
    <Link
      href={href}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : undefined}
      className={className}
    >
      {direction === 'left' && (
        <>
          {icon} <span>Anterior</span>
        </>
      )}
      {direction === 'right' && (
        <>
          <span>Siguiente</span> {icon}
        </>
      )}
    </Link>
  );
}

// Type for position prop
type PaginationPosition =
  | 'first'
  | 'last'
  | 'middle'
  | 'single'
  | 'first-after-ellipsis'
  | 'last-before-ellipsis';

// Componente interno para los números
function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: PaginationPosition;
  isActive: boolean;
}) {
  if (page === '...') {
    return <span className="px-3 py-1.5 text-sm text-gray-500">...</span>;
  }

  const className = `px-3 py-1.5 text-sm font-medium transition-colors rounded-md ${
    isActive
      ? 'bg-[#3D8B37] text-white pointer-events-none'
      : 'text-gray-700 hover:bg-gray-100'
  }`;

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={className}
    >
      {page}
    </Link>
  );
}

// <div className="flex justify-center items-center">
//   <div className="flex items-center p-4 space-x-1 bg-white border border-gray-200 shadow-sm">
//     {/* Botón Anterior */}
//     {onPageChange ? (
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className="flex items-center px-2 py-1 space-x-2 text-sm text-gray-600 rounded transition-all duration-150 hover:bg-gray-100 hover:shadow-sm disabled:opacity-50"
//       >
//         <ChevronLeft className="w-4 h-4" />
//         <span className="font-medium">Anterior</span>
//       </button>
//     ) : (
//       <Link
//         href={`/noticias?page=${currentPage - 1}`}
//         tabIndex={currentPage === 1 ? -1 : 0}
//         aria-disabled={currentPage === 1}
//         className="flex items-center px-2 py-1 space-x-2 text-sm text-gray-600 rounded transition-all duration-150 hover:bg-gray-100 hover:shadow-sm disabled:opacity-50"
//         style={{
//           pointerEvents: currentPage === 1 ? 'none' : undefined,
//           opacity: currentPage === 1 ? 0.5 : 1,
//         }}
//       >
//         <ChevronLeft className="w-4 h-4" />
//         <span className="font-medium">Anterior</span>
//       </Link>
//     )}

//     {/* Números de página */}
//     <div className="flex items-center mx-4">
//       {pages.map((page) =>
//         onPageChange ? (
//           <button
//             key={page}
//             onClick={() => onPageChange(page)}
//             className={`px-2 py-1 mx-0.5 font-medium transition-all duration-150 rounded text-sm ${
//               currentPage === page
//                 ? 'bg-[#3D8B37] text-white shadow'
//                 : 'text-gray-600 hover:bg-gray-100 hover:shadow-sm'
//             }`}
//             aria-current={currentPage === page ? 'page' : undefined}
//             disabled={currentPage === page}
//           >
//             {page}
//           </button>
//         ) : (
//           <Link
//             key={page}
//             href={`/noticias?page=${page}`}
//             aria-current={currentPage === page ? 'page' : undefined}
//             className={`px-2 py-1 mx-0.5 font-medium transition-all duration-150 rounded text-sm ${
//               currentPage === page
//                 ? 'bg-[#3D8B37] text-white shadow'
//                 : 'text-gray-600 hover:bg-gray-100 hover:shadow-sm'
//             }`}
//             style={{
//               pointerEvents: currentPage === page ? 'none' : undefined,
//               opacity: currentPage === page ? 0.7 : 1,
//             }}
//           >
//             {page}
//           </Link>
//         ),
//       )}
//     </div>

//     {/* Botón Siguiente */}
//     {onPageChange ? (
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === pageCount}
//         className="flex items-center px-2 py-1 space-x-2 text-sm text-gray-600 rounded transition-all duration-150 hover:bg-gray-100 hover:shadow-sm disabled:opacity-50"
//       >
//         <span className="font-medium">Siguiente</span>
//         <ChevronRight className="w-4 h-4" />
//       </button>
//     ) : (
//       <Link
//         href={`/noticias?page=${currentPage + 1}`}
//         tabIndex={currentPage === pageCount ? -1 : 0}
//         aria-disabled={currentPage === pageCount}
//         className="flex items-center px-2 py-1 space-x-2 text-sm text-gray-600 rounded transition-all duration-150 hover:bg-gray-100 hover:shadow-sm disabled:opacity-50"
//         style={{
//           pointerEvents: currentPage === pageCount ? 'none' : undefined,
//           opacity: currentPage === pageCount ? 0.5 : 1,
//         }}
//       >
//         <span className="font-medium">Siguiente</span>
//         <ChevronRight className="w-4 h-4" />
//       </Link>
//     )}
//   </div>
// </div>
