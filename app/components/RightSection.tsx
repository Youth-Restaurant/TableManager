import Table from './Table';

const RightSection = () => {
  return (
    <div className='relative md:mt-8'>
      <div className='absolute bottom-16 md:bottom-24 flex gap-2'>
        <Table
          number={14}
          width='w-28 md:w-40'
          height='h-16 md:h-24'
          capacity={6}
        />
        <Table
          number={15}
          width='w-28 md:w-40'
          height='h-16 md:h-24'
          capacity={6}
        />
      </div>
    </div>
  );
};

export default RightSection;
