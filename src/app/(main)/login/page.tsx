'use client';

import React, { useState } from 'react';
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { signIn } from '@/shared/lib/auth/auth-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn.email(
        { email, password },
        {
          onSuccess: () => {
            setLoading(false);
            window.location.replace('/dashboard');
          },
          onError: (ctx) => {
            setError(ctx.error.message);
            setLoading(false);
          },
        },
      );
    } catch (err) {
      setError('Ocurrió un error inesperado al iniciar sesión.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* SECCIÓN IZQUIERDA: Visual / Institucional / Inspiracional */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900">
        {/* Fondo Abstracto y Sofisticado */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay scale-105" />
        {/* Gradiente cambiado a Emerald */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 opacity-90" />

        {/* Elementos Decorativos de Fondo */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-16 w-full text-white">
          <Link
            href="/"
            className="flex items-center gap-3 animate-fade-in group hover:opacity-80 transition-opacity"
          >
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 group-hover:bg-white/20 transition-colors">
              <ArrowLeft className="h-6 w-6 text-emerald-200" />
            </div>
            <span className="text-sm font-medium tracking-widest text-emerald-100 uppercase">
              Volver
            </span>
          </Link>

          <div className="max-w-lg animate-fade-in-up">
            <h1 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
              Consejo General de Educación
            </h1>
            <p className="text-lg text-emerald-100/80 font-light leading-relaxed">
              Gestión y acompañamiento pedagógico integral en la educación
              inicial, primaria y de adultos de nuestra provincia.
            </p>
          </div>

          <div className="text-xs text-emerald-200/50 flex justify-between items-center">
            <span>© 2025 Consejo General de Educación</span>
            <span>v3.1.1</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN DERECHA: Formulario Interactivo */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white relative">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Encabezado Móvil (Solo visible en pantallas pequeñas) */}
          <div className="lg:hidden text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-600/30">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Consejo General de Educación
            </h2>
          </div>

          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Bienvenido de nuevo
            </h2>
            <p className="text-slate-500">
              Ingrese sus credenciales institucionales para continuar.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            {/* Input Groups */}
            <div className="space-y-5">
              <div className="relative group">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-slate-50 focus:bg-white hover:bg-white"
                    placeholder="nombre@educacion.gob.ar"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block ml-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-slate-50 focus:bg-white hover:bg-white"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-100 p-4 animate-pulse">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error de autenticación
                    </h3>
                    <div className="mt-1 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-slate-600 cursor-pointer select-none"
                >
                  Recordarme
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.01] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/30 transition-all duration-200 overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Validando credenciales...
                </div>
              ) : (
                <div className="flex items-center">
                  Ingresar al Sistema
                  <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {/* Footer Secundario */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  ¿Necesita soporte técnico?
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-4 text-sm text-slate-400">
              <a href="#" className="hover:text-emerald-600 transition-colors">
                Mesa de Ayuda
              </a>
              <span>•</span>
              <a href="#" className="hover:text-emerald-600 transition-colors">
                Manual de Usuario
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
