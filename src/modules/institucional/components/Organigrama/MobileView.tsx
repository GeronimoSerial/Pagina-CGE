import { Mail, Briefcase, Building2 } from "lucide-react";
import { MemberInfo } from "@modules/institucional/data/OrganigramaData";
import { Card, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import { cn } from "@lib/utils";

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
    <section className="max-w-2xl mx-auto space-y-6 p-4">
      {/* Presidente */}
      {presidente && (
        <Card className="border-primary/30 shadow-md bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="text-center mb-3">
              <span className="text-xs font-medium text-primary/70 uppercase tracking-wider bg-primary/5 px-3 py-1 rounded-full">
                Presidente
              </span>
            </div>
            <MobileCardContent
              member={presidente}
              isPresident={true}
              onViewDetails={onViewDetails}
            />
          </CardContent>
        </Card>
      )}

      {/* Vocales por categoría */}
      <Accordion
        type="single"
        collapsible
        className="w-full space-y-4 pb-6"
        defaultValue="Secretaría"
      >
        {/* Secretaria General */}
        {secretaria && (
          <AccordionItem
            value="Secretaría"
            className="border-primary/10 bg-white rounded-lg shadow-sm"
          >
            <AccordionTrigger className="py-4 px-4 text-primary font-medium hover:bg-green-50/50 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Secretaría General</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-3 pt-2">
                <Card
                  key={secretaria.id}
                  className="border-primary/10 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
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
          <AccordionItem
            value="estatales"
            className="border-primary/10 bg-white rounded-lg shadow-sm"
          >
            <AccordionTrigger className="py-4 px-4 text-primary font-medium hover:bg-green-50/50 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>Vocales Estatales</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                {vocalesEstatales.map((vocal) => (
                  <Card
                    key={vocal.id}
                    className="border-primary/10 hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
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
          <AccordionItem
            value="gremiales"
            className="border-primary/10 bg-white rounded-lg shadow-sm"
          >
            <AccordionTrigger className="py-4 px-4 text-primary font-medium hover:bg-green-50/50 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>Vocales Gremiales</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2">
                {vocalesGremiales.map((vocal) => (
                  <Card
                    key={vocal.id}
                    className="border-primary/10 hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
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
    <div
      className={cn(
        "flex items-center gap-4",
        isPresident && "flex-col text-center"
      )}
    >
      <div
        className={cn(
          "relative rounded-full overflow-hidden bg-primary/10 flex-shrink-0 ring-2 ring-primary/20 ring-offset-2",
          isPresident ? "w-24 h-24" : "w-16 h-16"
        )}
      >
        <img
          src={member.imageUrl || "/placeholder.svg?height=48&width=48"}
          alt={member.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div
        className={cn("flex-grow", isPresident && "flex flex-col items-center")}
      >
        <h4
          className={cn(
            "font-medium text-gray-800",
            isPresident ? "text-lg" : "text-base"
          )}
        >
          {member.name}
        </h4>
        <p
          className={cn(
            "text-sm text-primary/80 font-medium",
            !isPresident && "text-xs"
          )}
        >
          {member.position}
          {member.department && (
            <span className="ml-1 text-primary/60">
              - <b>{member.gremio || "Estatal"}</b>
            </span>
          )}
        </p>
        {member.email && (
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Mail className="w-3 h-3" /> {member.email}
          </p>
        )}
        <div className="mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(member)}
            className={cn(
              "h-8 px-4 text-xs font-medium text-primary hover:bg-primary/10 transition-colors",
              isPresident && "w-full"
            )}
          >
            Ver detalles
          </Button>
        </div>
      </div>
    </div>
  );
};
