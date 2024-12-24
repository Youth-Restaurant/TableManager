'use client';

import { useState } from 'react';
import { mockTables } from '@/mocks/mockTables';
import { TableData } from '@/types/table';
import Table from '@/components/Table';

const Page = () => {
  const [tablesData, setTablesData] = useState<TableData[]>(() => {
    const initialData: TableData[] = [];
    mockTables.forEach((table) => {
      initialData.push({
        ...table,
        basicChecklist: {
          tablecloth: false,
          cups: false,
          water: false,
          tissue: false,
          wetTissue: false,
          spoons: false,
        },
        sideChecklist: {
          kimchi: false,
          radish: false,
          pickles: false,
          sauce: false,
          bean_sprouts: false,
          spinach: false,
          seaweed: false,
          fish_cake: false,
          stir_fry: false,
          egg_roll: false,
          braised_potato: false,
          anchovies: false,
        },
        servingCounts: {
          rice: 0,
          soup: 0,
        },
      });
    });
    return initialData;
  });

  const handleTableUpdate = (
    tableNumber: number,
    updates: Partial<TableData>
  ) => {
    setTablesData((prev) => {
      const newData = [...prev];
      newData[tableNumber - 1] = {
        ...newData[tableNumber - 1],
        ...updates,
      };
      return newData;
    });
  };

  const getSortedTableNumbers = () => {
    return tablesData
      .map((table, index) => ({
        number: index + 1,
        visitTime: table.visitTime,
      }))
      .sort((a, b) => {
        if (!a.visitTime) return 1;
        if (!b.visitTime) return -1;
        return (
          new Date(a.visitTime).getTime() - new Date(b.visitTime).getTime()
        );
      })
      .filter((table) => table.visitTime)
      .map((table) => table.number);
  };

  return (
    <main className='min-h-screen w-11/12 md:w-full p-4'>
      <div className='container mx-auto h-full'>
        <div className='mb-6 bg-white p-4 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-2'>방문 순서</h2>
          <div className='flex flex-wrap gap-2'>
            {getSortedTableNumbers().map((tableNum) => (
              <span
                key={tableNum}
                className='px-3 py-1 bg-blue-100 rounded-full text-blue-800'
              >
                {tableNum}번
              </span>
            ))}
          </div>
        </div>

        <div className='flex flex-col md:flex-row gap-8 md:gap-16'>
          <LeftSection
            tablesData={tablesData}
            onTableUpdate={handleTableUpdate}
          />
          <MiddleSection
            tablesData={tablesData}
            onTableUpdate={handleTableUpdate}
          />
          <RightSection
            tablesData={tablesData}
            onTableUpdate={handleTableUpdate}
          />
        </div>
      </div>
    </main>
  );
};

const LeftSection = ({
  tablesData,
  onTableUpdate,
}: {
  tablesData: { [key: number]: TableData };
  onTableUpdate: (tableNumber: number, updates: Partial<TableData>) => void;
}) => {
  return (
    <div className='flex flex-col gap-4 md:gap-8 bg-white'>
      <div className='flex gap-2 md:gap-6 justify-between'>
        {[0, 1].map((num) => (
          <Table key={num} data={tablesData[num]} onUpdate={onTableUpdate} />
        ))}
      </div>
      <div className='flex gap-2 md:gap-6 justify-between'>
        {[2, 3].map((num) => (
          <Table key={num} data={tablesData[num]} onUpdate={onTableUpdate} />
        ))}
      </div>
      <div className='invisible'>empty</div>
      <div className='grid justify-items-center gap-1'>
        {[4, 5].map((num) => (
          <Table
            key={num}
            data={tablesData[num]}
            width='w-16 md:w-28'
            height='h-28 md:h-40'
            onUpdate={onTableUpdate}
          />
        ))}
      </div>
    </div>
  );
};

const MiddleSection = ({
  tablesData,
  onTableUpdate,
}: {
  tablesData: { [key: number]: TableData };
  onTableUpdate: (tableNumber: number, updates: Partial<TableData>) => void;
}) => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-2 gap-8 md:gap-16'>
      <div className='flex flex-col justify-end gap-2 md:gap-6'>
        <div className='flex gap-1 flex-col'>
          {[6, 7, 8].map((num) => (
            <Table
              key={num}
              data={tablesData[num]}
              width='w-16 md:w-28'
              height='h-28 md:h-40'
              onUpdate={onTableUpdate}
            />
          ))}
        </div>
      </div>
      <div className='flex flex-col gap-1 justify-end'>
        {[9, 10, 11, 12].map((num) => (
          <Table
            key={num}
            data={tablesData[num]}
            width='w-16 md:w-28'
            height='h-24 md:h-32'
            onUpdate={onTableUpdate}
          />
        ))}
      </div>
    </div>
  );
};

const RightSection = ({
  tablesData,
  onTableUpdate,
}: {
  tablesData: { [key: number]: TableData };
  onTableUpdate: (tableNumber: number, updates: Partial<TableData>) => void;
}) => {
  return (
    <div className='relative md:mt-8'>
      <div className='absolute bottom-16 md:bottom-24 flex gap-2'>
        {[13, 14].map((num) => (
          <Table
            key={num}
            data={tablesData[num]}
            width='w-28 md:w-40'
            height='h-16 md:h-24'
            onUpdate={onTableUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
