'use client';

import LeftSection from '@/components/LeftSection';
import MiddleSection from '@/components/MiddleSection';
import RightSection from '@/components/RightSection';

const handleTableUpdate = (tableNumber: number, updatedData: any) => {
  // 여기에서 테이블 데이터 업데이트 로직 구현
  console.log(`Table ${tableNumber} updated:`, updatedData);
};

const Page = () => {
  return (
    <main className='min-h-screen w-11/12 md:w-full p-4'>
      <div className='container mx-auto h-full'>
        <div className='flex flex-col md:flex-row gap-8 md:gap-16'>
          <LeftSection />
          <MiddleSection />
          <RightSection />
        </div>
      </div>
    </main>
  );
};

export default Page;
