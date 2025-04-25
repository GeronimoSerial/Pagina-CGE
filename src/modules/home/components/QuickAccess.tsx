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
    <a href={href} className="block group">
      <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 bg-white">
        <CardContent className="flex flex-col items-center text-center p-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary mb-3 mt-3 group-hover:bg-primary group-hover:text-white transition-colors">
            {icon}
          </div>
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
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
    <section className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Accesos Rápidos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
