import { auth } from '@/shared/lib/auth/auth';
import { headers } from 'next/headers';

export const getCachedSession = async () => {
  return await auth.api.getSession({ headers: await headers() });
};
