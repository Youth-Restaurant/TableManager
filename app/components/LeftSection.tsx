import Table from './Table';

const LeftSection = () => {
  return (
    <div className='flex flex-col gap-6 md:gap-12 bg-white'>
      <div className='flex gap-4 md:gap-8 justify-between'>
        <Table number={1} />
        <Table number={2} />
      </div>
      <div className='flex gap-4 md:gap-8 justify-between'>
        <Table number={3} />
        <Table number={4} />
      </div>
      <div className='invisible'>empty</div>
      <div className='grid justify-items-center gap-1'>
        <Table number={5} width='w-24 md:w-32' height='h-40 md:h-52' />
        <Table number={6} width='w-24 md:w-32' height='h-40 md:h-52' />
      </div>
    </div>
  );
};

export default LeftSection;
