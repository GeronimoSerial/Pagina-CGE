import React from 'react';
import { cn } from '@/shared/lib/utils';
import { Card, CardContent } from '@/shared/ui/card';
import { MemberInfo } from './MemberDetails';

interface NodeContentProps {
  member: MemberInfo;
  isPresident?: boolean;
  onViewDetails: (member: MemberInfo) => void;
}

export const NodeContent = ({
  member,
  isPresident = false,
  onViewDetails,
}: NodeContentProps) => {
  return (
    <div className="flex flex-col items-center">
      <Card
        className={cn(
          'bg-white rounded-lg border border-gray-200 shadow-md transition-all duration-300 transform hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group',
          isPresident ? 'w-56 sm:w-64' : 'w-36 sm:w-40',
          'max-w-full relative overflow-hidden',
          isPresident && 'border-2 border-green-600 shadow-green-500/30',
        )}
        onClick={() => onViewDetails(member)}
        title="Ver detalles"
      >
        <CardContent className="p-4 relative">
          <div className="flex flex-col items-center gap-2">
            <div
              className={cn(
                'relative rounded-full overflow-hidden bg-green-50 mb-2',
                isPresident ? 'w-20 h-20' : 'w-16 h-16',
              )}
            >
              <img
                src={member.imageUrl || '/placeholder.svg?height=80&width=80'}
                alt={member.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="text-center">
              <h4
                className={cn(
                  'text-slate-700 line-clamp-2 text-center',
                  isPresident ? 'text-md font-bold' : 'text-sm font-semibold',
                )}
                style={{ minHeight: '2.5em' }}
              >
                {member.name}
              </h4>
              <p
                className={cn(
                  'text-center mt-0.5 min-h-[2.5em]',
                  isPresident
                    ? 'font-bold text-slate-800 text-sm'
                    : 'text-xs text-green-600',
                )}
              >
                {isPresident ? 'PRESIDENTE' : ''}
                {member.department && (
                  <span className={cn('block', !isPresident && 'font-medium')}>
                    {member.gremio || ''}
                  </span>
                )}
              </p>
              <button className="mt-2 text-xs text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                Ver Detalles
              </button>
            </div>
          </div>

          <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );
};
