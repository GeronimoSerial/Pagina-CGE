import "./index.css";
import Footer from "@modules/layout/Footer";
import Header from "@modules/layout/Header";
import { Lora, Inter } from "next/font/google";
import ModalAvisoDesarrollo from "@components/ModalAvisoDesarrollo";

import metadata from "./metadata";
import Head from "next/head";

export { metadata };

//fonts

const inter = Inter({ subsets: ["latin"] });
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${lora.variable} antialiased`}>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body className={`${inter.className} antialiased`}>
        <Header />
        <ModalAvisoDesarrollo />
        <div id="root">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
