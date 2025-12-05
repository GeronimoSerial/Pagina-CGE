import { getDistribucionProblematicas } from '../../actions/escuelas';
import { DistribucionProblematicasChartClient } from './distribucion-problematicas-chart-client';

export async function DistribucionProblematicasChart({}) {
  const data = await getDistribucionProblematicas();

  if (!data || data.length === 0) return null;

  return <DistribucionProblematicasChartClient data={data} />;
}
