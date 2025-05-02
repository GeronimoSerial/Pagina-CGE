import { useState } from "react";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";

export interface ContactoForm {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

const SERVICE_ID = process.env.NEXT_PUBLIC_SERVICE_ID || "default_service_id";
const TEMPLATE_ID =
  process.env.NEXT_PUBLIC_TEMPLATE_ID || "default_template_id";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_PUBLIC_KEY || "default_public_key";

if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
  throw new Error("Missing required environment variables for EmailJS.");
}

export const useContactForm = () => {
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success"
  >("idle");

  const form = useForm<ContactoForm>({
    defaultValues: { nombre: "", email: "", asunto: "", mensaje: "" },
  });

  const onSubmit = async (data: ContactoForm) => {
    setButtonState("loading");
    try {
      const templateParams = {
        name: data.nombre,
        email: data.email,
        subject: data.asunto,
        message: data.mensaje,
      };

      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );

      if (result.text === "OK") {
        setEnviado(true);
        setError(null);
        form.reset();
        setButtonState("success");
        setTimeout(() => {
          setButtonState("idle");
          setEnviado(false);
        }, 5000);
      }
    } catch (error) {
      console.log("Error al enviar el mensaje:", error);
      setError("Hubo un error al enviar el mensaje");
      setButtonState("idle");
    }
  };

  return {
    form,
    enviado,
    error,
    buttonState,
    onSubmit,
  };
};
