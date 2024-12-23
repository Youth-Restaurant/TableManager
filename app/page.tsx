'use client';

import React from 'react';
import LeftSection from './components/LeftSection';
import MiddleSection from './components/MiddleSection';
import RightSection from './components/RightSection';

const Page = () => {
  return (
    <div className='min-h-screen w-10/12 md:w-full p-4'>
      <div className='container mx-auto h-full'>
        <div className='flex flex-col md:flex-row gap-12 md:gap-24'>
          <LeftSection />
          <MiddleSection />
          <RightSection />
        </div>
      </div>
    </div>
  );
};

export default Page;
