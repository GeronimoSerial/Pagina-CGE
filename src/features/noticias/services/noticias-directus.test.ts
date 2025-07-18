import {
  getAllNoticiasDirectus,
  getNoticiasPaginadasDirectus,
  getNoticiaBySlugDirectus,
  getNoticiasRelacionadasDirectus,
  getPortadaDirectus,
  getImagenesDirectus,
  getNoticiasCategoriasDirectus,
} from './noticias-directus';

async function runTests() {
  try {
    console.log('Test: getAllNoticiasDirectus');
    const allNoticias = await getAllNoticiasDirectus();
    console.log('Total noticias:', allNoticias?.length ?? 0);
    if (allNoticias && allNoticias.length > 0) {
      console.log('Primer slug:', allNoticias[0]?.slug ?? '(sin slug)');
    }

    console.log('\nTest: getNoticiasPaginadasDirectus');
    const paginadas = await getNoticiasPaginadasDirectus(1, 2);
    console.log('Noticias paginadas:', paginadas.noticias?.length ?? 0, 'Paginación:', paginadas.pagination);
    if (paginadas.noticias && paginadas.noticias.length > 0) {
      console.log('Primera noticia:', paginadas.noticias[0]?.titulo ?? '(sin titulo)');
    }

    if (allNoticias && allNoticias.length > 0) {
      const slug = allNoticias[0]?.slug;
      if (slug) {
        console.log(`\nTest: getNoticiaBySlugDirectus (${slug})`);
        const noticia = await getNoticiaBySlugDirectus(slug);
        console.log('Noticia:', noticia?.titulo ?? '(sin titulo)');

        console.log(`\nTest: getNoticiasRelacionadasDirectus (categoria de la noticia)`);
        if (noticia?.categoria) {
          const relacionadas = await getNoticiasRelacionadasDirectus(noticia.categoria, slug);
          console.log('Relacionadas:', relacionadas?.length ?? 0);
        } else {
          console.log('La noticia no tiene categoría, se omite test de relacionadas.');
        }

        console.log('\nTest: getPortadaDirectus');
        const portada = getPortadaDirectus({ noticia });
        console.log('Portada URL:', portada ?? '(sin portada)');

        console.log('\nTest: getImagenesDirectus');
        if (noticia) {
          const imagenes = getImagenesDirectus(noticia);
          console.log('Imágenes:', imagenes?.length ?? 0);
          if (imagenes && imagenes.length > 0) {
            console.log('Primera imagen URL:', imagenes[0].url);
          }
        } else {
          console.log('Noticia es null, no se puede probar getImagenesDirectus');
        }
      } else {
        console.log('No hay slug en la primera noticia, se omiten tests dependientes de slug.');
      }
    }

    console.log('\nTest: getNoticiasCategoriasDirectus');
    const categorias = await getNoticiasCategoriasDirectus();
    console.log('Categorías:', categorias?.map(c => c.nombre) ?? []);

    console.log('\nTodos los tests ejecutados correctamente.');
  } catch (error) {
    console.error('Error en los tests:', error);
  }
}

runTests(); 