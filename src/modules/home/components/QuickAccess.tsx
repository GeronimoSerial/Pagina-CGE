import React from "react";
import { Card, CardContent} from "../../../components/ui/card"
import { FileText, School, Calendar, Phone } from "lucide-react";

interface QuickAccessItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const QuickAccessItem = ({
  icon,
  title,
  description,
  href = "#",
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
          <p className="text-sm text-gray-700 font-medium">
            {description}
          </p>
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
      title: "Trámites",
      description: "Gestione sus trámites administrativos",
      href: "/tramites",
    },
    {
      icon: <School size={24} />,
      title: "Niveles educativos",
      description: "Información sobre los niveles educativos",
      href: "/niveles",
    },
    {
      icon: <Calendar size={24} />,
      title: "Calendario escolar",
      description: "Consulte el calendario escolar vigente",
      href: "/calendario",
    },
    {
      icon: <Phone size={24} />,
      title: "Contacto",
      description: "Comuníquese con nosotros",
      href: "/contacto",
    },
  ];

  const displayItems = items.length > 0 ? items : defaultItems;

  return (
    <section className="w-full py-12">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl font-extrabold text-center mb-10 tracking-tight drop-shadow-sm">
          Accesos Rápidos
        </h2>
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
