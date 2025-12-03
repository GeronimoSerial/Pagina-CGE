import { getDiasSinActividad } from '@dashboard/actions/actions';
import { DaysListView } from './days-list-view';

interface DaysWithoutActivityProps {
  startDate: string;
  endDate: string;
}

export async function DaysWithoutActivity({
  startDate,
  endDate,
}: DaysWithoutActivityProps) {
  const diasSinActividad = await getDiasSinActividad(startDate, endDate);
  const diasSinActividadList = diasSinActividad.map((item) => item.dia);

  return (
    <DaysListView
      title="Días sin actividad (este mes)"
      days={diasSinActividadList}
    />
  );
}
