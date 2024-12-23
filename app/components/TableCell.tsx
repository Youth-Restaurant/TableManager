interface TableCellProps {
  number: number;
  width?: string;
  height?: string;
}

const TableCell = ({
  number,
  width = 'w-32 md:w-40',
  height = 'h-20 md:h-28',
}: TableCellProps) => {
  return (
    <div
      className={`bg-gray-300 rounded-lg ${width} ${height} flex items-center justify-center`}
    >
      <span className='text-white font-bold text-2xl'>{number}</span>
    </div>
  );
};

export default TableCell;
