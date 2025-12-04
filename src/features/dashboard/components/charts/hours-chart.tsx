import { getPromedioHorasDiario } from '@dashboard/actions/actions';
import { HoursChartView } from './hours-chart-view';

interface HoursChartProps {
  startDate: string;
  endDate: string;
}

export async function HoursChart({ startDate, endDate }: HoursChartProps) {
  const promedioHoras = await getPromedioHorasDiario(startDate, endDate);

  return <HoursChartView data={promedioHoras} />;
}
