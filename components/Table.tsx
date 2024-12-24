'use client';

import React, { useCallback, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { TableData } from '@/types/table';

interface TableProps {
  data: TableData;
  width?: string;
  height?: string;
  onUpdate: (tableNumber: number, updates: Partial<TableData>) => void;
}

const formatDate = (date: Date | null): string => {
  if (!date) return '-';
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

interface MenuOption {
  name: string;
  price: number;
}

const menuOptions: MenuOption[] = [
  { name: '점심특선', price: 10000 },
  { name: '2만원 식사', price: 20000 },
  { name: '3만원 식사', price: 30000 },
];

// 체크리스트 아이템 정의
const basicItems = [
  { id: 'tablecloth', label: '테이블보' },
  { id: 'cups', label: '물컵' },
  { id: 'water', label: '물통' },
  { id: 'tissue', label: '티슈' },
  { id: 'wetTissue', label: '물티슈' },
  { id: 'spoons', label: '수저' },
];

const sideItems = [
  { id: 'kimchi', label: '김치' },
  { id: 'radish', label: '단무지' },
  { id: 'pickles', label: '절임류' },
  { id: 'sauce', label: '초장/간장' },
  { id: 'bean_sprouts', label: '숙주나물' },
  { id: 'spinach', label: '시금치나물' },
  { id: 'seaweed', label: '미역줄기' },
  { id: 'fish_cake', label: '어묵볶음' },
  { id: 'stir_fry', label: '잡채' },
  { id: 'egg_roll', label: '계란말이' },
  { id: 'braised_potato', label: '감자조림' },
  { id: 'anchovies', label: '멸치볶음' },
];

// 밥과 국 아이템 정의 추가
const riceAndSoupItems = [
  { id: 'rice', label: '밥' },
  { id: 'soup', label: '국' },
];

const Table = ({
  data,
  width = 'w-20 md:w-32',
  height = 'h-16 md:h-24',
  onUpdate,
}: TableProps) => {
  const [open, setOpen] = useState(false);

  if (!data) return <div>loading...</div>;

  // Remove local states and use data from props
  const {
    id,
    currentUsers,
    capacity,
    menu,
    price,
    visitTime,
    basicChecklist,
    sideChecklist,
    servingCounts,
  } = data;

  // Update handlers to use onUpdate prop
  const handleIncrement = () => {
    if (currentUsers < capacity) {
      onUpdate(id, { currentUsers: currentUsers + 1 });
    }
  };

  const handleDecrement = () => {
    if (currentUsers > 0) {
      onUpdate(id, { currentUsers: currentUsers - 1 });
    }
  };

  const handleServingIncrement = (itemId: string) => {
    if (servingCounts[itemId as keyof typeof servingCounts] < currentUsers) {
      onUpdate(id, {
        servingCounts: {
          ...servingCounts,
          [itemId]: servingCounts[itemId as keyof typeof servingCounts] + 1,
        },
      });
    }
  };

  // 제공 수량 감소 함수
  const handleServingDecrement = (itemId: string) => {
    if (servingCounts[itemId as keyof typeof servingCounts] > 0) {
      onUpdate(id, {
        servingCounts: {
          ...servingCounts,
          [itemId]: servingCounts[itemId as keyof typeof servingCounts] - 1,
        },
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const newVisitTime = currentUsers > 0 ? new Date() : null;

      const updatedData = {
        visitTime: newVisitTime,
        currentUsers,
        menu,
        price,
        basicChecklist,
        sideChecklist,
        servingCounts,
      };

      onUpdate(id, updatedData);
      setOpen(false);
    } catch (error) {
      console.error('Error updating table:', error);
    }
  };

  // 총 가격 계산
  const calculateTotalPrice = useCallback(() => {
    return price * currentUsers;
  }, [price, currentUsers]);

  // 기본 세팅이 모두 완료되었는지 확인하는 함수
  const isBasicChecklistComplete = useCallback(() => {
    return Object.values(basicChecklist).every((value) => value === true);
  }, [basicChecklist]);

  // 밑반찬이 모두 완료되었는지 확인하는 함수
  const isSideChecklistComplete = useCallback(() => {
    return Object.values(sideChecklist).every((value) => value === true);
  }, [sideChecklist]);

  // 밥과 국이 모두 제공되었는지 확인하는 함수
  const isRiceAndSoupComplete = useCallback(() => {
    return (
      servingCounts.rice === currentUsers && servingCounts.soup === currentUsers
    );
  }, [servingCounts, currentUsers]);

  // 현재 서빙 단계를 반환하는 함수
  const getServingStage = useCallback(() => {
    if (!isBasicChecklistComplete()) return 'basic';
    if (!isSideChecklistComplete()) return 'side';
    if (!isRiceAndSoupComplete()) return 'main';
    return 'complete';
  }, [
    isBasicChecklistComplete,
    isSideChecklistComplete,
    isRiceAndSoupComplete,
  ]);

  // 상태에 따른 표시 내용
  const getStatusDisplay = useCallback(() => {
    const stage = getServingStage();
    switch (stage) {
      case 'basic':
        return `기본 세팅: ${getBasicCheckCount()}/${basicItems.length}`;
      case 'side':
        return `밑반찬: ${
          Object.values(sideChecklist).filter((value) => value).length
        }/${sideItems.length}`;
      case 'main':
        return (
          <div className='flex flex-col'>
            <span>
              밥: {servingCounts.rice}/{currentUsers}
            </span>
            <span>
              국: {servingCounts.soup}/{currentUsers}
            </span>
          </div>
        );
      case 'complete':
        return '서빙 완료';
    }
  }, [getServingStage, sideChecklist, servingCounts, currentUsers]);

  // 기본 세팅 체크된 개수 계산
  const getBasicCheckCount = useCallback(() => {
    return Object.values(basicChecklist).filter((value) => value).length;
  }, [basicChecklist]);

  // 테이블 색상 로직 추가
  const getTableColor = useCallback(() => {
    const stage = getServingStage();
    switch (stage) {
      case 'basic':
        return 'bg-gray-300'; // 기본 세팅 진행 중
      case 'side':
        return 'bg-orange-400'; // 밑반찬 ��팅 중
      case 'main':
        return 'bg-blue-500'; // 밥과 국 서빙 중
      case 'complete':
        return 'bg-green-500'; // 모든 서빙 완료
    }
  }, [currentUsers, getServingStage]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className={cn(
            width,
            height,
            getTableColor(),
            'p-1 border rounded-lg cursor-pointer hover:border-blue-500',
            currentUsers > 0 && getServingStage() === 'basic'
              ? 'animate-pulse'
              : ''
          )}
          onClick={() => setOpen(true)}
        >
          <span className='text-white font-bold text-xl md:text-2xl'>
            {id} ({currentUsers}/{data?.capacity})
          </span>
          <div className='text-white text-base font-semibold mt-2'>
            {getStatusDisplay()}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle>테이블 {id}번</DialogTitle>
        </DialogHeader>

        <div className='grid grid-cols-2 gap-6'>
          {/* 왼쪽: 테이블 정보 */}
          <table className='w-full border-collapse'>
            <tbody>
              <tr className='border rounded-lg overflow-hidden'>
                <td className='font-medium bg-gray-50 p-3 w-1/4'>인원</td>
                <td className='p-3'>
                  <div className='flex items-center justify-between'>
                    <span>
                      {currentUsers} / {data?.capacity}
                    </span>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={handleDecrement}
                        disabled={currentUsers <= 0}
                      >
                        -
                      </Button>
                      <Button
                        variant='default'
                        size='sm'
                        onClick={handleIncrement}
                        disabled={currentUsers >= data?.capacity}
                        className='bg-blue-500 hover:bg-blue-600 text-white'
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className='border rounded-lg overflow-hidden'>
                <td className='font-medium bg-gray-50 p-3'>메뉴</td>
                <td className='p-3'>
                  <Select
                    defaultValue={menuOptions[0].name}
                    onValueChange={(value) => {
                      const selected = menuOptions.find(
                        (menu) => menu.name === value
                      );
                      if (selected) {
                        onUpdate(id, { price: selected.price });
                        onUpdate(id, { menu: selected.name });
                      }
                    }}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='메뉴를 선택하세요' />
                    </SelectTrigger>
                    <SelectContent>
                      {menuOptions.map((menu) => (
                        <SelectItem key={menu.name} value={menu.name}>
                          {menu.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
              <tr className='border rounded-lg overflow-hidden'>
                <td className='font-medium bg-gray-50 p-3'>방문 시간</td>
                <td className='p-3'>{formatDate(visitTime)}</td>
              </tr>
              <tr className='border rounded-lg overflow-hidden'>
                <td className='font-medium bg-gray-50 p-3'>가격</td>
                <td className='p-3'>
                  <div className='space-y-2'>
                    <div className='text-sm text-gray-500'>
                      {price.toLocaleString()}원 × {currentUsers}명
                    </div>
                    <Input
                      type='text'
                      value={`${calculateTotalPrice().toLocaleString()}원`}
                      className='w-full font-medium'
                      readOnly
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* 오른쪽: 서빙 체크리스트 */}
          <div className='space-y-6'>
            {/* 기본 세팅 체크리스트 */}
            <table className='w-full border-collapse'>
              <thead>
                <tr>
                  <th
                    className='text-left p-3 bg-gray-50 border rounded-t-lg font-medium'
                    colSpan={6}
                  >
                    기본 세팅
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.ceil(basicItems.length / 3) }).map(
                  (_, rowIndex) => (
                    <tr key={rowIndex}>
                      {basicItems
                        .slice(rowIndex * 3, rowIndex * 3 + 3)
                        .map((item, colIndex) => (
                          <React.Fragment key={item.id}>
                            <td
                              className={`p-3 border-b ${
                                basicChecklist[item.id] ? 'bg-green-100' : ''
                              } cursor-pointer hover:bg-gray-50`}
                              onClick={() => {
                                onUpdate(id, {
                                  basicChecklist: {
                                    ...basicChecklist,
                                    [item.id]: !basicChecklist[item.id],
                                  },
                                });
                              }}
                            >
                              {item.label}
                            </td>
                            <td
                              className={`p-3 w-12 text-center border-b ${
                                basicChecklist[item.id] ? 'bg-green-100' : ''
                              } ${colIndex < 2 ? 'border-r' : ''}`}
                            >
                              <Checkbox
                                id={`basic-${item.id}`}
                                checked={basicChecklist[item.id]}
                                onCheckedChange={(checked) => {
                                  onUpdate(id, {
                                    basicChecklist: {
                                      ...basicChecklist,
                                      [item.id]: checked === true,
                                    },
                                  });
                                }}
                              />
                            </td>
                          </React.Fragment>
                        ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>

            {/* 반찬 체크리스트 */}
            <table className='w-full border-collapse'>
              <thead>
                <tr>
                  <th
                    className='text-left p-3 bg-gray-50 border rounded-t-lg font-medium'
                    colSpan={6}
                  >
                    밑반찬 ({sideItems.length})
                  </th>
                </tr>
              </thead>
              <tbody
                className={!isBasicChecklistComplete() ? 'opacity-50' : ''}
              >
                {Array.from({ length: Math.ceil(sideItems.length / 3) }).map(
                  (_, rowIndex) => (
                    <tr key={rowIndex}>
                      {sideItems
                        .slice(rowIndex * 3, rowIndex * 3 + 3)
                        .map((item, colIndex) => (
                          <React.Fragment key={item.id}>
                            <td
                              className={`p-3 border-b ${
                                sideChecklist[item.id] ? 'bg-green-100' : ''
                              } ${
                                isBasicChecklistComplete()
                                  ? 'cursor-pointer hover:bg-gray-50'
                                  : ''
                              }`}
                              onClick={() => {
                                if (isBasicChecklistComplete()) {
                                  onUpdate(id, {
                                    sideChecklist: {
                                      ...sideChecklist,
                                      [item.id]: !sideChecklist[item.id],
                                    },
                                  });
                                }
                              }}
                            >
                              {item.label}
                            </td>
                            <td
                              className={`p-3 w-12 text-center border-b ${
                                sideChecklist[item.id] ? 'bg-green-100' : ''
                              } ${colIndex < 2 ? 'border-r' : ''}`}
                            >
                              <Checkbox
                                id={`side-${item.id}`}
                                checked={sideChecklist[item.id]}
                                disabled={!isBasicChecklistComplete()}
                                onCheckedChange={(checked) => {
                                  onUpdate(id, {
                                    sideChecklist: {
                                      ...sideChecklist,
                                      [item.id]: checked === true,
                                    },
                                  });
                                }}
                              />
                            </td>
                          </React.Fragment>
                        ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>

            {/* 밥과 국 체크리스트 */}
            <table className='w-full border-collapse'>
              <thead>
                <tr>
                  <th
                    className='text-left p-3 bg-gray-50 border rounded-t-lg font-medium'
                    colSpan={2}
                  >
                    밥과 국
                  </th>
                </tr>
              </thead>
              <tbody
                className={!isBasicChecklistComplete() ? 'opacity-50' : ''}
              >
                {riceAndSoupItems.map((item) => (
                  <tr
                    key={item.id}
                    className={
                      servingCounts[item.id as keyof typeof servingCounts] ===
                      currentUsers
                        ? 'bg-green-100'
                        : ''
                    }
                  >
                    <td className='p-3 border-b font-medium'>{item.label}</td>
                    <td className='p-3 border-b'>
                      <div className='flex items-center justify-between'>
                        <span>
                          {servingCounts[item.id as keyof typeof servingCounts]}{' '}
                          / {currentUsers}
                        </span>
                        <div className='flex items-center gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleServingDecrement(item.id)}
                            disabled={
                              !isBasicChecklistComplete() ||
                              servingCounts[
                                item.id as keyof typeof servingCounts
                              ] <= 0
                            }
                          >
                            -
                          </Button>
                          <Button
                            variant='default'
                            size='sm'
                            onClick={() => handleServingIncrement(item.id)}
                            disabled={
                              !isBasicChecklistComplete() ||
                              servingCounts[
                                item.id as keyof typeof servingCounts
                              ] >= currentUsers
                            }
                            className='bg-blue-500 hover:bg-blue-600 text-white'
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className='mt-6'>
          <Button
            className='bg-blue-500 hover:bg-blue-600 text-white w-full'
            onClick={handleUpdate}
          >
            변경
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Table;
