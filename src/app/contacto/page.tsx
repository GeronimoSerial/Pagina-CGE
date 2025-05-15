"use client";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Card, CardContent, CardFooter } from "@components/ui/card";
import {
  Mail,
  User,
  FileText,
  MessageSquare,
  Send,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import SocialMediaSection from "@modules/socials/SocialMediaSection";
import HeroSection from "@modules/layout/Hero";
import FAQSection from "@modules/layout/FAQSection";
import { useContactForm } from "@hooks/useContactForm";
import { faqsContact } from "@modules/faqs/faqs";

// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Contacto",
//   description:
//     "Si tienes alguna consulta o sugerencia, no dudes en contactarnos. Estamos aquí para ayudarte.",
// };
export default function Contacto() {
  const { form, enviado, error, buttonState, onSubmit } = useContactForm();

  return (
    <main className="bg-gray-50 min-h-screen">
      <HeroSection
        title="Contacto"
        description="Si tienes alguna consulta o sugerencia, no dudes en contactarnos. Estamos aquí para ayudarte."
      />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-teal-500/30 blur-3xl opacity-20 rounded-3xl -z-10"></div>
              <Card className="w-full backdrop-blur-sm bg-white/90 dark:bg-black/80 border border-gray-200/50 dark:border-gray-800/50 shadow-[0_20px_70px_-15px_rgba(61,139,55,0.25)] hover:shadow-[0_20px_70px_-15px_rgba(61,139,55,0.35)] transition-shadow duration-300 rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  {enviado && (
                    <Alert className="mb-6 border-green-500 bg-green-50">
                      <AlertTitle>¡Mensaje enviado con éxito!</AlertTitle>
                      <AlertDescription>
                        Gracias por contactarnos. Te responderemos a la
                        brevedad.
                      </AlertDescription>
                    </Alert>
                  )}
                  {error && (
                    <Alert className="mb-6 border-red-500 bg-red-50">
                      <AlertTitle className="text-red-800">
                        Error al enviar el mensaje
                      </AlertTitle>
                      <AlertDescription className="text-red-700">
                        {error}. Por favor, intente nuevamente.
                      </AlertDescription>
                    </Alert>
                  )}
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="nombre"
                          rules={{ required: "El nombre es obligatorio" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Nombre
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Tu nombre completo"
                                  {...field}
                                  className="h-12 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-200/50 dark:border-gray-800/50 focus:ring-2 focus:ring-[#3D8B37]/20 transition-all duration-200"
                                />
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
                              <FormLabel className="text-base flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="tu@email.com"
                                  {...field}
                                  className="h-12 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-200/50 dark:border-gray-800/50 focus:ring-2 focus:ring-[#3D8B37]/20 transition-all duration-200"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="asunto"
                        rules={{ required: "El asunto es obligatorio" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Asunto
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="¿En qué podemos ayudarte?"
                                {...field}
                                className="h-12 rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-200/50 dark:border-gray-800/50 focus:ring-2 focus:ring-[#3D8B37]/20 transition-all duration-200"
                              />
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
                            <FormLabel className="text-base flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              Mensaje
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Escribe tu mensaje aquí..."
                                className="min-h-[150px] rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border-gray-200/50 dark:border-gray-800/50 focus:ring-2 focus:ring-[#3D8B37]/20 transition-all duration-200 resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={buttonState !== "idle"}
                          className={`
                            w-full h-14 rounded-xl text-base font-medium
                            bg-gradient-to-r from-[#3D8B37] to-[#2D6A27]
                            hover:from-[#3D8B37]/90 hover:to-[#2D6A27]/90
                            text-white transition-all duration-300 shadow-lg
                            hover:shadow-[#3D8B37]/25 relative flex items-center justify-center
                          `}
                        >
                          {buttonState === "loading" && (
                            <span className="flex items-center gap-2">
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Enviando...
                            </span>
                          )}
                          {buttonState === "success" && (
                            <span className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5" />
                              Enviado
                            </span>
                          )}
                          {buttonState === "idle" && (
                            <span className="flex items-center gap-2">
                              Enviar mensaje
                              <Send className="h-5 w-5" />
                            </span>
                          )}
                        </button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200/50 dark:border-gray-800/50 py-6 px-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3 mb-4 sm:mb-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#3D8B37] to-[#2D6A27] flex items-center justify-center text-white shadow-lg">
                      <Mail className="h-5 w-5" />
                    </div>
                    <span className="text-base">cge@mec.gob.ar</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#3D8B37] to-[#2D6A27] flex items-center justify-center text-white shadow-lg">
                      <Phone className="h-5 w-5" />
                    </div>
                    <span className="text-base">0379 442-4264</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <FAQSection
        faqTitle="Preguntas Frecuentes"
        faqDescription="Encuentra respuestas comunes"
        faqs={faqsContact}
      />
      <SocialMediaSection
        title="Seguinos en redes sociales"
        description="Contactános a través de nuestras redes"
      />
    </main>
  );
}
