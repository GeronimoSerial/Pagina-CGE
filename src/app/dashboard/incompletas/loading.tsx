import { Skeleton } from '@/shared/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
      </div>
      <Skeleton className="h-10 w-full max-w-md" />
      <Skeleton className="h-[500px] w-full" />
    </div>
  );
}
