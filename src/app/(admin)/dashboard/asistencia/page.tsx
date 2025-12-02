import { connection } from 'next/server';
import { AttendanceTable } from '@dashboard/components/attendance-table';
import { DateFilter } from '@dashboard/components/date-filter';
import { getAsistenciaDiaria } from '@dashboard/actions/actions';

// MIGRATED: Using connection() to signal dynamic rendering before Date access

function getDefaultRange() {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  return {
    start: firstOfMonth.toISOString().slice(0, 10),
    end: today.toISOString().slice(0, 10),
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

  const data = await getAsistenciaDiaria(startDate, endDate);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Asistencia Diaria</h1>
      </div>
      <DateFilter defaultStart={defaults.start} defaultEnd={defaults.end} />
      <AttendanceTable data={data} />
    </div>
  );
}
