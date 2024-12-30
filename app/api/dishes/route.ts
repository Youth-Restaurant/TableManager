import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { sideArr } = await req.json();
  return NextResponse.json({ message: 'Dishes submitted' });
}
