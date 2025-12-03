import { getDiasConMarca } from '@dashboard/actions/actions';
import { DaysListView } from './days-list-view';

interface DaysWithActivityProps {
  startDate: string;
  endDate: string;
}

export async function DaysWithActivity({
  startDate,
  endDate,
}: DaysWithActivityProps) {
  const diasConMarca = await getDiasConMarca(startDate, endDate);
  const diasConMarcaList = diasConMarca.map((item) => item.dia);

  return (
    <DaysListView title="Días con marca (este mes)" days={diasConMarcaList} />
  );
}
