import { getCachedSession } from '@/shared/lib/auth/session-utils';

export async function OnlyRole({
  roles,
  children,
}: {
  roles: string[];
  children: React.ReactNode;
}) {
  const session = await getCachedSession();

  if (!session || !roles.includes(session?.user?.role as string)) {
    return (
      <div className="text-center">
        Usted no tiene permiso para acceder a esta página.
      </div>
    );
  }

  return <>{children}</>;
}
