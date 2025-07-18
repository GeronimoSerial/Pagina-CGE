import {
  getNoticiaBySlugDirectus,
  getImagenesDirectus,
} from '../features/noticias/services/noticias-directus';

async function testImagenes() {
  try {
    console.log('Probando obtener noticia...');
    const noticia = await getNoticiaBySlugDirectus(
      'nuevas-capacitaciones-del-programa-infancia',
    );

    if (noticia) {
      console.log('Noticia encontrada:', noticia.titulo);
      console.log('Imagenes raw:', noticia.imagenes);

      const imagenes = await getImagenesDirectus(noticia);
      console.log('Imagenes procesadas:', imagenes);
    } else {
      console.log('No se encontró la noticia');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testImagenes();
