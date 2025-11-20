export default function ReunionNoviembrePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-3">
            Agenda Institucional Semanal
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Horario general: 8:30 a 12:00
          </p>
        </div>

        {/* Agenda Grid — mobile-first, luego columnas en pantallas grandes */}
        <div className="space-y-6">
          {/* Martes */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border-l-2 border-slate-200">
            <div className="px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Martes</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-32">
                  <span className="inline-block bg-slate-100 text-slate-800 text-sm font-medium px-3 py-1 rounded-md">
                    08:00 – 08:30
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 font-medium">Desayuno</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-32">
                  <span className="inline-block bg-slate-100 text-slate-800 text-sm font-medium px-3 py-1 rounded-md">
                    10:30 – 12:00
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 font-medium">
                    Reunión con Sanidad Escolar
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Miércoles */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border-l-2 border-slate-200">
            <div className="px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Miércoles
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-32">
                  <span className="inline-block bg-slate-100 text-slate-800 text-sm font-medium px-3 py-1 rounded-md">
                    08:30 – 11:30
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-slate-700 font-medium">
                      Desayuno de trabajo en Esteros
                    </p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Hipólito+Yrigoyen+1490+Corrientes+Argentina"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-slate-700 transition-colors"
                      title="Ver ubicación en el mapa"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </a>
                  </div>
                  <ul className="list-disc list-inside text-slate-600 text-sm space-y-1 ml-2">
                    <li>Responsables: Vocales</li>
                    <li>Llevar dispositivo (Notebook)</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-32">
                  <span className="inline-block bg-slate-100 text-slate-800 text-sm font-medium px-3 py-1 rounded-md">
                    11:30 – 12:00
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 font-medium">Cierre operativo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Jueves */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border-l-2 border-slate-200">
            <div className="px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Jueves</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-32">
                  <span className="inline-block bg-slate-100 text-slate-800 text-sm font-medium px-3 py-1 rounded-md">
                    08:00 – 08:30
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 font-medium">Desayuno</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-32">
                  <span className="inline-block bg-slate-100 text-slate-800 text-sm font-medium px-3 py-1 rounded-md">
                    08:30 – 12:00
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 font-medium">
                    Presentación del reglamento interno de escuelas (versión
                    final) + Tratamiento de expedientes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Viernes */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border-l-2 border-slate-200">
            <div className="px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">Viernes</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-32">
                  <span className="inline-block bg-slate-100 text-slate-800 text-sm font-medium px-3 py-1 rounded-md">
                    08:30 – 9:30
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 font-medium">
                    Ceremonial y protocolo (versión final)
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                {/* <div className="flex-shrink-0 w-32">
                  <span className="inline-block bg-slate-100 text-slate-800 text-sm font-medium px-3 py-1 rounded-md">
                    08:30 – 09:30
                  </span>
                </div> */}
                {/* <div className="flex-1">
                  <p className="text-slate-700 font-medium mb-2">
                    Reconocimiento a docentes jubilados
                  </p>
                  <ul className="list-none text-slate-600 text-sm space-y-1 ml-2">
                    <li>— Cristina M.</li>
                    <li>— Claudia F.</li>
                  </ul>
                </div> */}
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-32">
                  <span className="inline-block bg-slate-100 text-slate-800 text-sm font-medium px-3 py-1 rounded-md">
                    09:00 –
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 font-medium">
                    Reunión con supervisores y directivos seleccionados en la
                    Facultad de Derecho y Ciencias Sociales (UNNE)
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-32">
                  <span className="inline-block bg-slate-100 text-slate-800 text-sm font-medium px-3 py-1 rounded-md">
                    09:30 – 13:00
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 font-medium">
                    Tratamiento de expedientes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm">
            Agenda semanal institucional — Noviembre 2025
          </p>
        </div>
      </div>
    </div>
  );
}
