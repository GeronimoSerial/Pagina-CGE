import './index.css';
import Footer from '@/shared/components/Footer';
import { Lora, Inter } from 'next/font/google';
import Header from '@/shared/components/Header';
export { default as metadata } from './metadata';

const inter = Inter({ subsets: ['latin'] });
const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
});

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={`${lora.variable} ${inter.className} antialiased`}>
        <Header />
        <div id="root">{children}</div>
        <Footer />
      </div>
    </>
  );
}
