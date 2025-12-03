import Loading from '@/shared/components/Loading';
import { Suspense } from 'react';

// Return placeholder to satisfy Cache Components requirement
// Any legajo value is accepted at runtime
export function generateStaticParams() {
  return [{ legajo: '__placeholder__' }];
}

export default function EmpleadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
