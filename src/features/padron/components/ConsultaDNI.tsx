'use client';

import React, { useState } from 'react';
import { Search, User, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';

interface ConsultaResult {
  // Datos básicos
  nroOrden: number;
  legajo: string;
  documento: string;
  apellidoYNombres: string;

  // Puntajes
  total: number;
  subtotal: number;

  // Formación académica
  titulo: string;
  conceptoProfesional: number;
  otrosTitulos: number;
  promedioGeneral: number;

  // Experiencia
  serviciosPrestados: number;
  ubicacionGeografica: number;
  atencionSimultaneaGrado: number;
  maestraHospitalaria: number;
  serviciosPrestadosFrenteAlumnos: number;
  cursos: number;
  otrosDispositivos: number;
  atencionAlumnosResidentes: number;
  antecedentesLaborDocente: number;
  otrosAntecedentes: number;
  profEducacionFisica: number;

  // Estado y observaciones
  estado?: 'activo' | 'inactivo' | 'pendiente';
  observaciones?: string;
}

export default function ConsultaDNI() {
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConsultaResult | null>(null);
  const [error, setError] = useState('');

  const handleDNIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    if (value.length <= 8) {
      setDni(value);
      setError('');
      setResult(null);
    }
  };

  const formatDNI = (dni: string) => {
    // Formatear DNI con puntos (ej: 12.345.678)
    return dni.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  const handleConsulta = async () => {
    if (dni.length < 7) {
      setError('El DNI debe tener al menos 7 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulación de API call - reemplazar con la llamada real
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Datos de ejemplo - reemplazar con datos reales
      const mockResult: ConsultaResult = {
        // Datos básicos
        nroOrden: 15,
        legajo: 'L-12456',
        documento: dni,
        apellidoYNombres: 'González, María Elena',

        // Puntajes
        total: 87.5,
        subtotal: 82.75,

        // Formación académica
        titulo: 'Profesorado en Educación Primaria',
        conceptoProfesional: 15.0,
        otrosTitulos: 8.5,
        promedioGeneral: 9.25,

        // Experiencia
        serviciosPrestados: 18.75,
        ubicacionGeografica: 5.0,
        atencionSimultaneaGrado: 2.5,
        maestraHospitalaria: 0.0,
        serviciosPrestadosFrenteAlumnos: 12.5,
        cursos: 8.25,
        otrosDispositivos: 3.75,
        atencionAlumnosResidentes: 0.0,
        antecedentesLaborDocente: 6.0,
        otrosAntecedentes: 2.0,
        profEducacionFisica: 0.0,

        // Estado y observaciones
        estado: 'activo',
        observaciones: 'Documentación completa - Título habilitante verificado',
      };

      setResult(mockResult);
    } catch (err) {
      setError('Error al consultar el padrón. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConsulta();
    }
  };

  const getEstadoIcon = (estado?: string) => {
    switch (estado) {
      case 'activo':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pendiente':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getEstadoColor = (estado?: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'pendiente':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-50 text-red-800 border-red-200';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#3D8B37] to-[#2d6b29] rounded-full mb-4 shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Consulta de Padrón Docente
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Ingresá tu número de DNI para consultar tu situación en el padrón de
          interinatos y suplencias
        </p>
      </div>

      {/* Consulta Card */}
      <Card className="mb-8 shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl text-gray-800">
            Ingresá tu DNI
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sin puntos ni espacios, solo números
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Input DNI */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Ej: 12345678"
              value={dni}
              onChange={handleDNIChange}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-4 h-12 text-center text-lg font-mono border-2 border-gray-300 
                         focus:border-[#3D8B37] focus:ring-[#3D8B37]/20 rounded-xl
                         transition-all duration-200 shadow-sm hover:border-[#3D8B37]/70"
              disabled={loading}
            />
            {dni && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-sm text-gray-500 font-mono">
                  {formatDNI(dni)}
                </span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center justify-center space-x-2 text-red-600 bg-red-50 py-2 px-4 rounded-lg border border-red-200 max-w-md mx-auto">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Consultar Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleConsulta}
              disabled={loading || dni.length < 7}
              className="h-12 px-8 bg-[#3D8B37] hover:bg-[#2d6b29] text-white font-medium 
                         rounded-xl shadow-lg hover:shadow-xl transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Consultando...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Consultar Padrón
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Card */}
      {result && (
        <div className="space-y-6">
          {/* Header Card */}
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#3D8B37]/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[#3D8B37]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">
                      {result.apellidoYNombres}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      DNI {formatDNI(result.documento)} | Legajo:{' '}
                      {result.legajo}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#3D8B37]">
                    {result.total.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">Puntaje Total</div>
                  <div className="text-lg font-semibold text-gray-700">
                    Orden #{result.nroOrden}
                  </div>
                </div>
              </div>
              {result.estado && (
                <div className="mt-4">
                  <div
                    className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getEstadoColor(result.estado)}`}
                  >
                    {getEstadoIcon(result.estado)}
                    <span className="text-sm font-medium capitalize">
                      {result.estado}
                    </span>
                  </div>
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Detailed Results */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Formación Académica */}
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-lg text-gray-900">
                  Formación Académica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-sm text-gray-700 font-medium mb-1">
                    Título Principal
                  </div>
                  <div className="text-gray-900">{result.titulo}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 font-medium">
                      Concepto Profesional
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {result.conceptoProfesional.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 font-medium">
                      Otros Títulos
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {result.otrosTitulos.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 font-medium">
                      Promedio General
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {result.promedioGeneral.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 font-medium">
                      Cursos
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {result.cursos.toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experiencia Docente */}
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-lg text-gray-900">
                  Experiencia Docente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 font-medium">
                      Servicios Prestados
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {result.serviciosPrestados.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 font-medium">
                      Frente a Alumnos
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {result.serviciosPrestadosFrenteAlumnos.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 font-medium">
                      Atención Simultánea
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {result.atencionSimultaneaGrado.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 font-medium">
                      Labor Docente
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {result.antecedentesLaborDocente.toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ubicación y Servicios Especiales */}
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-lg text-gray-900">
                  Ubicación y Servicios Especiales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 font-medium">
                      Ubicación Geográfica
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {result.ubicacionGeografica.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 font-medium">
                      Maestra Hospitalaria
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {result.maestraHospitalaria.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 font-medium">
                      Alumnos Residentes
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {result.atencionAlumnosResidentes.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 font-medium">
                      Prof. Ed. Física
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {result.profEducacionFisica.toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Otros Antecedentes */}
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-lg text-gray-900">
                  Otros Antecedentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 font-medium">
                      Otros Dispositivos
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {result.otrosDispositivos.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-xs text-gray-600 font-medium">
                      Otros Antecedentes
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {result.otrosAntecedentes.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-sm text-gray-700 font-medium mb-1">
                    Subtotal
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {result.subtotal.toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Observaciones */}
          {result.observaciones && (
            <Card className="shadow-lg border border-gray-200 bg-white">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-lg text-gray-900">
                  Observaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {result.observaciones}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Button */}
          <div className="text-center">
            <Button
              onClick={() => {
                setResult(null);
                setDni('');
              }}
              variant="outline"
              className="px-8 py-3 border-[#3D8B37] text-[#3D8B37] hover:bg-[#3D8B37] hover:text-white transition-all duration-200"
            >
              Realizar Nueva Consulta
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
