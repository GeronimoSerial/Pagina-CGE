import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CGE - Consejo General de Educación',
  description: 'Consejo General de Educación de Entre Ríos',
};

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
