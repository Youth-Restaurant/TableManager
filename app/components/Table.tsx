'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TableProps {
  number: number;
  width?: string;
  height?: string;
}

const Table = ({
  number,
  width = 'w-32 md:w-40',
  height = 'h-20 md:h-28',
}: TableProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div
          className={`bg-gray-200 rounded-md ${width} ${height} flex items-center justify-center hover:bg-gray-400 transition-colors cursor-pointer`}
        >
          <span className='text-white font-bold text-2xl'>{number}</span>
        </div>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] bg-white'>
        <DialogHeader>
          <DialogTitle>테이블 {number}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <p>현재 상태: 비어있음</p>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <p>수용 인원: 4명</p>
          </div>
          {/* 추가적인 테이블 정보를 여기에 표시할 수 있습니다 */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Table;
