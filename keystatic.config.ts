import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },

  collections: {
    noticias: collection({
      label: "Noticias",
      slugField: "titulo_corto",
      path: "public/content/noticias/*",
      format: { contentField: "body" },
      schema: {
        titulo: fields.text({
          label: "Título",
          validation: { isRequired: true },
        }),
        titulo_corto: fields.slug({
          name: {
            label: "Título corto (Para la URL)",
            validation: { isRequired: true },
          },
        }),
        fecha: fields.datetime({
          label: "Fecha",
          defaultValue: { kind: "now" },
        }),
        resumen: fields.text({
          label: "Resumen",
          multiline: true,
          validation: { isRequired: true },
        }),
        imagen: fields.image({
          label: "Imagen",
          directory: "public/images/",
          publicPath: "/images/",
          validation: { isRequired: true },
        }),
        esImportante: fields.checkbox({
          label: "Mostrar con prioridad?",
          defaultValue: false,
        }),
        subcategoria: fields.select({
          label: "Subcategoría",
          options: [
            { label: "General", value: "general" },
            { label: "Educación", value: "educacion" },
            { label: "Docentes", value: "docentes" },
            { label: "Estudiantes", value: "estudiantes" },
            { label: "Inscripciones", value: "inscripciones" },
            { label: "Resoluciones", value: "resoluciones" },
          ],
          defaultValue: "general",
        }),
        body: fields.document({
          label: "Contenido",
          formatting: {
            inlineMarks: {
              bold: true,
              italic: true,
              code: true,
              strikethrough: true,
            },
            listTypes: {
              ordered: true,
              unordered: true,
            },
            headingLevels: [1, 2, 3, 4, 5, 6],
            blockTypes: {
              blockquote: true,
              code: true,
            },
            alignment: {
              center: true,
              end: true,
            },
            softBreaks: true,
          },
          dividers: true,
          links: true,
          images: {
            directory: "public/images",
            publicPath: "/images/",
            schema: {
              title: fields.text({
                label: "Título de la imagen",
                description: "Texto alternativo para accesibilidad",
              }),
            },
          },
          tables: true,
        }),

        imagenes_carrusel: fields.conditional(
          fields.checkbox({
            label: "¿Incluir carrusel de imágenes?",
            defaultValue: false,
          }),
          {
            true: fields.array(
              fields.object({
                imagen: fields.image({
                  label: "Imagen",
                  directory: "public/images",
                  publicPath: "/images",
                  validation: { isRequired: true },
                }),
                titulo: fields.text({
                  label: "Título de la imagen",
                }),
                descripcion: fields.text({
                  label: "Descripción",
                  multiline: true,
                }),
              }),
              {
                label: "Imágenes del carrusel",
                itemLabel: (props) =>
                  props.fields.titulo.value || "Imagen sin título",
                validation: { length: { min: 1 } },
              }
            ),
            false: fields.empty(),
          }
        ),
      },
    }),

    tramites: collection({
      label: "Trámites",
      slugField: "titulo_corto",
      path: "public/content/tramites/*",
      format: { contentField: "body" },
      schema: {
        titulo: fields.text({
          label: "Título",
          validation: { isRequired: true },
        }),
        titulo_corto: fields.slug({
          name: {
            label: "Título corto (Para la URL)",
            validation: { isRequired: true },
          },
        }),
        fecha: fields.datetime({
          label: "Fecha",
          defaultValue: { kind: "now" },
        }),
        resumen: fields.text({
          label: "Resumen",
          multiline: true,
          validation: { isRequired: true },
        }),
        imagen: fields.image({
          label: "Imagen",
          directory: "public/images/tramites",
          publicPath: "/images/tramites/",
          validation: { isRequired: true },
        }),
        subcategoria: fields.select({
          label: "Subcategoría",
          options: [
            { label: "Inscripción", value: "inscripcion" },
            { label: "Certificados", value: "certificados" },
            { label: "Títulos", value: "titulos" },
            { label: "Licencias", value: "licencias" },
            { label: "Otros", value: "otros" },
          ],
          defaultValue: "otros",
        }),

        body: fields.document({
          label: "Contenido detallado",
          formatting: {
            inlineMarks: {
              bold: true,
              italic: true,
              code: true,
              strikethrough: true,
            },
            listTypes: {
              ordered: true,
              unordered: true,
            },
            headingLevels: [1, 2, 3, 4, 5, 6],
            blockTypes: {
              blockquote: true,
              code: true,
            },
            alignment: {
              center: true,
              end: true,
            },
            softBreaks: true,
          },
          dividers: true,
          links: true,
          images: {
            directory: "public/images/tramites/content",
            publicPath: "/images/tramites/content/",
            schema: {
              title: fields.text({
                label: "Título de la imagen",
                description: "Texto alternativo para accesibilidad",
              }),
            },
          },
          tables: true,
        }),
      },
    }),
  },
});
