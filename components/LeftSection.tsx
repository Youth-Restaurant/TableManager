import Table from './Table';

const LeftSection = () => {
  return (
    <div className='flex flex-col gap-4 md:gap-8 bg-white'>
      <div className='flex gap-2 md:gap-6 justify-between'>
        <Table number={1} />
        <Table number={2} />
      </div>
      <div className='flex gap-2 md:gap-6 justify-between'>
        <Table number={3} />
        <Table number={4} />
      </div>
      <div className='invisible'>empty</div>
      <div className='grid justify-items-center gap-1'>
        <Table number={5} width='w-16 md:w-28' height='h-28 md:h-40' />
        <Table number={6} width='w-16 md:w-28' height='h-28 md:h-40' />
      </div>
    </div>
  );
};

export default LeftSection;
