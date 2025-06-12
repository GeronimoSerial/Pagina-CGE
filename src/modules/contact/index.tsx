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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Card, CardContent, CardFooter } from "@components/ui/card";
import {
  Mail,
  User,
  FileText,
  MessageSquare,
  Send,
  Phone,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import { useContactForm } from "@/src/hooks/contacto/useContactForm";

export default function ContactForm() {
  const { form, enviado, error, buttonState, onSubmit } = useContactForm();

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-sm">
      <CardContent className="p-4">
        {enviado && (
          <Alert className="mb-4 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-[#3D8B37]" />
            <AlertTitle className="text-[#3D8B37] dark:text-green-200">
              ¡Mensaje enviado con éxito!
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              Gracias por contactarnos. Te responderemos a la brevedad.
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
            <AlertTitle className="text-red-800 dark:text-red-200">
              Error al enviar el mensaje
            </AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-300">
              {error}. Por favor, intente nuevamente.
            </AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                rules={{ required: "El nombre es obligatorio" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <User className="h-3.5 w-3.5 text-[#3D8B37]" />
                      Nombre
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tu nombre completo"
                        {...field}
                        className="h-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus:border-[#3D8B37] dark:focus:border-[#3D8B37] focus:ring-1 focus:ring-[#3D8B37]/20"
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
                    <FormLabel className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Mail className="h-3.5 w-3.5 text-[#3D8B37]" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        {...field}
                        className="h-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus:border-[#3D8B37] dark:focus:border-[#3D8B37] focus:ring-1 focus:ring-[#3D8B37]/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="area"
                rules={{ required: "El área es obligatoria" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Building2 className="h-3.5 w-3.5 text-[#3D8B37]" />
                      Área
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus:border-[#3D8B37] dark:focus:border-[#3D8B37] focus:ring-1 focus:ring-[#3D8B37]/20">
                          <SelectValue placeholder="Selecciona un área" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="liquidaciones">
                          Liquidaciones
                        </SelectItem>
                        <SelectItem value="vocalia">Vocalía</SelectItem>
                        <SelectItem value="personalDocente">
                          Personal Docente
                        </SelectItem>
                        <SelectItem value="supervision">Supervisión</SelectItem>
                        <SelectItem value="epja">
                          Educación P/ Jovenes y Adultos
                        </SelectItem>
                        <SelectItem value="otros">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="asunto"
                rules={{ required: "El asunto es obligatorio" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <FileText className="h-3.5 w-3.5 text-[#3D8B37]" />
                      Asunto
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="¿En qué podemos ayudarte?"
                        {...field}
                        className="h-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus:border-[#3D8B37] dark:focus:border-[#3D8B37] focus:ring-1 focus:ring-[#3D8B37]/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="mensaje"
              rules={{ required: "El mensaje es obligatorio" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MessageSquare className="h-3.5 w-3.5 text-[#3D8B37]" />
                    Mensaje
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escribe tu mensaje aquí..."
                      className="min-h-[100px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus:border-[#3D8B37] dark:focus:border-[#3D8B37] focus:ring-1 focus:ring-[#3D8B37]/20 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-2">
              <button
                type="submit"
                disabled={buttonState !== "idle"}
                className="w-full rounded-xl h-10 text-sm font-medium bg-[#3D8B37] text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors duration-200"
              >
                {buttonState === "loading" && (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Enviando...
                  </>
                )}
                {buttonState === "success" && (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Enviado
                  </>
                )}
                {buttonState === "idle" && (
                  <>
                    Enviar mensaje
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 dark:border-gray-800 py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <div className="h-8 w-8 rounded-full bg-[#3D8B37]/10 dark:bg-[#3D8B37]/20 flex items-center justify-center">
            <Mail className="h-4 w-4 text-[#3D8B37]" />
          </div>
          <span>cge@mec.gob.ar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#3D8B37]/10 dark:bg-[#3D8B37]/20 flex items-center justify-center">
            <Phone className="h-4 w-4 text-[#3D8B37]" />
          </div>
          <span>0379 442-4264</span>
        </div>
      </CardFooter>
    </Card>
  );
}
