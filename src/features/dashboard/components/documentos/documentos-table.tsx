'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import {
  Download,
  FileText,
  ClipboardList,
  FileCheck,
  Scale,
  File,
  Search,
} from 'lucide-react';
import { DocumentItem } from '@/features/documentation/types';
import { filterDocuments } from '@/shared/lib/utils';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

interface DocumentosTableProps {
  initialDocuments: DocumentItem[];
}

const categories = ['licencias', 'formularios', 'normativas', 'guias'];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'licencias':
      return <FileText className="w-4 h-4 text-green-600" />;
    case 'expedientes':
      return <ClipboardList className="w-4 h-4 text-blue-600" />;
    case 'formularios':
      return <FileCheck className="w-4 h-4 text-purple-600" />;
    case 'normativas':
      return <Scale className="w-4 h-4 text-red-600" />;
    case 'guias':
      return <FileText className="w-4 h-4 text-gray-600" />;
    case 'instructivos':
      return <File className="w-4 h-4 text-amber-600" />;
    default:
      return <FileText className="w-4 h-4 text-gray-600" />;
  }
};

export function DocumentosTable({ initialDocuments }: DocumentosTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredDocuments, setFilteredDocuments] = useState(initialDocuments);

  useEffect(() => {
    const filtered = filterDocuments(
      initialDocuments,
      searchQuery,
      activeFilter,
    );
    setFilteredDocuments(filtered);
  }, [searchQuery, activeFilter, initialDocuments]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar documentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={activeFilter}
            onValueChange={(value) => setActiveFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]"></TableHead>
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">
                Descripción
              </TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{getCategoryIcon(doc.category)}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{doc.title}</span>
                      <span className="md:hidden text-xs text-muted-foreground line-clamp-1">
                        {doc.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell
                    className="hidden md:table-cell max-w-xs truncate"
                    title={doc.description}
                  >
                    {doc.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {doc.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground text-sm">
                    {doc.type}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {doc.date}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8 w-8 p-0"
                    >
                      <a
                        href={doc.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Descargar"
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Descargar</span>
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No se encontraron documentos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-xs text-muted-foreground">
        Mostrando {filteredDocuments.length} de {initialDocuments.length}{' '}
        documentos
      </div>
    </div>
  );
}
