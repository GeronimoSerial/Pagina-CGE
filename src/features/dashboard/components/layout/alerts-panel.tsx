import { getAlertsSummary } from '@dashboard/actions/actions';
import { AlertsSummary } from '@dashboard/components/layout/alerts-summary';

export async function AlertsPanel() {
  const alerts = await getAlertsSummary();

  const alertItems = [
    ...(alerts.absentes > 0
      ? [
          {
            label: 'Ausentes',
            count: alerts.absentes,
            href: '/dashboard/ausentes',
            severity: 'critical' as const,
          },
        ]
      : []),
    ...(alerts.incompletas > 0
      ? [
          {
            label: 'Incompletas',
            count: alerts.incompletas,
            href: '/dashboard/incompletas',
            severity: 'warning' as const,
          },
        ]
      : []),
    ...(alerts.problematicos > 0
      ? [
          {
            label: 'Empleados Problemáticos',
            count: alerts.problematicos,
            href: '/dashboard/auditoria',
            severity: 'warning' as const,
          },
        ]
      : []),
  ];

  return <AlertsSummary alerts={alertItems} />;
}
