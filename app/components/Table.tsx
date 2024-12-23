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
  capacity?: number;
}

const Table = ({
  number,
  width = 'w-20 md:w-32',
  height = 'h-16 md:h-24',
  capacity = 4,
}: TableProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div
          className={`bg-gray-200 rounded-md ${width} ${height} flex items-center justify-center hover:bg-gray-400 transition-colors cursor-pointer`}
        >
          <span className='text-white font-bold text-xl md:text-2xl'>
            {number}
          </span>
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
            <p>수용 인원: {capacity}명</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Table;
