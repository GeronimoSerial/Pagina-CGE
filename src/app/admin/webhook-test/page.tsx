'use client';

import { useState } from 'react';
import {
  testWebhook,
  getWebhookStatus,
  getWebhookLogs,
  clearWebhookLogs,
} from '@/shared/lib/webhook-test';

export default function WebhookTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any>(null);

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold text-red-600">
          Esta página solo está disponible en desarrollo
        </h1>
      </div>
    );
  }

  const handleTest = async (event: 'create' | 'update' | 'delete') => {
    setLoading(true);
    try {
      const result = await testWebhook({
        event,
        slug: `test-${event}-${Date.now()}`,
        esImportante: event === 'create',
        titulo: `Noticia de prueba - ${event} - ${new Date().toLocaleString()}`,
        categoria: 'Pruebas',
      });
      setResult(result);
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
    setLoading(false);
  };

  const handleGetStatus = async () => {
    setLoading(true);
    try {
      const result = await getWebhookStatus();
      setResult(result);
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
    setLoading(false);
  };

  const handleGetLogs = async () => {
    setLoading(true);
    try {
      const result = await getWebhookLogs();
      setLogs(result);
    } catch (error) {
      setLogs({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
    setLoading(false);
  };

  const handleClearLogs = async () => {
    setLoading(true);
    try {
      const result = await clearWebhookLogs();
      setResult(result);
      setLogs(null);
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-green-800">
        🔧 Webhook Testing - Desarrollo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Panel de pruebas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Probar Eventos</h2>
          <div className="space-y-3">
            <button
              onClick={() => handleTest('create')}
              disabled={loading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              🆕 Crear Noticia
            </button>
            <button
              onClick={() => handleTest('update')}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              ✏️ Actualizar Noticia
            </button>
            <button
              onClick={() => handleTest('delete')}
              disabled={loading}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              🗑️ Eliminar Noticia
            </button>
          </div>
        </div>

        {/* Panel de monitoreo */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Monitoreo</h2>
          <div className="space-y-3">
            <button
              onClick={handleGetStatus}
              disabled={loading}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
            >
              📊 Estado del Webhook
            </button>
            <button
              onClick={handleGetLogs}
              disabled={loading}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
            >
              📋 Ver Logs
            </button>
            <button
              onClick={handleClearLogs}
              disabled={loading}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
            >
              🧹 Limpiar Logs
            </button>
          </div>
        </div>
      </div>

      {/* Resultado */}
      {result && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">📤 Último Resultado</h3>
          <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* Logs */}
      {logs && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">📋 Logs del Webhook</h3>
          <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto text-sm max-h-96 overflow-y-auto">
            {JSON.stringify(logs, null, 2)}
          </pre>
        </div>
      )}

      {/* Información útil */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">
          ℹ️ Información de Configuración
        </h3>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Endpoint:</strong> <code>/api/revalidate</code>
          </p>
          <p>
            <strong>Monitoreo:</strong> <code>/api/monitoring</code>
          </p>
          <p>
            <strong>Token:</strong>{' '}
            {process.env.REVALIDATE_SECRET_TOKEN
              ? '✅ Configurado'
              : '❌ No configurado'}
          </p>
          <p>
            <strong>Entorno:</strong> {process.env.NODE_ENV}
          </p>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span>Procesando...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
