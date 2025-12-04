import { getEstadisticasDiarias } from '@dashboard/actions/actions';
import { AttendanceChartView } from './attendance-chart-view';

interface AttendanceChartProps {
  startDate: string;
  endDate: string;
}

export async function AttendanceChart({
  startDate,
  endDate,
}: AttendanceChartProps) {
  const estadisticasDiarias = await getEstadisticasDiarias(startDate, endDate);

  return <AttendanceChartView data={estadisticasDiarias} />;
}
