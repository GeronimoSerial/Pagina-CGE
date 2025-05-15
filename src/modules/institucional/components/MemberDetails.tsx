import { Mail, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import Image from "next/image";

// Tipo para la información de cada miembro
export type MemberInfo = {
  id: string;
  name: string;
  position: string;
  department?: string;
  gremio?: string;
  bio?: string;
  email?: string;
  phone?: string;
  imageUrl: string;
  children?: MemberInfo[];
};

// Componente para mostrar detalles del miembro seleccionado
export const MemberDetails = ({
  member,
  onClose,
}: {
  member: MemberInfo | null;
  onClose: () => void;
}) => {
  if (!member) return null;

  return (
    <Dialog open={!!member} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg bg-white rounded-xl shadow-xl p-6 sm:p-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-center text-green-700">
            {member.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-md bg-green-50 flex-shrink-0">
            <Image
              src={member.imageUrl || "/placeholder.svg?height=144&width=144"} // Placeholder ajustado
              alt={member.name}
              className="object-cover w-full h-full"
              width={500}
              height={500}
            />
          </div>
          <div className="text-center sm:text-left flex-grow">
            <p className="text-lg font-semibold text-green-600">
              {member.position}
            </p>
            {member.department && (
              <p className="text-sm text-gray-500">
                {member.gremio || "Estatal"}
              </p>
            )}
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              {member.email && (
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Mail size={18} className="text-green-600 flex-shrink-0" />
                  <a
                    href={`mailto:${member.email}`}
                    className="hover:underline hover:text-green-700"
                  >
                    {member.email}
                  </a>
                </div>
              )}
              {member.phone && (
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Phone size={18} className="text-green-600 flex-shrink-0" />
                  <a
                    href={`tel:${member.phone}`}
                    className="hover:underline hover:text-green-700"
                  >
                    {member.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h5 className="text-md font-semibold text-green-700 mb-1 border-b pb-1 border-green-100">
              Biografía
            </h5>
            <p className="text-sm text-gray-700 leading-relaxed">
              {member.bio || "Información biográfica no disponible."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
