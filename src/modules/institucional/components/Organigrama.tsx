"use client";

import { useState, useEffect } from "react";
import { useIsMobile } from "@hooks/use-mobile";
import { members } from "../data/OrganigramaData";
import { MemberInfo, MemberDetails } from "./MemberDetails";
import { OrganizationChart } from "./Organigrama/DesktopView";
import { MobileView } from "./Organigrama/MobileView";

interface OrganigramaProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function Organigrama({}: OrganigramaProps) {
  const [selectedMember, setSelectedMember] = useState<MemberInfo | null>(null);
  const isMobile = useIsMobile();

  // Función para mostrar detalles del miembro
  const handleViewDetails = (member: MemberInfo) => {
    setSelectedMember(member);
  };

  // Función para cerrar detalles
  const handleCloseDetails = () => {
    setSelectedMember(null);
  };

  return (
    <section className="h-[calc(100vh-4rem)] overflow-hidden">
      {isMobile ? (
        <div
          className="h-full overflow-y-auto flex-grow pb-20"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="px-4">
            <MobileView members={members} onViewDetails={handleViewDetails} />
          </div>
        </div>
      ) : (
        <div className="flex-grow overflow-hidden">
          <OrganizationChart
            members={members}
            onViewDetails={handleViewDetails}
          />
        </div>
      )}

      {/* Componente para mostrar los detalles del miembro */}
      <MemberDetails member={selectedMember} onClose={handleCloseDetails} />
    </section>
  );
}
