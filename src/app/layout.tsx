import './index.css';
import Footer from '@/shared/components/Footer';
import { Lora, Inter } from 'next/font/google';

import metadata from './metadata';
import Header from '@/shared/components/Header';

export { metadata };

const inter = Inter({ subsets: ['latin'] });
const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${lora.variable} antialiased`}>
      <body className={`${inter.className} antialiased`}>
        <Header />

        <div id="root">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
