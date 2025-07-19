import { Card, CardContent } from '@/shared/ui/card';
import { FileText, School, BookOpen, BotMessageSquare } from 'lucide-react';
import { QuickAccessItemProps } from '@/shared/interfaces';

const QuickAccessItem = ({
  icon,
  title,
  description,
  href = '#',
}: QuickAccessItemProps) => {
  return (
    <a
      href={href}
      className="block group focus:outline-none focus:ring-2 focus:ring-[#205C3B] rounded-xl transition-all"
      tabIndex={0}
    >
      <Card className="h-full transition-all border-0 shadow-md hover:shadow-xl hover:scale-[1.03] via-white to-[#E6F4EA] group-hover:border-[#217A4B]/40 rounded-xl">
        <CardContent className="flex flex-col items-center text-center p-6">
          <div className="p-4 rounded-full bg-gradient-to-br from-[#217A4B]/90 to-[#205C3B]/80 text-white mb-4 mt-2 shadow-lg group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <h3 className="font-bold text-lg mb-1 group-hover:text-[#217A4B] transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-700 font-medium">{description}</p>
        </CardContent>
      </Card>
    </a>
  );
};

interface QuickAccessProps {
  items?: QuickAccessItemProps[];
}

const QuickAccess = ({ items = [] }: QuickAccessProps) => {
  const defaultItems: QuickAccessItemProps[] = [
    {
      icon: <FileText size={24} />,
      title: 'Trámites',
      description:
        'Acceda a información útil para gestionar trámites administrativos',
      href: '/tramites',
    },
    {
      icon: <BookOpen size={24} />,
      title: 'Documentación',
      description: 'Consulte normas y reglamentos oficiales del CGE',
      href: '/documentacion',
    },
    {
      icon: <BotMessageSquare size={24} />,
      title: 'Asistente Virtual',
      description:
        'Consultá normativa educativa con el chatbot oficial del Consejo General de Educación',
      href: '/chatbot',
    },
    {
      icon: <School size={24} />,
      title: 'Escuelas',
      description:
        'Información sobre las escuelas pertenecientes al Consejo General de Educación',
      href: '/escuelas',
    },
  ];

  const displayItems = items.length > 0 ? items : defaultItems;

  return (
    <section className="w-full">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r md:leading-normal lg:leading-relaxed from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent">
            Accesos Rápidos
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {displayItems.map((item, index) => (
            <QuickAccessItem
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
              href={item.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;
