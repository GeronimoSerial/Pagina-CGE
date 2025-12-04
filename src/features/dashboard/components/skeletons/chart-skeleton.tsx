'use client';

import { Skeleton } from '@/shared/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';

interface ChartSkeletonProps {
  height?: number;
  showHeader?: boolean;
}

export function ChartSkeleton({
  height = 300,
  showHeader = true,
}: ChartSkeletonProps) {
  return (
    <Card>
      {showHeader && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <Skeleton className="h-5 w-[160px]" />
            <Skeleton className="h-3 w-[200px]" />
          </div>
          <Skeleton className="h-9 w-[100px]" />
        </CardHeader>
      )}
      <CardContent>
        <div
          className="flex items-end justify-between gap-2 px-2"
          style={{ height: `${height}px` }}
        >
          {/* Simulated bar chart */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <Skeleton
                className="w-full rounded-t"
                style={{
                  height: `${Math.random() * 60 + 40}%`,
                }}
              />
              <Skeleton className="h-3 w-6" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function LineChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <Skeleton className="h-5 w-[140px]" />
          <Skeleton className="h-3 w-[180px]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ height: `${height}px` }}>
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-8" />
            ))}
          </div>

          {/* Chart area */}
          <div className="ml-12 h-full flex items-center justify-center">
            <Skeleton className="w-full h-3/4 rounded-lg" />
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-12 right-0 flex justify-between">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-10" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DonutChartSkeleton({ size = 200 }: { size?: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-[140px]" />
        <Skeleton className="h-3 w-[100px]" />
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <Skeleton
          className="rounded-full"
          style={{ width: size, height: size }}
        />
      </CardContent>
    </Card>
  );
}
