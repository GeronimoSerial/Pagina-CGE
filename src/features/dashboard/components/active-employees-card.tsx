interface ActiveEmployeesCardProps {
  total: number;
}

export function ActiveEmployeesCard({ total }: ActiveEmployeesCardProps) {
  return (
    <div className="rounded-md border p-4">
      <p className="text-sm text-muted-foreground">Empleados activos</p>
      <p className="text-3xl font-semibold">{total}</p>
    </div>
  );
}
