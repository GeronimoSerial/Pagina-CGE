import React, { useCallback, memo } from 'react';
import type { School } from '@/shared/interfaces';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';

interface EscuelasTableProps {
  escuelas: School[];
  onSelectEscuela: (escuela: School) => void;
}

const EscuelasTable = memo(
  ({ escuelas, onSelectEscuela }: EscuelasTableProps) => {
    const handleClick = useCallback(
      (escuela: School) => {
        onSelectEscuela(escuela);
      },
      [onSelectEscuela],
    );

    return (
      <>
        <MobileView escuelas={escuelas} onSelectEscuela={handleClick} />
        <DesktopView escuelas={escuelas} onSelectEscuela={handleClick} />
      </>
    );
  },
);

EscuelasTable.displayName = 'EscuelasTable';

export default EscuelasTable;
