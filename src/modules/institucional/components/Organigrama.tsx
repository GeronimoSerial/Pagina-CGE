"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, Phone, Building2, Briefcase, MousePointer } from "lucide-react";
import { Tree, TreeNode } from "react-organizational-chart";
import { cn } from "../../../lib/utils";
import { useIsMobile } from "../../../hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";

// Tipo para la información de cada miembro
type MemberInfo = {
  id: string;
  name: string;
  position: string;
  department?: string;
  bio?: string;
  email?: string;
  phone?: string;
  imageUrl: string;
  children?: MemberInfo[];
};

// Datos de los miembros
const members: MemberInfo[] = [
  {
    id: "presidente",
    name: "Prof. María Silvina Rollet",
    position: "Presidente",
    bio: "Líder con más de 15 años de experiencia en el sector educativo. Especialista en gestión institucional y desarrollo de políticas educativas.",
    email: "msrollet@ejemplo.com",
    phone: "+54 11 1234-5678",
    imageUrl: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "secretaria",
    name: "Teresa Proz",
    position: "Secretaria General",
    bio: "Coordinadora de actividades institucionales con amplia experiencia en gestión administrativa y organización de eventos.",
    email: "tproz@ejemplo.com",
    phone: "+54 11 2345-6789",
    imageUrl: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "vocal1",
    name: "German Aranda",
    position: "Vocal",
    department: "Estatal",
    bio: "Especialista en políticas públicas con enfoque en el desarrollo de programas educativos a nivel provincial.",
    email: "garanda@ejemplo.com",
    imageUrl: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "vocal2",
    name: "Maria Esmilce Blanchet",
    position: "Vocal",
    department: "Estatal",
    bio: "Experta en evaluación institucional y desarrollo de proyectos educativos innovadores.",
    email: "mblanchet@ejemplo.com",
    imageUrl: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "vocal3",
    name: "Analia Espindola",
    position: "Vocal",
    department: "Gremial",
    bio: "Representante con amplia trayectoria en defensa de los derechos laborales en el ámbito educativo.",
    email: "aespindola@ejemplo.com",
    imageUrl: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "vocal4",
    name: "Delia Juliana Zacarias",
    position: "Vocal",
    department: "Gremial",
    bio: "Especialista en negociación colectiva y mediación de conflictos laborales en el sector educativo.",
    email: "dzacarias@ejemplo.com",
    imageUrl: "/placeholder.svg?height=150&width=150",
  },
];

// Componente para cada nodo del organigrama
const NodeContent = ({
  member,
  isPresident = false,
  onViewDetails,
}: {
  member: MemberInfo;
  isPresident?: boolean;
  onViewDetails: (member: MemberInfo) => void;
}) => {
  return (
    <div className="flex flex-col items-center">
      <Card
        className={cn(
          "bg-white/95 backdrop-blur-sm rounded-xl border-0 shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1 cursor-pointer group",
          isPresident ? "w-44 sm:w-48" : "w-36 sm:w-40",
          "max-w-full relative overflow-hidden",
          isPresident && "border-2 border-primary"
        )}
        onClick={() => onViewDetails(member)}
      >
        <CardContent className="p-3 space-y-2 relative">
          <div className="flex flex-col items-center gap-2">
            <div className="absolute top-1 right-1">
              <MousePointer
                size={14}
                className="text-[#217A4B]/40 group-hover:text-[#217A4B] transition-colors duration-300"
              />
            </div>

            <div
              className={cn(
                "relative rounded-full overflow-hidden bg-[#217A4B]/10 mt-3",
                isPresident ? "w-14 h-14" : "w-12 h-12"
              )}
            >
              <img
                src={member.imageUrl || "/placeholder.svg?height=64&width=64"}
                alt={member.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-center">
              <h4
                className={cn(
                  "font-semibold text-gray-900 line-clamp-2 text-center",
                  isPresident ? "text-base" : "text-sm"
                )}
              >
                {member.name}
              </h4>
              <p className="text-xs text-[#217A4B] text-center mt-1 font-medium">
                {member.position}
                {member.department && (
                  <span className="block">{member.department}</span>
                )}
              </p>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-[#217A4B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <Popover>
            <PopoverTrigger asChild>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#217A4B]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </PopoverTrigger>
            <PopoverContent className="w-48 text-xs p-2 bg-white/95 backdrop-blur-sm border border-[#217A4B]/20">
              Haz click para ver los detalles
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>
    </div>
  );
};

// Componente para el encabezado de grupo
const GroupHeader = ({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-[#217A4B]/10 p-2 rounded-lg mb-2 w-36 sm:w-40 max-w-full mx-auto backdrop-blur-sm backdrop-filter border border-[#217A4B]/20">
    <h4 className="font-semibold text-center text-[#217A4B] flex items-center justify-center gap-1.5 text-xs sm:text-sm">
      {icon}
      <span>{title}</span>
    </h4>
  </div>
);

// Componente para mostrar detalles del miembro seleccionado
const MemberDetails = ({
  member,
  onClose,
}: {
  member: MemberInfo | null;
  onClose: () => void;
}) => {
  if (!member) return null;

  return (
    <Dialog open={!!member} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#217A4B]">
            {member.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center my-4">
          <div className="relative w-28 h-28 rounded-lg overflow-hidden bg-primary/10 mb-4">
            <img
              src={member.imageUrl || "/placeholder.svg?height=112&width=112"}
              alt={member.name}
              className="object-cover w-full h-full"
            />
          </div>
          <p className="text-[#217A4B] font-medium text-center">
            {member.position}
            {member.department && ` - ${member.department}`}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h5 className="font-bold text-[#217A4B] mb-2">Biografía</h5>
            <p className="text-gray-700">
              {member.bio || "Información no disponible"}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100">
            {member.email && (
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} className="text-[#217A4B] flex-shrink-0" />
                <span className="text-sm">{member.email}</span>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={16} className="text-[#217A4B] flex-shrink-0" />
                <span className="text-sm">{member.phone}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function Organigrama() {
  const [animate, setAnimate] = useState(true);
  const [selectedMember, setSelectedMember] = useState<MemberInfo | null>(null);
  const [chartScale, setChartScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Adjust scale based on screen size
  useEffect(() => {
    const checkSize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setChartScale(0.85);
      } else if (width < 768) {
        setChartScale(0.9);
      } else if (width < 1024) {
        setChartScale(0.95);
      } else {
        setChartScale(1);
      }
    };

    checkSize();
    window.addEventListener("resize", checkSize);

    return () => {
      window.removeEventListener("resize", checkSize);
    };
  }, []);

  // Filtrar miembros por posición
  const presidente = members.find((m) => m.position === "Presidente");
  const secretaria = members.find((m) => m.position === "Secretaria General");
  const vocalesEstatales = members.filter((m) => m.department === "Estatal");
  const vocalesGremiales = members.filter((m) => m.department === "Gremial");

  // Función para reiniciar la animación
  const handleResetAnimation = () => {
    setAnimate(false);
    setTimeout(() => setAnimate(true), 100);
  };

  // Función para mostrar detalles del miembro
  const handleViewDetails = (member: MemberInfo) => {
    setSelectedMember(member);
  };

  // Función para cerrar detalles
  const handleCloseDetails = () => {
    setSelectedMember(null);
  };

  // Drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = "grabbing";
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="py-6 sm:py-12 bg-gradient-to-b from-white to-primary/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <MousePointer className="h-4 w-4 text-primary/70" />
            <span className="text-sm text-gray-500 italic">
              Haz click en las tarjetas para ver detalles
            </span>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className={cn(
            "overflow-x-auto cursor-grab select-none",
            isDragging && "cursor-grabbing"
          )}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1)",
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
        >
          <div className="min-w-full flex justify-center pb-8">
            <div
              className={cn(
                "transition-all duration-500 py-4 px-6",
                animate ? "opacity-100" : "opacity-0"
              )}
              style={{
                transform: `scale(${chartScale})`,
                transformOrigin: "center top",
              }}
            >
              {presidente && (
                <Tree
                  lineWidth="2px"
                  lineColor="#217A4B"
                  lineBorderRadius="10px"
                  nodePadding="16px"
                  label={
                    <NodeContent
                      member={presidente}
                      isPresident={true}
                      onViewDetails={handleViewDetails}
                    />
                  }
                >
                  {secretaria && (
                    <TreeNode
                      label={
                        <NodeContent
                          member={secretaria}
                          onViewDetails={handleViewDetails}
                        />
                      }
                    />
                  )}

                  <TreeNode label="">
                    <TreeNode
                      label={
                        <GroupHeader
                          title="Vocales Estatales"
                          icon={<Building2 size={16} />}
                        />
                      }
                    >
                      {vocalesEstatales.map((vocal) => (
                        <TreeNode
                          key={vocal.id}
                          label={
                            <NodeContent
                              member={vocal}
                              onViewDetails={handleViewDetails}
                            />
                          }
                        />
                      ))}
                    </TreeNode>

                    <TreeNode
                      label={
                        <GroupHeader
                          title="Vocales Gremiales"
                          icon={<Briefcase size={16} />}
                        />
                      }
                    >
                      {vocalesGremiales.map((vocal) => (
                        <TreeNode
                          key={vocal.id}
                          label={
                            <NodeContent
                              member={vocal}
                              onViewDetails={handleViewDetails}
                            />
                          }
                        />
                      ))}
                    </TreeNode>
                  </TreeNode>
                </Tree>
              )}
            </div>
          </div>
        </div>
      </div>

      <MemberDetails member={selectedMember} onClose={handleCloseDetails} />
    </section>
  );
}
