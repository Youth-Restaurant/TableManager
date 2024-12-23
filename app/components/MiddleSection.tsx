import Table from './Table';

const MiddleSection = () => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-2 gap-8 md:gap-16'>
      <div className='flex flex-col justify-end gap-2 md:gap-6'>
        <div className='flex gap-1 flex-col'>
          <Table number={7} width='w-16 md:w-28' height='h-28 md:h-40' />
          <Table number={8} width='w-16 md:w-28' height='h-28 md:h-40' />
        </div>
        <Table number={9} width='w-16 md:w-28' height='h-28 md:h-40' />
      </div>
      <div className='flex flex-col gap-1 justify-end'>
        {[10, 11, 12, 13].map((num) => (
          <Table
            key={num}
            number={num}
            width='w-16 md:w-28'
            height='h-24 md:h-32'
          />
        ))}
      </div>
    </div>
  );
};

export default MiddleSection;
