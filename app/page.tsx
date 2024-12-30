'use client';

import { useState } from 'react';
import { mockTables } from '@/mocks/mockTables';
import { TableData } from '@/types/table';
import Table from '@/components/Table';
import TableManager from '@/utils/TableManager';
// import { Button } from '@/components/ui/button';

const defaultBasicChecklist = {
  tablecloth: false,
  cups: false,
  water: false,
  tissue: false,
  wetTissue: false,
  spoons: false,
};

const defaultSideChecklist = {
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
};

export default function Home() {
  // const [basicChecklist, setBasicChecklist] = useState(defaultBasicChecklist);
  // const [sideChecklist, setSideChecklist] = useState(defaultSideChecklist);

  const [tablesData] = useState<TableData[]>(() =>
    mockTables.map((table) => ({
      ...table,
      status: 'AVAILABLE',
      basicChecklist: { ...defaultBasicChecklist },
      sideChecklist: { ...defaultSideChecklist },
      servingCounts: { rice: 0, soup: 0 },
    }))
  );

  const [tableManager] = useState(() => new TableManager(tablesData));
  const [, forceUpdate] = useState({}); // 상태 갱신 강제 트리거

  // const handleTableUpdate = (
  //   tableNumber: number,
  //   updates: Partial<TableData>
  // ) => {
  //   setTablesData((prev) => {
  //     const newData = [...prev];
  //     newData[tableNumber - 1] = {
  //       ...newData[tableNumber - 1],
  //       ...updates,
  //     };
  //     return newData;
  //   });
  // };
  // 테이블 업데이트 핸들러
  const handleTableUpdate = (
    tableNumber: number,
    updates: Partial<TableData>
  ) => {
    tableManager.updateTable(tableNumber, updates);
    forceUpdate({}); // React 렌더링 강제 트리거
  };

  // const getSortedTableNumbers = () => {
  //   return tablesData
  //     .map((table, index) => ({
  //       number: index + 1,
  //       visitTime: table.visitTime,
  //     }))
  //     .sort((a, b) => {
  //       if (!a.visitTime) return 1;
  //       if (!b.visitTime) return -1;
  //       return (
  //         new Date(a.visitTime).getTime() - new Date(b.visitTime).getTime()
  //       );
  //     })
  //     .filter((table) => table.visitTime)
  //     .map((table) => table.number);
  // };

  // 방문 순서 (기존)
  // const getVisitOrder = () => {
  //   return tableManager
  //     .getTables()
  //     .filter(
  //       (table) =>
  //         table.visitTime &&
  //         table.currentUsers > 0 &&
  //         !isBasicChecklistComplete(table)
  //     )
  //     .sort(
  //       (a, b) =>
  //         new Date(a.visitTime!).getTime() - new Date(b.visitTime!).getTime()
  //     )
  //     .map((table) => table.id);
  // };

  // // 기본 세팅이 모두 체크 완료된지 확인하는 함수
  // const isBasicChecklistComplete = (table: TableData): boolean => {
  //   return Object.values(table.basicChecklist).every(Boolean);
  // };

  // // 밑반찬 완료 여부
  // const isSideChecklistComplete = (table: TableData) => {
  //   return Object.values(table.sideChecklist).every(Boolean);
  // };

  // "반찬 순서" = (1) 방문중, (2) 기본 세팅 완료, (3) 밑반찬 미완료
  // const getSideOrder = () => {
  //   return tableManager
  //     .getTables()
  //     .filter(
  //       (table) =>
  //         table.visitTime &&
  //         table.currentUsers > 0 &&
  //         isBasicChecklistComplete(table) &&
  //         !isSideChecklistComplete(table)
  //     )
  //     .sort(
  //       (a, b) =>
  //         new Date(a.visitTime!).getTime() - new Date(b.visitTime!).getTime()
  //     )
  //     .map((table) => table.id);
  // };

  // 밥 순서
  // const getRiceOrder = () => {
  //   return tableManager
  //     .getTables()
  //     .filter(
  //       (table) =>
  //         table.visitTime &&
  //         table.currentUsers > 0 &&
  //         isSideChecklistComplete(table)
  //     )
  //     .sort(
  //       (a, b) =>
  //         new Date(a.visitTime!).getTime() - new Date(b.visitTime!).getTime()
  //     )
  //     .map((table) => table.id);
  // };

  // const [isOrderTableVisible, setIsOrderTableVisible] = useState(false);

  return (
    <main className='min-h-screen w-full p-4'>
      <div className='container mx-auto h-full'>
        {/* <div className='mb-6 bg-white rounded-lg shadow'>
          <Button
            onClick={() => setIsOrderTableVisible(!isOrderTableVisible)}
            variant='ghost'
            className='w-full flex justify-between items-center p-4 text-lg font-semibold'
          >
            <span>서빙 순서 테이블</span>
            <span>{isOrderTableVisible ? '▼' : '▶'}</span>
          </Button>

          {isOrderTableVisible && (
            <table className='w-full border-collapse'>
              <tbody>
                <tr className='border-t'>
                  <td className='p-4 font-semibold bg-gray-50 w-24'>
                    방문 순서
                  </td>
                  <td className='p-4'>
                    <div className='flex flex-wrap gap-2'>
                      {getVisitOrder().map((tableNum) => (
                        <span
                          key={tableNum}
                          className='px-3 py-1 bg-blue-100 rounded-full text-blue-800'
                        >
                          {tableNum}번
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr className='border-t'>
                  <td className='p-4 font-semibold bg-orange-500 text-white'>
                    반찬 순서
                  </td>
                  <td className='p-4'>
                    <div className='flex flex-wrap gap-2'>
                      {getSideOrder().map((tableNum) => (
                        <span
                          key={tableNum}
                          className='px-3 py-1 bg-pink-100 rounded-full text-pink-800'
                        >
                          {tableNum}번
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr className='border-t'>
                  <td className='p-4 font-semibold bg-green-500 text-white'>
                    밥 순서
                  </td>
                  <td className='p-4'>
                    <div className='flex flex-wrap gap-2'>
                      {getRiceOrder().map((tableNum) => (
                        <span
                          key={tableNum}
                          className='px-3 py-1 bg-green-100 rounded-full text-green-800'
                        >
                          {tableNum}번
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div> */}

        <div className='flex flex-col md:flex-row gap-5 lg:gap-4 xl:gap-8'>
          <LeftSection
            tablesData={tableManager.getTables()}
            onTableUpdate={handleTableUpdate}
          />
          <MiddleSection
            tablesData={tableManager.getTables()}
            onTableUpdate={handleTableUpdate}
          />
          <RightSection
            tablesData={tableManager.getTables()}
            onTableUpdate={handleTableUpdate}
          />
        </div>
      </div>
    </main>
  );
}

const LeftSection = ({
  tablesData,
  onTableUpdate,
}: {
  tablesData: { [key: number]: TableData };
  onTableUpdate: (tableNumber: number, updates: Partial<TableData>) => void;
}) => {
  return (
    <div className='flex flex-col gap-1 md:gap-4'>
      <div className='flex gap-1 md:gap-2 xl:gap-4'>
        {[0, 1].map((num) => (
          <Table key={num} data={tablesData[num]} onUpdate={onTableUpdate} />
        ))}
      </div>
      <div className='flex gap-1 md:gap-2 xl:gap-4'>
        {[2, 3].map((num) => (
          <Table key={num} data={tablesData[num]} onUpdate={onTableUpdate} />
        ))}
      </div>
      <div className='hidden md:visible'>empty</div>
      <div className='grid lg:justify-center gap-1 lg:gap-2'>
        {[4, 5].map((num) => (
          <Table key={num} data={tablesData[num]} onUpdate={onTableUpdate} />
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
    <div className='grid grid-cols-2 md:gap-6 xl:gap-4 w-3/5 lg:w-auto'>
      {/* middle section의 1번째 열 */}
      <div className='grid gap-2 md:gap-4 md:items-end'>
        <div className='grid gap-10'>
          {/* 7, 8번 테이블 두 개 묶음 */}
          <div className='flex gap-1 flex-col'>
            {[6, 7].map((num) => (
              <Table
                key={num}
                data={tablesData[num]}
                onUpdate={onTableUpdate}
              />
            ))}
          </div>
          {/* 9번 테이블 */}
          <Table key={8} data={tablesData[8]} onUpdate={onTableUpdate} />
        </div>
      </div>
      {/* middle section의 2번째 열 */}
      <div className='flex flex-col gap-1 lg:justify-end'>
        {[9, 10, 11, 12].map((num) => (
          <Table key={num} data={tablesData[num]} onUpdate={onTableUpdate} />
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
    <div className='relative lg:mt-8'>
      <div className='lg:absolute bottom-16 lg:bottom-24 flex gap-2'>
        {[13, 14].map((num) => (
          <Table key={num} data={tablesData[num]} onUpdate={onTableUpdate} />
        ))}
      </div>
    </div>
  );
};
