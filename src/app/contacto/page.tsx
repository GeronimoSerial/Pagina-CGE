// Página de contacto
import ContactForm from '@/features/contact/components';
import { FormPageLayout } from '@/shared/components/PageLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Si tienes alguna consulta o sugerencia, no dudes en contactarnos. Estamos aquí para ayudarte.',
  alternates: {
    canonical: '/contacto',
  },
  openGraph: {
    title: 'Contacto',
    description:
      'Si tienes alguna consulta o sugerencia, no dudes en contactarnos. Estamos aquí para ayudarte.',
    type: 'website',
    url: '/contacto',
    images: [
      {
        url: '/og.webp',
        width: 1200,
        height: 630,
        alt: 'Consejo General de Educación',
      },
    ],
  },
};

export default function Contacto() {
  return (
    <FormPageLayout
      title="Contacto"
      description="Si tienes alguna consulta o sugerencia, no dudes en contactarnos. Estamos aquí para ayudarte."
      showFAQ={true}
      faqBasePath="/contacto"
    >
      <ContactForm />
    </FormPageLayout>
  );
}
