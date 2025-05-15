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
      <DialogContent className="max-w-[95vw] w-[1200px] max-h-[90vh] h-[800px] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-[#217A4B] text-2xl">
            Estructura Organizacional del Consejo General de Educación
          </DialogTitle>
        </DialogHeader>
        <div className="h-full overflow-hidden scrollbar-hide">
          <ClientOrganigrama isOpen={isOpen} onOpenChange={setIsOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
