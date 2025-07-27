'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { GroupIcon as Organization } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { ClientOrganigrama } from '@/shared/data/dynamic-client';

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
        <DialogHeader className="shrink-0 bg-white/95 backdrop-blur-xs px-3 md:px-6 pt-3 md:pt-6 pb-2 border-b">
          <DialogTitle className="text-[#217A4B] text-lg md:text-2xl">
            Estructura Organizacional del Consejo General de Educación
          </DialogTitle>
        </DialogHeader>
        <div className="grow overflow-hidden">
          <ClientOrganigrama isOpen={isOpen} onOpenChange={setIsOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
