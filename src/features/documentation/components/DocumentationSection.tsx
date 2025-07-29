'use client';
import React, { useState } from 'react';
import {
  FileText,
  Download,
  ClipboardList,
  Scale,
  File,
  FileCheck,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { documents } from '../data';
import { useSearchParams } from 'next/navigation';
import { filterDocuments } from '@/shared/lib/utils';
import SearchInput from '@/shared/components/SearchInput';
import { HeadlessPagination } from './HeadlessPagination';
import Link from 'next/link';

const DocumentationSection = () => {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get('categoria');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 12;

  const categories = ['licencias', 'formularios', 'normativas', 'guias'];

  React.useEffect(() => {
    if (categoriaParam && categories.includes(categoriaParam)) {
      setActiveFilter(categoriaParam);
    } else {
      setActiveFilter('all');
    }
  }, [categoriaParam]);

  const filteredDocuments = filterDocuments(
    documents,
    searchQuery,
    activeFilter,
  );

  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);
  const currentDocuments = filteredDocuments.slice(
    (currentPage - 1) * documentsPerPage,
    currentPage * documentsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'licencias':
        return <FileText className="w-5 h-5 text-green-600" />;
      case 'expedientes':
        return <ClipboardList className="w-5 h-5 text-blue-600" />;
      case 'formularios':
        return <FileCheck className="w-5 h-5 text-purple-600" />;
      case 'normativas':
        return <Scale className="w-5 h-5 text-red-600" />;
      case 'guias':
        return <FileText className="w-5 h-5 text-gray-600" />;
      case 'instructivos':
        return <File className="w-5 h-5 text-amber-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <section id="documentacion" className="py-8 w-full">
      <div className="container px-4 mx-auto max-w-7xl">
        {/* Encabezado */}
        {/* Últimos documentos añadidos */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="mr-2 w-1 h-6 bg-green-500 rounded-full"></div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              Últimos documentos añadidos
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {documents
              .slice(-4)
              .reverse()
              .map((doc) => (
                <Card
                  key={doc.id}
                  className="flex overflow-hidden flex-col h-full rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
                >
                  <CardHeader className="px-4 pt-3 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2 items-center">
                        {getCategoryIcon(doc.category)}
                        <Badge
                          variant="outline"
                          className="px-2 py-0.5 text-xs font-medium capitalize"
                        >
                          {doc.type}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">{doc.date}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="grow px-4 py-2">
                    <CardTitle
                      className="mb-1 text-lg font-semibold line-clamp-2"
                      title={doc.title}
                    >
                      {doc.title}
                    </CardTitle>
                    <CardDescription
                      className="text-sm text-gray-600 line-clamp-2"
                      title={doc.description}
                    >
                      {doc.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="px-4 py-3">
                    <Button
                      variant="outline"
                      className="flex gap-2 items-center w-full text-sm hover:bg-[#3D8B37] hover:text-white transition-colors"
                      asChild
                    >
                      <a href={doc.downloadUrl}>
                        <Download className="w-3 h-3" />
                        Descargar
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>

          {/* Sección de búsqueda */}
          <div className="mt-10 mb-8">
            <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-xs">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar documentos..."
                categories={categories}
                selectedCategory={activeFilter === 'all' ? '' : activeFilter}
                onCategoryChange={(cat) =>
                  setActiveFilter(cat === '' ? 'all' : cat)
                }
                allLabel="Todas las categorías"
              />
            </div>
          </div>
        </div>

        {/* Listado principal de documentos */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="mr-2 w-1 h-6 bg-green-500 rounded-full"></div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              {activeFilter === 'all'
                ? 'Todos los documentos'
                : `Documentos de ${activeFilter === 'guias' ? 'guías' : activeFilter}`}
            </h2>
            <span className="ml-2 text-sm text-gray-500">
              ({filteredDocuments.length} resultados)
            </span>
          </div>

          {currentDocuments.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {currentDocuments.map((doc) => (
                  <Card
                    key={doc.id}
                    className="flex overflow-hidden flex-col h-full rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
                  >
                    <CardHeader className="px-4 pt-3 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2 items-center">
                          {getCategoryIcon(doc.category)}
                          <Badge
                            variant="outline"
                            className="px-2 py-0.5 text-xs font-medium capitalize"
                          >
                            {doc.type}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {doc.date}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="grow px-4 py-2">
                      <CardTitle
                        className="mb-1 text-lg font-semibold line-clamp-2"
                        title={doc.title}
                      >
                        {doc.title}
                      </CardTitle>
                      <CardDescription
                        className="text-sm text-gray-600 line-clamp-3"
                        title={doc.description}
                      >
                        {doc.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="px-4 py-3">
                      <Button
                        variant="outline"
                        className="flex gap-2 items-center w-full text-sm hover:bg-[#3D8B37] hover:text-white transition-colors"
                        asChild
                      >
                        <a href={doc.downloadUrl}>
                          <Download className="w-3 h-3" />
                          Descargar
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {filteredDocuments.length > documentsPerPage && (
                <div className="mt-6">
                  <HeadlessPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center bg-gray-50 rounded-lg">
              <FileText className="mx-auto mb-4 w-10 h-10 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-700">
                No se encontraron documentos
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Prueba con otros términos de búsqueda o selecciona una categoría
                diferente
              </p>
            </div>
          )}
        </div>

        {/* CTA final */}
        <div className="pt-8 text-center border-t border-gray-200">
          <h3 className="mb-3 text-lg font-medium text-gray-800">
            ¿No encontrás lo que buscas?
          </h3>
          <p className="mx-auto mb-4 max-w-2xl text-gray-600">
            Estamos constantemente actualizando nuestra base de documentos. Si
            necesitas algo específico, no dudes en contactarnos.
          </p>
          <Button
            asChild
            variant="outline"
            className="px-4 py-2 text-green-700 border-green-600 hover:bg-green-50"
          >
            <Link href="/contacto">Solicitar documentación</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DocumentationSection;
