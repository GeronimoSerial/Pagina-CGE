// Script de prueba para verificar APIs de noticias e imágenes
const API_URL = 'https://devcms.geroserial.com/items';

async function testNoticiasAPI() {
  console.log('🧪 Probando API de noticias...');

  try {
    // Test 1: Obtener primera página de noticias
    const response = await fetch(
      `${API_URL}/noticias?fields=id,titulo,portada,imagenes.directus_files_id.*&limit=2`,
    );
    const { data } = await response.json();

    console.log('✅ Respuesta API:', {
      count: data.length,
      firstNoticia: {
        id: data[0]?.id,
        titulo: data[0]?.titulo,
        portada: data[0]?.portada,
        imagenes: data[0]?.imagenes?.length || 0,
      },
    });

    // Test 2: Verificar URLs de assets
    if (data[0]?.portada) {
      const portadaUrl = `https://devcms.geroserial.com/assets/${data[0].portada}?width=1200&height=800&quality=95&format=webp`;
      console.log('🖼️ URL de portada:', portadaUrl);

      // Test de carga de imagen
      const imgResponse = await fetch(portadaUrl, { method: 'HEAD' });
      console.log(
        '✅ Estado imagen portada:',
        imgResponse.status,
        imgResponse.statusText,
      );
    }

    if (data[0]?.imagenes?.length > 0) {
      const imgId = data[0].imagenes[0].directus_files_id.id;
      const imgUrl = `https://devcms.geroserial.com/assets/${imgId}?width=800&height=600&quality=90&format=webp`;
      console.log('🖼️ URL de imagen contenido:', imgUrl);

      const imgResponse = await fetch(imgUrl, { method: 'HEAD' });
      console.log(
        '✅ Estado imagen contenido:',
        imgResponse.status,
        imgResponse.statusText,
      );
    }
  } catch (error) {
    console.error('❌ Error en test:', error);
  }
}

// Ejecutar test
testNoticiasAPI();
