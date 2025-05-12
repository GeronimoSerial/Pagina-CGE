import { Mail, Phone } from "lucide-react";
import { MemberInfo } from "../../data/OrganigramaData";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import { cn } from "../../../../lib/utils";

interface MobileViewProps {
  members: MemberInfo[];
  onViewDetails: (member: MemberInfo) => void;
}

export const MobileView = ({ members, onViewDetails }: MobileViewProps) => {
  // Agrupar por tipos
  const presidente = members.find((m) => m.position === "Presidente");
  const secretaria = members.find((m) => m.position === "Secretaria General");
  const vocalesEstatales = members.filter((m) => m.department === "Estatal");
  const vocalesGremiales = members.filter((m) => m.department === "Gremial");

  return (
    <section>
      {/* Presidente */}
      {presidente && (
        <Card className="border-primary/30 shadow-sm">
          <CardContent className="p-4">
            <MobileCardContent
              member={presidente}
              isPresident={true}
              onViewDetails={onViewDetails}
            />
          </CardContent>
        </Card>
      )}

      {/* Secretaria */}

      {/* Vocales por categoría */}
      <Accordion type="single" collapsible className="w-full">
        {/* Secretaria General */}
        {secretaria && (
          <AccordionItem value="Secretaría" className="border-primary/10">
            <AccordionTrigger className="py-3 text-primary font-medium">
              Secretaría General
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                <Card key={secretaria.id} className="border-primary/10">
                  <CardContent className="p-3">
                    <MobileCardContent
                      member={secretaria}
                      onViewDetails={onViewDetails}
                    />
                  </CardContent>
                </Card>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
        {/* Vocales Estatales */}
        {vocalesEstatales.length > 0 && (
          <AccordionItem value="estatales" className="border-primary/10">
            <AccordionTrigger className="py-3 text-primary font-medium">
              Vocales Estatales
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {vocalesEstatales.map((vocal) => (
                  <Card key={vocal.id} className="border-primary/10">
                    <CardContent className="p-3">
                      <MobileCardContent
                        member={vocal}
                        onViewDetails={onViewDetails}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Vocales Gremiales */}
        {vocalesGremiales.length > 0 && (
          <AccordionItem value="gremiales" className="border-primary/10">
            <AccordionTrigger className="py-3 text-primary font-medium">
              Vocales Gremiales
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {vocalesGremiales.map((vocal) => (
                  <Card key={vocal.id} className="border-primary/10">
                    <CardContent className="p-3">
                      <MobileCardContent
                        member={vocal}
                        onViewDetails={onViewDetails}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </section>
    // </div>
  );
};

// Componente para tarjeta mobile
const MobileCardContent = ({
  member,
  isPresident = false,
  onViewDetails,
}: {
  member: MemberInfo;
  isPresident?: boolean;
  onViewDetails: (member: MemberInfo) => void;
}) => {
  return (
    <div className="flex items-center space-x-3">
      <div
        className={cn(
          "relative rounded-full overflow-hidden bg-primary/10 flex-shrink-0",
          isPresident ? "w-14 h-14" : "w-12 h-12"
        )}
      >
        <img
          src={member.imageUrl || "/placeholder.svg?height=48&width=48"}
          alt={member.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-grow">
        <h4
          className={cn(
            "font-medium text-gray-800",
            isPresident ? "text-base" : "text-sm"
          )}
        >
          {member.name}
        </h4>
        <p className="text-xs text-primary">
          {member.position}
          {member.department && (
            <span className="ml-1">- {member.department}</span>
          )}
        </p>
        <div className="mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(member)}
            className="h-7 px-2 text-xs text-primary hover:bg-primary/10"
          >
            Ver detalles
          </Button>
        </div>
      </div>
    </div>
  );
};
