"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";
import { useState } from "react";
import { ContactoForm } from "../../interfaces";

export default function Contacto() {
  const [enviado, setEnviado] = useState(false);
  const form = useForm<ContactoForm>({
    defaultValues: { nombre: "", email: "", mensaje: "" },
  });

  const onSubmit: SubmitHandler<ContactoForm> = () => {
    setEnviado(true);
    form.reset();
    setTimeout(() => setEnviado(false), 4000);
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 md:px-0">
      <h2 className="text-3xl font-bold mb-2">Contacto</h2>
      <p className="text-gray-700 max-w-3xl mb-8">¿Tienes alguna consulta o sugerencia? Completa el formulario y nos pondremos en contacto contigo.</p>
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        {enviado && (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <AlertTitle>¡Mensaje enviado!</AlertTitle>
            <AlertDescription>
              Gracias por contactarte. Te responderemos a la brevedad.
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nombre"
              rules={{ required: "El nombre es obligatorio" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "El email es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email inválido",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="tu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mensaje"
              rules={{ required: "El mensaje es obligatorio" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensaje</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escribe tu mensaje..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-[#3D8B37] hover:bg-[#2D6A27] text-white"
            >
              Enviar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
