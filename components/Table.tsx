'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getTableData } from '@/mocks/mockTables';
import { TableStatus } from '@/types/table';

interface TableProps {
  number: number;
  width?: string;
  height?: string;
}

const getTableStatus = (tableId: number): TableStatus => {
  const tableData = getTableData(tableId);
  if (!tableData) return 'empty';

  if (tableData.isReserved) return 'reserved';
  if (tableData.currentUsers > 0) return 'in-use';
  return 'empty';
};

const formatDate = (date: Date | null): string => {
  if (!date) return '-';
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const Table = ({
  number,
  width = 'w-20 md:w-32',
  height = 'h-16 md:h-24',
}: TableProps) => {
  const tableData = getTableData(number);
  const status = getTableStatus(number);

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
            <p>
              현재 상태:{' '}
              {status === 'empty'
                ? '비어있음'
                : status === 'in-use'
                ? '사용 중'
                : '예약됨'}
            </p>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <p>수용 인원: {tableData?.capacity}명</p>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <p>사용 중인 인원: {tableData?.currentUsers}명</p>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <p>가격: {tableData?.price.toLocaleString()}원</p>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <p>메뉴: {tableData?.menu}</p>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <p>방문 시간: {formatDate(tableData?.visitTime || null)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Table;
