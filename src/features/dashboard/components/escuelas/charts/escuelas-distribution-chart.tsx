import { getDistribucionZonaModalidad } from '@dashboard/actions/escuelas';
import { EscuelasDistributionChartView } from './escuelas-distribution-chart-view';

export async function EscuelasDistributionChart() {
  const data = await getDistribucionZonaModalidad();

  return <EscuelasDistributionChartView data={data} />;
}
