"use client";
import { useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { useState } from "react";
import { Info, Phone, HelpCircle, ArrowRight, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import SocialMediaSection from "../../modules/socials/SocialMediaSection";
import HeroSubSection from "../../modules/layout/Hero";
// Definición de la interfaz
export interface ContactoForm {
  nombre: string;
  email: string;
  mensaje: string;
}

export default function Contacto() {
  const [enviado, setEnviado] = useState(false);
  const form = useForm<ContactoForm>({
    defaultValues: { nombre: "", email: "", mensaje: "" },
  });

  const onSubmit = (data: ContactoForm) => {
    console.log("Datos del formulario:", data);
    setEnviado(true);
    form.reset();
    setTimeout(() => setEnviado(false), 4000);
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero section con degradado */}
      <HeroSubSection
        title="Contacto"
        description="Si tienes alguna consulta o sugerencia, no dudes en contactarnos."
      />

      {/* Sección de información importante */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-[#3D8B37] mr-2" />
              <p className="text-sm font-medium text-gray-600">
                Horario de atención:{" "}
                <span className="text-gray-900">
                  Lunes a Viernes de 7:00 a 18:00 hs
                </span>
              </p>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-[#3D8B37] mr-2" />
              <p className="text-sm font-medium text-gray-600">
                Consultas: <span className="text-gray-900">0800-555-1234</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección principal de formulario */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Envíanos un mensaje
            </h2>
            {enviado && (
              <Alert className="mb-6 border-green-500 bg-green-50">
                <AlertTitle>¡Mensaje enviado con éxito!</AlertTitle>
                <AlertDescription>
                  Gracias por contactarnos. Te responderemos a la brevedad.
                </AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="nombre"
                  rules={{ required: "El nombre es obligatorio" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Nombre
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tu nombre"
                          className="border-gray-200 focus:border-[#3D8B37] focus:ring-[#3D8B37] rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
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
                      <FormLabel className="text-gray-700 font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          className="border-gray-200 focus:border-[#3D8B37] focus:ring-[#3D8B37] rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mensaje"
                  rules={{ required: "El mensaje es obligatorio" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Mensaje
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Escribe tu mensaje..."
                          rows={5}
                          className="border-gray-200 focus:border-[#3D8B37] focus:ring-[#3D8B37] rounded-lg resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
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
      </section>
      <SocialMediaSection
        title="Seguinos en redes sociales"
        description="Contactános a través de nuestras redes"
      />

      {/* Sección de preguntas frecuentes */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold mb-3 text-gray-800">
              Preguntas Frecuentes
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Respuestas a las consultas más comunes sobre trámites del Consejo
              General de Educación
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Pregunta 1 */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-[#3D8B37]" />
                ¿Cómo solicito un certificado de estudios?
              </h4>
              <p className="text-gray-600">
                Para solicitar un certificado de estudios, debe presentar su DNI
                y completar el formulario correspondiente en la Mesa de
                Entradas. También puede realizar la solicitud a través de
                nuestro portal digital.
              </p>
            </div>

            {/* Pregunta 2 */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-[#3D8B37]" />
                ¿Dónde puedo realizar consultas sobre títulos?
              </h4>
              <p className="text-gray-600">
                Las consultas sobre títulos se pueden realizar personalmente en
                el Departamento de Títulos y Certificaciones, o mediante nuestro
                sistema de consultas online con su número de documento.
              </p>
            </div>

            {/* Pregunta 3 */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-[#3D8B37]" />
                ¿Cómo registro una institución educativa?
              </h4>
              <p className="text-gray-600">
                Para registrar una institución educativa debe presentar la
                documentación completa según la normativa vigente. Puede
                consultar los requisitos en la sección de Trámites de nuestra
                web.
              </p>
            </div>

            {/* Pregunta 4 */}
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-[#3D8B37]" />
                ¿Cómo actualizo mis datos docentes?
              </h4>
              <p className="text-gray-600">
                La actualización de datos docentes se realiza a través del
                sistema SIRE. Ingrese con su usuario y contraseña, y siga las
                instrucciones en la sección "Actualización de Datos Personales".
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/preguntas-frecuentes"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-colors"
            >
              Ver todas las preguntas frecuentes
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </div>

          <div className="mt-10 bg-gray-50 p-6 rounded-xl shadow-sm max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-[#3D8B37] mr-3" />
                <div>
                  <h4 className="font-bold text-lg text-gray-800">
                    Horarios de atención
                  </h4>
                  <p className="text-gray-600">
                    Lunes a Viernes de 8:00 a 16:00 hs
                  </p>
                </div>
              </div>
              <a
                href="/contacto"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-[#3D8B37] hover:bg-[#2D6A27] text-white font-medium transition-colors"
              >
                Contactar Mesa de Ayuda
                <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
