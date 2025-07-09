import type { Metadata } from "next";

const siteUrl = "https://consejo.mec.gob.ar";

const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Consejo General de Educación",
    template: "%s | Consejo General de Educación",
  },
  description:
    "Sitio web oficial del Consejo General de Educación.",
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
      url: siteUrl,
    },
  ],
  creator: "Consejo General de Educación de la Provincia de Corrientes",
  openGraph: {
    title: "Consejo General de Educación",
    description:
      "Información institucional, recursos educativos y servicios del Consejo General de Educación de la Provincia de Corrientes.",
    url: siteUrl,
    siteName: "Consejo General de Educación",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Consejo General de Educación - Información Institucional",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Consejo General de Educación",
    description:
      "Accede a la información educativa, documentación y más del Consejo General de Educación de la Provincia de Corrientes.",
    site: "@consejogeneral",
    creator: "@geroserial",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default metadata;
