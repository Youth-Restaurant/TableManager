import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { selectedSideDishes } = await req.json();
  console.log('selectedSideDishes', selectedSideDishes);
  return NextResponse.json({ message: 'Dishes submitted' });
}
