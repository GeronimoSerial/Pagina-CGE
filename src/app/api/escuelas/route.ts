import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    'src/features/escuelas/data/escuelas.json',
  );
  const fileContents = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(fileContents);
  return NextResponse.json(data);
}

// Reducir el tiempo de revalidación a 5 minutos
export const revalidate = 300;
