import { connection } from 'next/server';
import { IncompleteMarksTable } from '@dashboard/components/tables/incomplete-marks-table';
import { DateFilter } from '@dashboard/components/filters/date-filter';
import { getMarcacionesIncompletas } from '@dashboard/actions/actions';
import {
  getArgentinaDate,
  formatDateArg,
  getFirstOfMonthArg,
} from '@dashboard/lib/utils';

// MIGRATED: Using connection() to signal dynamic rendering before Date access

function getDefaultRange() {
  const today = getArgentinaDate();
  const firstOfMonth = getFirstOfMonthArg();
  return {
    start: formatDateArg(firstOfMonth),
    end: formatDateArg(today),
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  // Signal dynamic rendering before accessing current time
  await connection();

  const params = await searchParams;
  const defaults = getDefaultRange();
  const startDate = params?.start ?? defaults.start;
  const endDate = params?.end ?? defaults.end;

  const data = await getMarcacionesIncompletas(startDate, endDate);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">
          Marcaciones Incompletas
        </h1>
      </div>
      <DateFilter defaultStart={defaults.start} defaultEnd={defaults.end} />
      <IncompleteMarksTable data={data} />
    </div>
  );
}
