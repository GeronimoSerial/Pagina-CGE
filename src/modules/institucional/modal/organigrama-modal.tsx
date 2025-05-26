"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { GroupIcon as Organization } from "lucide-react";
import { Button } from "@components/ui/button";
import { ClientOrganigrama } from "@components/data/dynamic-client";

export function OrganigramaModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-[#217A4B] text-white hover:bg-[#1A5D3A] transition-colors py-3 px-6 rounded-lg font-semibold shadow-md hover:shadow-lg">
          <Organization size={18} />
          Ver estructura organizacional
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] w-full md:w-[90vw] lg:w-[1200px] h-[85vh] md:h-[90vh] p-0 flex flex-col">
        <DialogHeader className="flex-shrink-0 bg-white/95 backdrop-blur-sm px-3 md:px-6 pt-3 md:pt-6 pb-2 border-b">
          <DialogTitle className="text-[#217A4B] text-lg md:text-2xl">
            Estructura Organizacional del Consejo General de Educación
          </DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-hidden">
          <ClientOrganigrama isOpen={isOpen} onOpenChange={setIsOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
