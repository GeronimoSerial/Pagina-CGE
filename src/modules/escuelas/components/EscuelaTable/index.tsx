import React, { useCallback, memo } from 'react';
import type { Escuela } from '@/src/interfaces';
import { MobileView } from './MobileView';
import { DesktopView } from './DesktopView';

interface EscuelasTableProps {
  escuelas: Escuela[];
  onSelectEscuela: (escuela: Escuela) => void;
}

const EscuelasTable = memo(({ escuelas, onSelectEscuela }: EscuelasTableProps) => {
  const handleClick = useCallback(
    (escuela: Escuela) => {
      onSelectEscuela(escuela);
    },
    [onSelectEscuela]
  );

  return (
    <>
      <MobileView escuelas={escuelas} onSelectEscuela={handleClick} />
      <DesktopView escuelas={escuelas} onSelectEscuela={handleClick} />
    </>
  );
});

EscuelasTable.displayName = 'EscuelasTable';

export default EscuelasTable;