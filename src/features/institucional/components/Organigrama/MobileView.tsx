import { Mail, Briefcase, Building2 } from 'lucide-react';
import { MemberInfo } from '@/features/institucional/data/OrganigramaData';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { cn } from '@/shared/lib/utils';

interface MobileViewProps {
  members: MemberInfo[];
  onViewDetails: (member: MemberInfo) => void;
}

export const MobileView = ({ members, onViewDetails }: MobileViewProps) => {
  const presidente = members.find((m) => m.position === 'Presidente');
  const secretaria = members.find((m) => m.position === 'Secretaria General');
  const vocalesEstatales = members.filter((m) => m.department === 'Estatal');
  const vocalesGremiales = members.filter((m) => m.department === 'Gremial');

  return (
    <section className="max-w-2xl mx-auto space-y-3 px-3 pb-4">
      {/* Presidente */}
      {presidente && (
        <Card className="border-primary/30 shadow-md bg-linear-to-br from-green-50 to-white hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4">
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
        className="w-full space-y-2"
        defaultValue="Secretaría"
      >
        {/* Secretaria General */}
        {secretaria && (
          <AccordionItem
            value="Secretaría"
            className="border-primary/10 bg-white rounded-lg shadow-xs"
          >
            <AccordionTrigger className="py-3 px-4 text-primary font-medium hover:bg-green-50/50 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Secretaría General</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="space-y-3 pt-2">
                <Card className="border-primary/10 hover:shadow-md transition-shadow">
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
          <AccordionItem
            value="estatales"
            className="border-primary/10 bg-white rounded-lg shadow-xs"
          >
            <AccordionTrigger className="py-3 px-4 text-primary font-medium hover:bg-green-50/50 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>Vocales Estatales</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="space-y-3 pt-2">
                {vocalesEstatales.map((vocal) => (
                  <Card
                    key={vocal.id}
                    className="border-primary/10 hover:shadow-md transition-shadow"
                  >
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
          <AccordionItem
            value="gremiales"
            className="border-primary/10 bg-white rounded-lg shadow-xs"
          >
            <AccordionTrigger className="py-3 px-4 text-primary font-medium hover:bg-green-50/50 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>Vocales Gremiales</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="space-y-3 pt-2">
                {vocalesGremiales.map((vocal) => (
                  <Card
                    key={vocal.id}
                    className="border-primary/10 hover:shadow-md transition-shadow"
                  >
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
    <div
      className={cn(
        'flex items-start gap-3',
        isPresident && 'flex-col items-center text-center',
      )}
    >
      <div
        className={cn(
          'relative rounded-full overflow-hidden bg-primary/10 shrink-0 ring-2 ring-primary/20 ring-offset-1',
          isPresident ? 'w-20 h-20' : 'w-14 h-14',
        )}
      >
        <img
          src={member.imageUrl || '/placeholder.svg?height=48&width=48'}
          alt={member.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div
        className={cn(
          'grow min-w-0',
          isPresident && 'flex flex-col items-center',
        )}
      >
        <h4
          className={cn(
            'font-medium text-gray-800 truncate',
            isPresident ? 'text-lg' : 'text-base',
          )}
        >
          {member.name}
        </h4>
        <p
          className={cn(
            'text-primary/80 font-medium truncate',
            isPresident ? 'text-sm' : 'text-xs',
          )}
        >
          {member.position}
          {member.department && (
            <span className="ml-1 text-primary/60">
              - <b>{member.gremio || 'Estatal'}</b>
            </span>
          )}
        </p>
        {member.email && (
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 truncate">
            <Mail className="w-3 h-3 shrink-0" />
            <span className="truncate">{member.email}</span>
          </p>
        )}
        <div className="mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(member)}
            className={cn(
              'h-7 px-3 text-xs font-medium text-primary hover:bg-primary/10 transition-colors',
              isPresident && 'w-full mt-1',
            )}
          >
            Ver detalles
          </Button>
        </div>
      </div>
    </div>
  );
};
