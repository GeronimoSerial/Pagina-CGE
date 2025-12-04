import type { Metadata } from 'next';

import metadata from './metadata';
import Header from '@/shared/components/Header';
import type { Viewport } from 'next';

export { metadata };

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

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
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
