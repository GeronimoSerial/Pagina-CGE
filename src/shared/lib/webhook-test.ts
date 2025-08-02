/**
 * Utilidades para testing del webhook de revalidación
 * Útil para desarrollo y debugging
 */

interface TestWebhookOptions {
  event: 'create' | 'update' | 'delete';
  slug?: string;
  esImportante?: boolean;
  titulo?: string;
  categoria?: string;
  baseUrl?: string;
}

/**
 * Función para probar el webhook desde el cliente
 */
export async function testWebhook({
  event,
  slug = 'test-noticia',
  esImportante = false,
  titulo = 'Noticia de prueba',
  categoria = 'General',
  baseUrl = ''
}: TestWebhookOptions) {
  const payload = {
    event,
    collection: 'noticias',
    keys: ['test-id'],
    payload: {
      id: 'test-id',
      slug,
      esImportante,
      titulo,
      categoria
    }
  };

  try {
    const response = await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REVALIDATE_SECRET_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Función para obtener el estado del webhook
 */
export async function getWebhookStatus(baseUrl: string = '') {
  try {
    const response = await fetch(`${baseUrl}/api/revalidate`);
    const result = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Función para obtener logs de monitoreo
 */
export async function getWebhookLogs(baseUrl: string = '', limit: number = 50) {
  try {
    const response = await fetch(`${baseUrl}/api/monitoring?limit=${limit}`, {
      headers: process.env.NODE_ENV === 'production' ? {
        'Authorization': `Bearer ${process.env.REVALIDATE_SECRET_TOKEN}`
      } : {}
    });
    
    const result = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Función para limpiar logs de monitoreo
 */
export async function clearWebhookLogs(baseUrl: string = '') {
  try {
    const response = await fetch(`${baseUrl}/api/monitoring`, {
      method: 'DELETE',
      headers: process.env.NODE_ENV === 'production' ? {
        'Authorization': `Bearer ${process.env.REVALIDATE_SECRET_TOKEN}`
      } : {}
    });
    
    const result = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Comandos curl para testing manual
 */
export const curlCommands = {
  testCreate: (baseUrl: string, token: string) => `
curl -X POST ${baseUrl}/api/revalidate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token}" \\
  -d '{
    "event": "create",
    "collection": "noticias",
    "keys": ["test"],
    "payload": {
      "id": "test",
      "slug": "nueva-noticia-test",
      "esImportante": true,
      "titulo": "Nueva noticia de prueba"
    }
  }'`,

  testUpdate: (baseUrl: string, token: string) => `
curl -X POST ${baseUrl}/api/revalidate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token}" \\
  -d '{
    "event": "update",
    "collection": "noticias",
    "keys": ["test"],
    "payload": {
      "id": "test",
      "slug": "noticia-actualizada-test",
      "esImportante": false,
      "titulo": "Noticia actualizada de prueba"
    }
  }'`,

  testDelete: (baseUrl: string, token: string) => `
curl -X POST ${baseUrl}/api/revalidate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${token}" \\
  -d '{
    "event": "delete",
    "collection": "noticias",
    "keys": ["test"],
    "payload": {
      "id": "test",
      "titulo": "Noticia eliminada de prueba"
    }
  }'`,

  getStatus: (baseUrl: string) => `
curl -X GET ${baseUrl}/api/revalidate`,

  getLogs: (baseUrl: string, token?: string) => `
curl -X GET ${baseUrl}/api/monitoring${token ? ` \\\n  -H "Authorization: Bearer ${token}"` : ''}`,

  clearLogs: (baseUrl: string, token?: string) => `
curl -X DELETE ${baseUrl}/api/monitoring${token ? ` \\\n  -H "Authorization: Bearer ${token}"` : ''}`
};

/**
 * Función auxiliar para generar payload de Directus
 */
export function generateDirectusPayload(
  event: 'create' | 'update' | 'delete',
  id: string,
  data: { slug?: string; esImportante?: boolean; titulo?: string; categoria?: string } = {}
) {
  return {
    event,
    collection: 'noticias',
    keys: [id],
    payload: {
      id,
      ...data
    }
  };
}

// Ejemplo de uso en desarrollo:
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).webhookTest = {
    testWebhook,
    getWebhookStatus,
    getWebhookLogs,
    clearWebhookLogs,
    curlCommands
  };
}
