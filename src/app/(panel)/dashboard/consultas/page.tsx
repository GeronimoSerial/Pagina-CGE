import { Metadata } from 'next';
import ConsultasClientPage from './client-page';

export const metadata: Metadata = {
  title: 'Consultas IA | Dashboard CGE',
};

export default function ConsultasPage() {
  return <ConsultasClientPage />;
}
