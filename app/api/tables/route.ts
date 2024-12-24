import { NextResponse } from 'next/server';

export async function PUT() {
  return NextResponse.json({ success: true });
  //   try {
  //     const data = await request.json();
  //     // 여기에 데이터베이스 저장 로직 구현
  //     // 예: await db.table.update({ where: { number: data.number }, data });
  //     return NextResponse.json({ success: true });
  //   } catch (error) {
  //     return NextResponse.json(
  //       { error: 'Failed to update table' },
  //       { status: 500 }
  //     );
  //   }
}
