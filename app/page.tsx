'use client';

import React from 'react';

const Page = () => {
  return (
    <div className='min-h-screen w-10/12 md:w-full p-4'>
      <div className='container mx-auto h-full'>
        <div className='flex gap-24'>
          {/* 1 열: 좌측 홀 */}
          <div className='flex flex-col gap-12 bg-white'>
            {/* 1 행: 1, 2 */}
            <div className='flex gap-8 justify-between'>
              <div className='bg-gray-300 rounded-lg h-28 w-40'>1</div>
              <div className='bg-gray-300 rounded-lg h-28 w-40'>2</div>
            </div>
            {/* 2 행: 3, 4 */}
            <div className='flex gap-8 justify-between'>
              <div className='bg-gray-300 rounded-lg h-28 w-40'>3</div>
              <div className='bg-gray-300 rounded-lg h-28 w-40'>4</div>
            </div>
            <div className='invisible'>empty</div>
            {/* 3 행: 5, 6 */}
            <div className='grid justify-items-center gap-1'>
              <div className='bg-gray-300 rounded-lg w-32 h-52'>5</div>
              <div className='bg-gray-300 rounded-lg w-32 h-52'>6</div>
            </div>
          </div>
          {/* 2 열: 중간 홀 */}
          <div className='grid grid-cols-2 gap-24'>
            {/* 1열: 7, 8, 9 */}
            <div className='flex flex-col justify-end gap-8'>
              <div className='flex gap-1 flex-col'>
                <div className='bg-gray-300 rounded-lg w-32 h-52'>7</div>
                <div className='bg-gray-300 rounded-lg w-32 h-52'>8</div>
              </div>
              <div className='bg-gray-300 rounded-lg w-32 h-52'>9</div>
            </div>
            {/* 2열: 10, 11, 12 */}
            <div className='flex flex-col gap-1 justify-end'>
              <div className='bg-gray-300 rounded-lg w-32 h-40'>10</div>
              <div className='bg-gray-300 rounded-lg w-32 h-40'>11</div>
              <div className='bg-gray-300 rounded-lg w-32 h-40'>12</div>
              <div className='bg-gray-300 rounded-lg w-32 h-40'>13</div>
            </div>
          </div>
          {/* 3 열: 우측 홀 */}
          <div className='relative'>
            <div className='absolute bottom-32 flex gap-2'>
              <div className='bg-gray-300 rounded-lg w-52 h-32'>14</div>
              <div className='bg-gray-300 rounded-lg w-52 h-32'>15</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
