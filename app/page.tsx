'use client';

import { useState } from 'react';
import { mockTables } from '@/mocks/mockTables';
import { SideDish, TableData } from '@/types/table';
import Table from '@/components/Table';
import TableManager from '@/utils/TableManager';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

const seasonedVegetables = [
  { id: 'radish', label: '단무지', checked: false },
  { id: 'bean_sprouts', label: '숙주나물', checked: false },
  { id: 'spinach', label: '시금치나물', checked: false },
  { id: 'seaweed', label: '미역줄기', checked: false },
];
const kimchis = [
  { id: 'cabbageKimchi', label: '배추김치', checked: false },
  { id: 'radishKimchi', label: '깍두기', checked: false },
  { id: 'youngRadishKimchi', label: '열무김치', checked: false },
  { id: 'ponytailRadishKimchi', label: '총각김치', checked: false },
];
const braisedDishes = [
  { id: 'potatoBraised', label: '감자조림', checked: false },
  { id: 'quailEggBraised', label: '메추리알조림', checked: false },
  { id: 'soyBraised', label: '콩자반', checked: false },
];

const friedDishes = [
  { id: 'seaweed', label: '미역줄기', checked: false },
  { id: 'fishCake', label: '어묵볶음', checked: false },
  { id: 'stirFry', label: '잡채', checked: false },
];

const pickledDishes = [
  { id: 'radish', label: '단무지', checked: false },
  { id: 'pickles', label: '절임류', checked: false },
  { id: 'sauce', label: '초장/간장', checked: false },
];

const boiledDishes = [
  { id: 'eggRoll', label: '계란말이', checked: false },
  { id: 'braisedPotato', label: '감자조림', checked: false },
];
const stirFriedDishes = [
  { id: 'anchovyStirFried', label: '멸치볶음', checked: false },
  { id: 'fishCakeStirFried', label: '어묵볶음', checked: false },
  { id: 'perillaLeafStirFried', label: '깻잎볶음', checked: false },
];
const otherDishes = [
  { id: 'steamedEgg', label: '계란찜', checked: false },
  { id: 'meatPancake', label: '동그랑땡', checked: false },
  { id: 'kimchiPancake', label: '김치전', checked: false },
];


const sideDishes = [
  {id: 1, name: 'seasonedVegetables', label: '나물류', items: seasonedVegetables},
  {id: 2, name: 'kimchis', label: '김치류', items: kimchis},
  {id: 3, name: 'braisedDishes', label: '조림류', items: braisedDishes},
  {id: 4, name: 'friedDishes', label: '튀김류', items: friedDishes},
  {id: 5, name: 'pickledDishes', label: '절임류', items: pickledDishes},
  {id: 7, name: 'stirFriedDishes', label: '볶음류', items: stirFriedDishes},
  {id: 8, name: 'otherDishes', label: '기타', items: otherDishes},
]

export default function Home() {
  const [selectedSideDishes, setSelectedSideDishes] = useState<SideDish[]>([]);

  const [tablesData] = useState<TableData[]>(() =>
    mockTables.map((table) => ({
      ...table,
      status: 'AVAILABLE',
      basicChecklist: { ...defaultBasicChecklist },
      sideChecklist: selectedSideDishes,
      servingCounts: { rice: 0, soup: 0 },
    }))
  );

  const [tableManager] = useState(() => new TableManager(tablesData));
  const [, forceUpdate] = useState({}); // 상태 갱신 강제 트리거
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSubmitSideDishes = () => {
    fetch('/api/dishes', {
      method: 'POST',
      body: JSON.stringify({ selectedSideDishes }),
    });
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

  // // 방문 순서 (기존)
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

  const handleSelectedSideDishes = (item: SideDish) => {
    selectedSideDishes.some((dish) => dish.id === item.id) ?
      setSelectedSideDishes((prev) => prev.filter((dish) => dish.id !== item.id)) :
      setSelectedSideDishes((prev) => [...prev, item]);
  };

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
            handleTableUpdate={handleTableUpdate}
            selectedSideDishes={selectedSideDishes}
          />
          <MiddleSection
            tablesData={tableManager.getTables()}
            handleTableUpdate={handleTableUpdate}
            selectedSideDishes={selectedSideDishes}
          />
          <RightSection
            tablesData={tableManager.getTables()}
            handleTableUpdate={handleTableUpdate}
            selectedSideDishes={selectedSideDishes}
          />
        </div>
        <div className='absolute top-3 right-3 flex justify-center'>
          <Button
            className='bg-blue-500 text-white font-bold'
            onClick={() => setIsModalOpen(true)}
          >
            반찬 세팅
          </Button>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
            <DialogHeader>
              <div className='flex items-center justify-between'>
                <DialogTitle className='text-2xl font-bold mb-4'>
                  반찬 세팅 순서
                </DialogTitle>
                <div className='text-sm text-gray-500'>
                  선택됨: {selectedSideDishes.length}{' '}
                  / {sideDishes.reduce((acc, category) => acc + category.items.length, 0)}
                </div>
              </div>
            </DialogHeader>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {sideDishes.map((category) => (
                <div key={category.name} className='bg-gray-50 p-4 rounded-lg'>
                  <h3 className='text-lg font-semibold mb-3'>
                    {category.label} ({category.items.length})
                  </h3>
                  <ul className='space-y-2'>
                    {category.items.map((item) => {
                      return (
                        <li key={item.id} className='flex items-center space-x-2'>
                          <input
                            type='checkbox'
                            id={item.id}
                            checked={
                              selectedSideDishes.some(
                                (dish) => dish.id === item.id
                              )
                            }
                            onChange={() => handleSelectedSideDishes(item)}
                            className='rounded border-gray-300'
                          />
                          <label htmlFor={item.id}>{item.label}</label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  handleSubmitSideDishes();
                }}
              >
                출력
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}

const LeftSection = ({
  tablesData,
  handleTableUpdate,
  selectedSideDishes,
}: {
  tablesData: { [key: number]: TableData };
  handleTableUpdate: (tableNumber: number, updates: Partial<TableData>) => void;
  selectedSideDishes: SideDish[];
}) => {
  return (
    <div className='flex flex-col gap-1 md:gap-4 border-r-2 pr-4'>
      <h1>1번 홀</h1>
      <div className='flex gap-1 md:gap-2 xl:gap-4'>
        {[0, 1].map((num) => (
          <Table key={num} data={tablesData[num]} handleTableUpdate={handleTableUpdate} selectedSideDishes={selectedSideDishes} />
        ))}
      </div>
      <div className='flex gap-1 md:gap-2 xl:gap-4'>
        {[2, 3].map((num) => (
          <Table key={num} data={tablesData[num]} handleTableUpdate={handleTableUpdate} selectedSideDishes={selectedSideDishes} />
        ))}
      </div>
      <div className='hidden md:visible'>empty</div>
      <div className='grid lg:justify-center gap-1 lg:gap-2'>
        {[4, 5].map((num) => (
            <Table key={num} data={tablesData[num]} handleTableUpdate={handleTableUpdate} selectedSideDishes={selectedSideDishes} />
        ))}
      </div>
    </div>
  );
};

const MiddleSection = ({
  tablesData,
  handleTableUpdate,
  selectedSideDishes,
}: {
  tablesData: { [key: number]: TableData };
  handleTableUpdate: (tableNumber: number, updates: Partial<TableData>) => void;
  selectedSideDishes: SideDish[];
}) => {
  return (
    <div>
      <h1>2번 홀</h1>
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
                  handleTableUpdate={handleTableUpdate}
                  selectedSideDishes={selectedSideDishes}
                />
              ))}
            </div>
            {/* 9번 테이블 */}
            <Table key={8} data={tablesData[8]} handleTableUpdate={handleTableUpdate} selectedSideDishes={selectedSideDishes} />
          </div>
        </div>
        {/* middle section의 2번째 열 */}
        <div className='flex flex-col gap-1 lg:justify-end'>
          {[9, 10, 11, 12].map((num) => (
              <Table key={num} data={tablesData[num]} handleTableUpdate={handleTableUpdate} selectedSideDishes={selectedSideDishes} />
          ))}
        </div>
      </div>
    </div>
  );
};

const RightSection = ({
  tablesData,
  handleTableUpdate,
  selectedSideDishes,
}: {
  tablesData: { [key: number]: TableData };
  handleTableUpdate: (tableNumber: number, updates: Partial<TableData>) => void;
  selectedSideDishes: SideDish[];
}) => {
  return (
    <div className='relative lg:mt-8'>
      <div className='lg:absolute bottom-16 lg:bottom-24 flex gap-2'>
        {[13, 14].map((num) => (
          <Table key={num} data={tablesData[num]} handleTableUpdate={handleTableUpdate} selectedSideDishes={selectedSideDishes} />
        ))}
      </div>
    </div>
  );
};
