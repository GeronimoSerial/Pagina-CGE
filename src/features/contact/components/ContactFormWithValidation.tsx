'use client';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Card, CardContent, CardFooter } from '@/shared/ui/card';
import {
  Mail,
  User,
  FileText,
  MessageSquare,
  Send,
  Phone,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { useContactForm } from '@/features/contact/hooks/useContactForm';

export default function ContactFormWithValidation() {
  const { form, enviado, error, buttonState, onSubmit } = useContactForm();

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-xs">
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
                rules={{ required: 'El nombre es obligatorio' }}
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
                  required: 'El email es obligatorio',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email inválido',
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
                rules={{ required: 'El área es obligatoria' }}
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
                        <SelectItem value="Liquidaciones">
                          Liquidaciones
                        </SelectItem>
                        <SelectItem value="Vocalía">Vocalía</SelectItem>
                        <SelectItem value="PersonalDocente">
                          Personal Docente
                        </SelectItem>
                        <SelectItem value="Supervisión">Supervisión</SelectItem>
                        <SelectItem value="EPJA">
                          Educación P/ Jovenes y Adultos
                        </SelectItem>
                        <SelectItem value="OTROS">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="asunto"
                rules={{ required: 'El asunto es obligatorio' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <FileText className="h-3.5 w-3.5 text-[#3D8B37]" />
                      Asunto
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Asunto de tu consulta"
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
              rules={{ required: 'El mensaje es obligatorio' }}
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
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-b-lg">
        <div className="w-full">
          <button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={buttonState === 'loading'}
            className={`w-full px-4 py-3 text-sm font-medium text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              buttonState === 'loading'
                ? 'bg-gray-400 cursor-not-allowed'
                : buttonState === 'success'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-[#3D8B37] hover:bg-[#2D6B29] focus:ring-2 focus:ring-[#3D8B37]/20 focus:outline-none'
            }`}
          >
            {buttonState === 'loading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enviando...
              </>
            ) : buttonState === 'success' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Enviado
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar mensaje
              </>
            )}
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
