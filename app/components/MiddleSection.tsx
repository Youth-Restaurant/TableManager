import TableCell from './TableCell';

const MiddleSection = () => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-2 gap-12 md:gap-24'>
      <div className='flex flex-col justify-end gap-4 md:gap-8'>
        <div className='flex gap-1 flex-col'>
          <TableCell number={7} width='w-24 md:w-32' height='h-40 md:h-52' />
          <TableCell number={8} width='w-24 md:w-32' height='h-40 md:h-52' />
        </div>
        <TableCell number={9} width='w-24 md:w-32' height='h-40 md:h-52' />
      </div>
      <div className='flex flex-col gap-1 justify-end'>
        {[10, 11, 12, 13].map((num) => (
          <TableCell
            key={num}
            number={num}
            width='w-24 md:w-32'
            height='h-32 md:h-40'
          />
        ))}
      </div>
    </div>
  );
};

export default MiddleSection;
