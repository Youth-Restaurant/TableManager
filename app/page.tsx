'use client';

import React from 'react';

const Page = () => {
  return (
    <div className='min-h-screen w-10/12 md:w-full p-4'>
      <div className='container mx-auto h-full'>
        <div className='flex flex-col md:flex-row gap-12 md:gap-24'>
          {/* 1 열: 좌측 홀 */}
          <div className='flex flex-col gap-6 md:gap-12 bg-white'>
            {/* 1 행: 1, 2 */}
            <div className='flex gap-4 md:gap-8 justify-between'>
              <div className='bg-gray-300 rounded-lg h-20 md:h-28 w-32 md:w-40 flex items-center justify-center'>
                <span className='text-white font-bold text-2xl'>1</span>
              </div>
              <div className='bg-gray-300 rounded-lg h-20 md:h-28 w-32 md:w-40 flex items-center justify-center'>
                <span className='text-white font-bold text-2xl'>2</span>
              </div>
            </div>
            {/* 2 행: 3, 4 */}
            <div className='flex gap-4 md:gap-8 justify-between'>
              <div className='bg-gray-300 rounded-lg h-20 md:h-28 w-32 md:w-40 flex items-center justify-center'>
                <span className='text-white font-bold text-2xl'>3</span>
              </div>
              <div className='bg-gray-300 rounded-lg h-20 md:h-28 w-32 md:w-40 flex items-center justify-center'>
                <span className='text-white font-bold text-2xl'>4</span>
              </div>
            </div>
            <div className='invisible'>empty</div>
            {/* 3 행: 5, 6 */}
            <div className='grid justify-items-center gap-1'>
              <div className='bg-gray-300 rounded-lg w-24 md:w-32 h-40 md:h-52 flex items-center justify-center'>
                <span className='text-white font-bold text-2xl'>5</span>
              </div>
              <div className='bg-gray-300 rounded-lg w-24 md:w-32 h-40 md:h-52 flex items-center justify-center'>
                <span className='text-white font-bold text-2xl'>6</span>
              </div>
            </div>
          </div>
          {/* 2 열: 중간 홀 */}
          <div className='grid grid-cols-2 md:grid-cols-2 gap-12 md:gap-24'>
            {/* 1열: 7, 8, 9 */}
            <div className='flex flex-col justify-end gap-4 md:gap-8'>
              <div className='flex gap-1 flex-col'>
                <div className='bg-gray-300 rounded-lg w-24 md:w-32 h-40 md:h-52 flex items-center justify-center'>
                  <span className='text-white font-bold text-2xl'>7</span>
                </div>
                <div className='bg-gray-300 rounded-lg w-24 md:w-32 h-40 md:h-52 flex items-center justify-center'>
                  <span className='text-white font-bold text-2xl'>8</span>
                </div>
              </div>
              <div className='bg-gray-300 rounded-lg w-24 md:w-32 h-40 md:h-52 flex items-center justify-center'>
                <span className='text-white font-bold text-2xl'>9</span>
              </div>
            </div>
            {/* 2열: 10, 11, 12 */}
            <div className='flex flex-col gap-1 justify-end'>
              <div className='bg-gray-300 rounded-lg w-24 md:w-32 h-32 md:h-40 flex items-center justify-center'>
                <span className='text-white font-bold text-2xl'>10</span>
              </div>
              <div className='bg-gray-300 rounded-lg w-24 md:w-32 h-32 md:h-40 flex items-center justify-center'>
                <span className='text-white font-bold text-2xl'>11</span>
              </div>
              <div className='bg-gray-300 rounded-lg w-24 md:w-32 h-32 md:h-40 flex items-center justify-center'>
                <span className='text-white font-bold text-2xl'>12</span>
              </div>
              <div className='bg-gray-300 rounded-lg w-24 md:w-32 h-32 md:h-40 flex items-center justify-center'>
                <span className='text-white font-bold text-2xl'>13</span>
              </div>
            </div>
          </div>
          {/* 3 열: 우측 홀 */}
          <div className='relative md:mt-10'>
            <div className='absolute bottom-20 md:bottom-32 flex gap-2'>
              <div className='bg-gray-300 rounded-lg w-40 md:w-52 h-24 md:h-32 flex items-center justify-center'>
                <span className='text-white font-bold text-2xl'>14</span>
              </div>
              <div className='bg-gray-300 rounded-lg w-40 md:w-52 h-24 md:h-32 flex items-center justify-center'>
                <span className='text-white font-bold text-2xl'>15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
