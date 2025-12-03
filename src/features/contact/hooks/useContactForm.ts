import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ContactForm } from '@/shared/interfaces';

const SERVICE_ID = process.env.NEXT_PUBLIC_SERVICE_ID || '';
const TEMPLATE_ID = process.env.NEXT_PUBLIC_TEMPLATE_ID || '';
const PUBLIC_KEY = process.env.NEXT_PUBLIC_PUBLIC_KEY || '';

export const useContactForm = () => {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buttonState, setButtonState] = useState<
    'idle' | 'loading' | 'success'
  >('idle');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<ContactForm>({
    defaultValues: { nombre: '', email: '', asunto: '', mensaje: '', area: '' },
  });

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const onSubmit = async (data: ContactForm) => {
    if (!TEMPLATE_ID || !PUBLIC_KEY) {
      setError(
        'El servicio de contacto no está configurado. Intenta más tarde.',
      );
      return;
    }

    setButtonState('loading');
    try {
      const emailjs = await import('@emailjs/browser');

      const templateParams = {
        name: data.nombre,
        email: data.email,
        subject: data.asunto,
        message: data.mensaje,
        area: data.area,
      };

      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY,
      );

      if (result.text === 'OK') {
        setSent(true);
        setError(null);
        form.reset();
        setButtonState('success');

        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setButtonState('idle');
          setSent(false);
          timeoutRef.current = null;
        }, 5000);
      }
    } catch (error) {
      console.log('Error al enviar el mensaje:', error);
      setError('Hubo un error al enviar el mensaje');
      setButtonState('idle');
    }
  };

  return {
    form,
    sent,
    error,
    buttonState,
    onSubmit,
  };
};
