import { DailyMarksTable } from "@dashboard/components/daily-marks-table";
import { DateFilter } from "@dashboard/components/date-filter";
import { getMarcacionesDiarias } from "@dashboard/actions/actions";
import {
  getArgentinaDate,
  formatDateArg,
  getFirstOfMonthArg,
} from "@dashboard/lib/utils";

// Marcaciones diarias cambian frecuentemente - cachear por 1 minuto
export const revalidate = 60;

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
  const params = await searchParams;
  const defaults = getDefaultRange();
  const startDate = params?.start ?? defaults.start;
  const endDate = params?.end ?? defaults.end;

  const data = await getMarcacionesDiarias(startDate, endDate);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">
          Marcaciones Diarias
        </h1>
      </div>
      <DateFilter defaultStart={defaults.start} defaultEnd={defaults.end} />
      <DailyMarksTable data={data} />
    </div>
  );
}
