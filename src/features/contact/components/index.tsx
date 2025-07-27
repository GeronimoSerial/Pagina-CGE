'use client';
import dynamic from 'next/dynamic';
import ContactFormSkeleton from './ContactFormSkeleton';
const ContactFormWithValidation = dynamic(
  () => import('./ContactFormWithValidation'),
  {
    ssr: false,
    loading: () => <ContactFormSkeleton />,
  },
);

export default function ContactForm() {
  return <ContactFormWithValidation />;
}
