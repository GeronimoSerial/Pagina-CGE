import { AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/ui/button';

interface AlertItem {
  label: string;
  count: number;
  href: string;
  severity: 'critical' | 'warning' | 'info';
  icon?: React.ReactNode;
}

interface AlertsSummaryProps {
  alerts: AlertItem[];
}

export function AlertsSummary({ alerts }: AlertsSummaryProps) {
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical');
  const warningAlerts = alerts.filter((a) => a.severity === 'warning');

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-2 pb-4">
        <AlertCircle className="h-5 w-5" />
        <h3 className="font-semibold">Novedades y Alertas</h3>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="mb-2 h-8 w-8 text-green-500" />
            <p className="text-sm font-medium">¡Todo al día!</p>
            <p className="text-xs text-muted-foreground">No hay alertas pendientes</p>
          </div>
        ) : (
          <>
            {criticalAlerts.length > 0 && (
              <div className="border-l-4 border-red-500 bg-red-50 p-3">
                <p className="text-xs font-semibold text-red-900">
                  {criticalAlerts.length > 1
                    ? `${criticalAlerts.length} alertas críticas`
                    : `${criticalAlerts[0].count} ${criticalAlerts[0].label.toLowerCase()}`}
                </p>
              </div>
            )}

            {warningAlerts.length > 0 && (
              <div className="border-l-4 border-yellow-500 bg-yellow-50 p-3">
                <p className="text-xs font-semibold text-yellow-900">
                  {warningAlerts.length > 1
                    ? `${warningAlerts.length} alertas`
                    : `${warningAlerts[0].count} ${warningAlerts[0].label.toLowerCase()}`}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {criticalAlerts.map((alert) => (
                <Button
                  key={alert.href}
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Link href={alert.href}>
                    Ver {alert.label} ({alert.count})
                  </Link>
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
