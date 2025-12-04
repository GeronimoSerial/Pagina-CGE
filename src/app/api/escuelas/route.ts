import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      'src/features/escuelas/data/escuelas.json',
    );
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error leyendo escuelas.json:', error);
    return NextResponse.json(
      { error: 'Datos de escuelas no disponibles' },
      { status: 503 },
    );
  }
}

// MIGRATED: Removed export const revalidate = 300 (incompatible with Cache Components)
// Route Handlers are dynamic by default with Cache Components
