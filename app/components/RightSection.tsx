import TableCell from './TableCell';

const RightSection = () => {
  return (
    <div className='relative md:mt-10'>
      <div className='absolute bottom-20 md:bottom-32 flex gap-2'>
        <TableCell number={14} width='w-40 md:w-52' height='h-24 md:h-32' />
        <TableCell number={15} width='w-40 md:w-52' height='h-24 md:h-32' />
      </div>
    </div>
  );
};

export default RightSection;
