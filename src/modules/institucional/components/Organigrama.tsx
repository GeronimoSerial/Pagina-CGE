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

  const handleViewDetails = (member: MemberInfo) => {
    setSelectedMember(member);
  };

  const handleCloseDetails = () => {
    setSelectedMember(null);
  };

  return (
    <section className="relative h-full w-full">
      {isMobile ? (
        <div className="h-full overflow-y-auto">
          <MobileView members={members} onViewDetails={handleViewDetails} />
        </div>
      ) : (
        <div className="h-full overflow-hidden">
          <OrganizationChart
            members={members}
            onViewDetails={handleViewDetails}
          />
        </div>
      )}

      <MemberDetails member={selectedMember} onClose={handleCloseDetails} />
    </section>
  );
}
