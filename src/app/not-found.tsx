import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto py-20 px-4 text-center">
      <h2 className="text-3xl font-bold mb-4 text-[#205C3B]">Página no encontrada</h2>
      <p className="text-gray-700 mb-6">
        Lo sentimos, no pudimos encontrar el recurso solicitado.
      </p>
      <p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-2 bg-[#3D8B37] text-white rounded-md hover:bg-[#2b6e28] transition-colors"
        >
          Volver al inicio
        </Link>
      </p>
    </div>
  )
}
