export interface FAQLink {
  text: string;
  url: string;
}

export interface FAQAnswer {
  text: string;
  links?: FAQLink[];
}

export interface FAQ {
  question: string;
  answer: FAQAnswer;
}

export const faqsContact: FAQ[] = [
  {
    question: "¿Cómo puedo contactarme con el CGE?",
    answer: {
      text: "Puedes contactarte a través de nuestro formulario de contacto, por teléfono al 0379-442-4264 o visitando nuestras oficinas.",
    },
  },
  {
    question: "¿Cuál es el horario de atención?",
    answer: {
      text: "Nuestro horario de atención es de lunes a viernes de 7:00 a 18:00 hs.",
    },
  },
  {
    question: "¿Dónde se encuentran las oficinas del CGE?",
    answer: {
      text: "Nuestras oficinas están ubicadas en la calle Catamarca 640, Corrientes, Capital.",
    },
  },
];

export const faqsDocs: FAQ[] = [
  {
    question: "¿Qué es la documentación requerida?",
    answer: {
      text: "La documentación requerida es el conjunto de papeles y formularios necesarios para completar un trámite específico.",
    },
  },
  {
    question: "¿Dónde puedo encontrar los formularios necesarios?",
    answer: {
      text: "Los formularios necesarios están disponibles en el portal digital del Consejo General de Educación, en la sección de documentacion.",
      links: [
        {
          text: "Ir a formularios",
          url: "/documentacion?categoria=formularios",
        },
      ],
    },
  },
  // {
  //   question: "¿Cómo puedo enviar mi documentación?",
  //   answer: {
  //     text: "Puede enviar su documentación a través del portal digital o presentarla en Mesa de Entradas del Consejo General de Educación.",
  //     links: [
  //       {
  //         text: "Enviar documentación online",
  //         url: "/tramites/enviar-documentacion",
  //       },
  //     ],
  //   },
  // },
  {
    question: "¿Qué hago si me falta algún documento?",
    answer: {
      text: "Si le falta algún documento, consulte la lista de requisitos en la ficha de trámite específica y asegúrese de completar todos los documentos necesarios.",
    },
  },
];

export const faqsTramites: FAQ[] = [
  {
    question: "¿Cómo inicio un trámite?",
    answer: {
      text: "Para iniciar un trámite debe presentar la documentación requerida en Mesa de Entradas del Consejo General de Educación",
      // links: [
      //   {
      //     text: "Acceder al portal digital",
      //     url: "/tramites",
      //   },
      // ],
    },
  },
  {
    question: "¿Cuánto tiempo demora un trámite?",
    answer: {
      text: "Los tiempos de resolución varían según el tipo de trámite y la carga administrativa. En general, los trámites pueden demorar entre 5 y 30 días hábiles.",
    },
  },
  {
    question: "¿Qué documentos necesito presentar?",
    answer: {
      text: "Los documentos requeridos varían según el tipo de trámite. Puede encontrar la lista completa de requisitos en cada ficha de trámite específica.",
      links: [
        {
          text: "Ver listado de trámites",
          url: "/tramites",
        },
      ],
    },
  },
  {
    question: "¿Cómo consulto el estado de mi trámite?",
    answer: {
      text: "Puede consultar el estado de su trámite ingresando su número de expediente o tipo de trámite en el portal digital, donde podrá ubicar su expediente o trámite en cualquier repartición.",
      links: [
        {
          text: "Consultar estado de trámite",
          url: "https://expgob.mec.gob.ar/lup_mod/ubicar_expedWeb.asp",
        },
      ],
    },
  },
];

export const faqsNews: FAQ[] = [
  {
    question: "¿Con qué frecuencia se actualizan las noticias?",
    answer: {
      text: "Nuestro portal se actualiza diariamente con las últimas noticias y comunicados del Consejo General de Educación.",
    },
  },
  {
    question: "¿Cómo puedo buscar noticias anteriores?",
    answer: {
      text: "Puede utilizar el buscador en la parte superior de la página o filtrar por categorías para encontrar noticias específicas.",
    },
  },
  {
    question: "¿Cómo identifico las noticias urgentes?",
    answer: {
      text: "Las noticias urgentes están marcadas con una etiqueta especial y aparecen destacadas en la parte superior del portal.",
    },
  },
  {
    question: "¿Puedo compartir las noticias?",
    answer: {
      text: "Sí, todas las noticias pueden ser compartidas a través de redes sociales o mediante el enlace directo a la noticia.",
      links: [
        {
          text: "Ver últimas noticias",
          url: "/noticias",
        },
      ],
    },
  },
];
