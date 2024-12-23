import TableCell from './TableCell';

const LeftSection = () => {
  return (
    <div className='flex flex-col gap-6 md:gap-12 bg-white'>
      <div className='flex gap-4 md:gap-8 justify-between'>
        <TableCell number={1} />
        <TableCell number={2} />
      </div>
      <div className='flex gap-4 md:gap-8 justify-between'>
        <TableCell number={3} />
        <TableCell number={4} />
      </div>
      <div className='invisible'>empty</div>
      <div className='grid justify-items-center gap-1'>
        <TableCell number={5} width='w-24 md:w-32' height='h-40 md:h-52' />
        <TableCell number={6} width='w-24 md:w-32' height='h-40 md:h-52' />
      </div>
    </div>
  );
};

export default LeftSection;
