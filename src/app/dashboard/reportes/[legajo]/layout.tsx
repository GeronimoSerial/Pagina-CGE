import { Suspense } from 'react';
import { Skeleton } from '@/shared/ui/skeleton';

function LoadingFallback() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-[500px] w-full" />
    </div>
  );
}

// Return placeholder to satisfy Cache Components requirement
// Any legajo value is accepted at runtime
export function generateStaticParams() {
  return [{ legajo: '__placeholder__' }];
}

export default function ReporteEmpleadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}
