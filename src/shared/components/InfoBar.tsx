import { Info } from 'lucide-react';

export default function InfoBar({ basePath }: { basePath: any }) {
  const isNews = basePath.includes('noticias');
  const isProcedure = basePath.includes('tramites');
  const isDocumentation = basePath.includes('documentacion');
  const infoBarItems = isNews
    ? [
        {
          icon: <Info className="h-5 w-5 text-[#3D8B37] mr-2" />,
          label: 'Actualizaciones:',
          value: 'Noticias actualizadas diariamente',
        },
      ]
    : isProcedure
      ? [
          {
            icon: <Info className="h-5 w-5 text-[#3D8B37] mr-2" />,
            label: 'Horario de atención:',
            value: 'Lunes a Viernes de 7:00 a 18:00 hs',
          },
        ]
      : isDocumentation
        ? [
            {
              icon: <Info className="h-5 w-5 text-[#3D8B37] mr-2" />,
              label: 'Horario de atención:',
              value: 'Lunes a Viernes de 7:00 a 18:00 hs',
            },
            {
              icon: <Info className="h-5 w-5 text-[#3D8B37] mr-2" />,
              label: 'Consultas:',
              value: '3794-852954',
            },
          ]
        : [
            {
              icon: <Info className="h-5 w-5 text-[#3D8B37] mr-2" />,
              label: 'Horario de atención:',
              value: 'Lunes a Viernes de 7:00 a 18:00 hs',
            },
          ];
  return (
    <main>
      <div className="bg-white border-b border-gray-100 shadow-xs">
        <div className="container mx-auto px-4 md:px-6 py-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {infoBarItems.map((item, index) => (
              <div key={index} className="flex items-center">
                {item.icon}
                <p className="text-sm font-medium text-gray-600">
                  {item.label}{' '}
                  <span className="text-gray-900">{item.value}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
