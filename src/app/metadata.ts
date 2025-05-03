import type { Metadata } from "next";

const metadata: Metadata = {
  title: {
    default: "Consejo General de Educación",
    template: "%s | Consejo General de Educación",
  },
  description:
    "Sitio web oficial del Consejo General de Educación, con información institucional, recursos educativos, noticias, documentación y más.",
  keywords: [
    "educación",
    "Consejo General de Educación",
    "información educativa",
    "trámites educativos",
    "noticias educativas",
    "formación docente",
    "Argentina",
  ],
  authors: [
    {
      name: "Consejo General de Educación",
      url: "https://consejo.geroserial.com",
    },
  ],
  creator: "Consejo General de Educación de la Provincia de Corrientes",
  openGraph: {
    title: "Consejo General de Educación",
    description:
      "Información institucional, recursos educativos y servicios del Consejo General de Educación de la Provincia de Corrientes.",
    url: "https://consejo.geroserial.com",
    siteName: "Consejo General de Educación",
    images: [
      {
        url: "https://cge.gob.ar/og.png",
        width: 1200,
        height: 630,
        alt: "Consejo General de Educación - Información Institucional",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Consejo General de Educación",
    description:
      "Accede a la información educativa, documentación y más del Consejo General de Educación de la Provincia de Corrientes.",
    site: "@consejogeneral",
    creator: "@consejogeneral",
    images: ["https://cge.gob.ar/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default metadata;
