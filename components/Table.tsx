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

// Card, Users 아이콘 import
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface TableProps {
  data: TableData;
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

// (예시) 메뉴 옵션
interface MenuOption {
  name: string;
  price: number;
}

const menuOptions: MenuOption[] = [
  { name: '점심특선', price: 10000 },
  { name: '2만원 식사', price: 20000 },
  { name: '3만원 식사', price: 30000 },
];

// (예시) 체크리스트 아이템
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

const riceAndSoupItems = [
  { id: 'rice', label: '밥' },
  { id: 'soup', label: '국' },
];

const Table = ({ data, onUpdate }: TableProps) => {
  const [open, setOpen] = useState(false);

  // 구조 분해
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

  // 업데이트 헬퍼
  const updateTableState = (updates: Partial<TableData>) => {
    onUpdate(id, updates);
  };

  // 인원 증가/감소
  const handleIncrement = () => {
    if (currentUsers < capacity) {
      updateTableState({ currentUsers: currentUsers + 1 });
    }
  };

  const handleDecrement = () => {
    if (currentUsers > 0) {
      updateTableState({ currentUsers: currentUsers - 1 });
    }
  };

  // 체크리스트(밥/국) 증가/감소
  const handleServingIncrement = (itemId: string) => {
    if (servingCounts[itemId as keyof typeof servingCounts] < currentUsers) {
      updateTableState({
        servingCounts: {
          ...servingCounts,
          [itemId]: servingCounts[itemId as keyof typeof servingCounts] + 1,
        },
      });
    }
  };

  const handleServingDecrement = (itemId: string) => {
    if (servingCounts[itemId as keyof typeof servingCounts] > 0) {
      updateTableState({
        servingCounts: {
          ...servingCounts,
          [itemId]: servingCounts[itemId as keyof typeof servingCounts] - 1,
        },
      });
    }
  };

  // 모달 열기/닫기
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleUpdate = async () => {
    try {
      // 기존 visitTime이 있는지 확인
      const alreadyHasVisitTime = !!visitTime;

      // 인원이 1명 이상이면서 기존 visitTime이 없으면 새로 할당
      const newVisitTime =
        currentUsers > 0 && !alreadyHasVisitTime
          ? new Date()
          : visitTime || null;

      updateTableState({
        visitTime: newVisitTime,
        currentUsers,
        menu,
        price,
        basicChecklist,
        sideChecklist,
        servingCounts,
      });
      setOpen(false);
    } catch (error) {
      console.error('Error updating table:', error);
    }
  };

  // 총 가격
  const calculateTotalPrice = useCallback(() => {
    return price * currentUsers;
  }, [price, currentUsers]);

  // 체크리스트 완료 여부
  const isBasicChecklistComplete = useCallback(() => {
    return Object.values(basicChecklist).every(Boolean);
  }, [basicChecklist]);

  const isSideChecklistComplete = useCallback(() => {
    return Object.values(sideChecklist).every(Boolean);
  }, [sideChecklist]);

  const isRiceAndSoupComplete = useCallback(() => {
    return (
      servingCounts.rice === currentUsers && servingCounts.soup === currentUsers
    );
  }, [servingCounts, currentUsers]);

  // 서빙 단계
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

  // ------------------------
  // 1) 총 항목 수, 완료 항목 수
  // ------------------------
  const getTotalSteps = useCallback(() => {
    return (
      basicItems.length + sideItems.length + 2 * currentUsers // 밥, 국 각각 currentUsers만큼 필요
    );
  }, [currentUsers]);

  const getDoneSteps = useCallback(() => {
    // basic 체크된 개수
    const basicCheckedCount =
      Object.values(basicChecklist).filter(Boolean).length;

    // side 체크된 개수
    const sideCheckedCount =
      Object.values(sideChecklist).filter(Boolean).length;

    // 밥 + 국 = (servingCounts.rice + servingCounts.soup)
    const mainCount = servingCounts.rice + servingCounts.soup;

    return basicCheckedCount + sideCheckedCount + mainCount;
  }, [basicChecklist, sideChecklist, servingCounts]);

  // ------------------------
  // 2) ProgressBar 표시
  // ------------------------
  const getProgressPercentage = useCallback(() => {
    const total = getTotalSteps();
    const done = getDoneSteps();
    if (total === 0) return 0;
    return Math.floor((done / total) * 100); // 정수화
  }, [getTotalSteps, getDoneSteps]);

  // 색상 로직 (예: 0~49 빨강, 50~79 노랑, 80~99 파랑, 100 초록 등)
  const getProgressColorClass = useCallback(() => {
    const percentage = getProgressPercentage();
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 80) return 'bg-blue-600';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 1) return 'bg-red-500';
    return 'bg-gray-300';
  }, [getProgressPercentage]);

  // ------------------------
  // 3) 카드 배경/글자색 (단계별)
  // ------------------------
  const getCardBackgroundClass = useCallback(() => {
    switch (getServingStage()) {
      case 'basic':
        return 'bg-gray-50';
      case 'side':
        return 'bg-orange-400';
      case 'main':
        return 'bg-blue-500';
      case 'complete':
        return 'bg-green-500';
      default:
        return 'bg-white';
    }
  }, [getServingStage]);

  const getTextColorClass = useCallback(() => {
    return getServingStage() === 'basic' ? 'text-black' : 'text-white';
  }, [getServingStage]);

  // ------------------------
  // 4) 서빙 상태 표시 (문구)
  // ------------------------
  const getStatusDisplay = useCallback(() => {
    switch (getServingStage()) {
      case 'basic':
        return `기본 세팅: ${
          Object.values(basicChecklist).filter(Boolean).length
        } / ${basicItems.length}`;
      case 'side':
        return `밑반찬: ${
          Object.values(sideChecklist).filter(Boolean).length
        } / ${sideItems.length}`;
      case 'main':
        return (
          <div className='flex gap-3'>
            <span>
              밥: <span className='font-bold'>{servingCounts.rice}</span>/
              {currentUsers}
            </span>
            <span>
              국: <span className='font-bold'>{servingCounts.soup}</span>/
              {currentUsers}
            </span>
          </div>
        );
      case 'complete':
        return '서빙 완료';
    }
  }, [
    getServingStage,
    basicChecklist,
    sideChecklist,
    servingCounts,
    currentUsers,
  ]);

  // 식사 종료
  const handleEndMeal = () => {
    updateTableState({
      currentUsers: 0,
      menu: menuOptions[0].name,
      price: menuOptions[0].price,
      visitTime: null,
      basicChecklist: Object.fromEntries(
        basicItems.map((item) => [item.id, false])
      ),
      sideChecklist: Object.fromEntries(
        sideItems.map((item) => [item.id, false])
      ),
      servingCounts: { rice: 0, soup: 0 },
    });
    setOpen(false);
  };

  // **추가**: basic & currentUsers > 0 일 때 펄스 애니메이션
  const pulseClass =
    getServingStage() === 'basic' && currentUsers > 0
      ? 'animate-pulse bg-gray-300'
      : '';
  if (!data) return <div>loading...</div>;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Card
          className={cn(
            // 모바일/태블릿 기본 스타일
            'relative p-2 w-32 h-32 xl:h-36 text-sm transition-shadow cursor-pointer',
            // 데스크톱(md) 이상에서 오버라이드
            'lg:p-2 xl:w-44 xl:h-36 2xl:w-56 2xl:h-40 xl:text-base hover:shadow-lg',
            getCardBackgroundClass(),
            getTextColorClass(),
            pulseClass
          )}
        >
          {/* 테이블 번호 */}
          <div className='absolute top-2 left-2 text-xs md:text-sm font-bold bg-white px-2 py-1 rounded text-black'>
            #{id}
          </div>

          {/* 인원 표시 (크기만 반응형) */}
          <div className='flex items-center gap-1 md:gap-2 mb-3 absolute top-2 right-2'>
            <Users
              className={cn(getTextColorClass(), 'w-4 h-4 2xl:w-5 2xl:h-5')}
            />
            <div className='flex items-baseline gap-1'>
              <span className='text-base md:text-lg xl:text-xl font-bold'>
                {currentUsers}
              </span>
              <span className={cn(getTextColorClass(), 'text-xs md:text-sm')}>
                {`/ ${capacity}`}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className='mt-9 2xl:mt-10 w-full bg-gray-200 h-2 rounded-full mb-2'>
            <div
              className={cn('h-full rounded-full', getProgressColorClass())}
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>

          {/* --- 모바일에서는 숨김, 데스크톱에서만 표시 --- */}
          <div className='flex justify-between items-center mb-1'>
            <span
              className={cn(
                getTextColorClass(),
                'text-sm font-semibold hidden 2xl:block'
              )}
            >
              메뉴
            </span>
            <span className={cn(getTextColorClass(), 'text-xs md:text-sm')}>
              {menu || '미선택'}
            </span>
            <span className='block xl:hidden'>
              {(price * currentUsers).toLocaleString()}원
            </span>
          </div>

          <div className='flex justify-between items-center mb-1'>
            <span
              className={cn(
                getTextColorClass(),
                'text-sm font-semibold hidden 2xl:block'
              )}
            >
              서빙 상태
            </span>
            <span className={cn(getTextColorClass(), 'text-xs md:text-sm')}>
              {getStatusDisplay()}
            </span>
          </div>

          {/* 금액 표시도 예: 모바일/태블릿에서는 글자 크기 작게 */}
          <div className='flex justify-end items-center'>
            <span className='hidden xl:block text-xs md:text-base font-bold'>
              {calculateTotalPrice().toLocaleString()}원
            </span>
          </div>
        </Card>
      </DialogTrigger>

      {/* 모달 내용은 그대로 유지 */}
      <DialogContent className='max-w-4xl' closeButton={true}>
        <DialogHeader>
          <DialogTitle>테이블 {id}번</DialogTitle>
        </DialogHeader>

        <div className='grid grid-cols-2 gap-6'>
          {/* 왼쪽: 테이블 정보 */}
          <table className='w-full border-collapse'>
            <tbody>
              <tr className='border rounded-lg overflow-hidden'>
                <td className='font-medium bg-gray-50 p-3 w-1/4 text-sm xl:text-base'>
                  인원
                </td>
                <td className='p-3'>
                  <div className='flex items-center justify-between'>
                    <span>
                      {currentUsers} / {capacity}
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
                        disabled={currentUsers >= capacity}
                        className='bg-blue-500 hover:bg-blue-600 text-white'
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className='border rounded-lg overflow-hidden'>
                <td className='font-medium bg-gray-50 p-3  text-sm xl:text-base'>
                  메뉴
                </td>
                <td className='p-3'>
                  <Select
                    defaultValue={menuOptions[0].name}
                    onValueChange={(value) => {
                      const selected = menuOptions.find(
                        (m) => m.name === value
                      );
                      if (selected) {
                        updateTableState({
                          menu: selected.name,
                          price: selected.price,
                        });
                      }
                    }}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='메뉴를 선택하세요' />
                    </SelectTrigger>
                    <SelectContent>
                      {menuOptions.map((m) => (
                        <SelectItem key={m.name} value={m.name}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
              <tr className='border rounded-lg overflow-hidden'>
                <td className='font-medium bg-gray-50 p-3  text-sm xl:text-base'>
                  방문 시간
                </td>
                <td className='p-3'>{formatDate(visitTime)}</td>
              </tr>
              <tr className='border rounded-lg overflow-hidden'>
                <td className='font-medium bg-gray-50 p-3  text-sm xl:text-base'>
                  가격
                </td>
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
          <div className='space-y-1 xl:space-y-6'>
            {/* 기본 세팅 */}
            <table className='w-full border-collapse'>
              <thead>
                <tr>
                  <th
                    className='text-left py-1 px-2 xl:p-3 bg-gray-50 border rounded-t-lg font-medium'
                    colSpan={6}
                  >
                    <div className='flex justify-between items-center'>
                      <span className='text-sm xl:text-base'>기본 세팅</span>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          const allChecked = Object.fromEntries(
                            basicItems.map((item) => [item.id, true])
                          );
                          updateTableState({
                            basicChecklist: allChecked,
                          });
                        }}
                      >
                        모두 완료
                      </Button>
                    </div>
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
                              className={cn(
                                'p-1 xl:p-3 border-b cursor-pointer hover:bg-gray-50  text-sm xl:text-base',
                                basicChecklist[item.id] ? 'bg-green-100' : ''
                              )}
                              onClick={() => {
                                updateTableState({
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
                              className={cn(
                                'py-2 xl:p-3 w-12 text-center border-b',
                                basicChecklist[item.id] ? 'bg-green-100' : '',
                                colIndex < 2 ? 'border-r' : ''
                              )}
                            >
                              <Checkbox
                                id={`basic-${item.id}`}
                                checked={basicChecklist[item.id]}
                                onCheckedChange={(checked) => {
                                  updateTableState({
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

            {/* 밑반찬 */}
            <table className='w-full border-collapse'>
              <thead>
                <tr>
                  <th
                    className='text-left py-1 px-2 xl:p-3 bg-gray-50 border rounded-t-lg font-medium'
                    colSpan={6}
                  >
                    <div className='flex justify-between items-center'>
                      <span className='text-sm xl:text-base'>
                        밑반찬 ({sideItems.length})
                      </span>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          const allChecked = Object.fromEntries(
                            sideItems.map((item) => [item.id, true])
                          );
                          updateTableState({
                            sideChecklist: allChecked,
                          });
                        }}
                        disabled={!Object.values(basicChecklist).every(Boolean)}
                      >
                        모두 완료
                      </Button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody
                className={
                  !Object.values(basicChecklist).every(Boolean)
                    ? 'opacity-50'
                    : ''
                }
              >
                {Array.from({ length: Math.ceil(sideItems.length / 3) }).map(
                  (_, rowIndex) => (
                    <tr key={rowIndex}>
                      {sideItems
                        .slice(rowIndex * 3, rowIndex * 3 + 3)
                        .map((item, colIndex) => (
                          <React.Fragment key={item.id}>
                            <td
                              className={cn(
                                'p-1 xl:p-3 border-b text-sm xl:text-base',
                                sideChecklist[item.id] ? 'bg-green-100' : '',
                                Object.values(basicChecklist).every(Boolean)
                                  ? 'cursor-pointer hover:bg-gray-50'
                                  : 'cursor-not-allowed'
                              )}
                              onClick={() => {
                                // basic 세팅 전에는 클릭 불가
                                if (
                                  !Object.values(basicChecklist).every(Boolean)
                                )
                                  return;
                                updateTableState({
                                  sideChecklist: {
                                    ...sideChecklist,
                                    [item.id]: !sideChecklist[item.id],
                                  },
                                });
                              }}
                            >
                              {item.label}
                            </td>
                            <td
                              className={cn(
                                'py-2 xl:p-3 w-12 text-center border-b',
                                sideChecklist[item.id] ? 'bg-green-100' : '',
                                colIndex < 2 ? 'border-r' : ''
                              )}
                            >
                              <Checkbox
                                id={`side-${item.id}`}
                                checked={sideChecklist[item.id]}
                                disabled={
                                  !Object.values(basicChecklist).every(Boolean)
                                }
                                onCheckedChange={(checked) => {
                                  updateTableState({
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

            {/* 밥과 국 */}
            <table className='w-full border-collapse'>
              <thead>
                <tr>
                  <th
                    className='text-left py-1 px-2 xl:p-3 bg-gray-50 border rounded-t-lg font-medium'
                    colSpan={2}
                  >
                    <div className='flex justify-between items-center'>
                      <span className='text-sm xl:text-base'>밥과 국</span>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          updateTableState({
                            servingCounts: {
                              ...servingCounts,
                              rice: currentUsers,
                              soup: currentUsers,
                            },
                          });
                        }}
                        disabled={
                          !Object.values(sideChecklist).every(Boolean) ||
                          currentUsers === 0
                        }
                      >
                        모두 완료
                      </Button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody
                className={
                  !Object.values(sideChecklist).every(Boolean)
                    ? 'opacity-50'
                    : ''
                }
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
                    <td className='px-3 xl:p-3 border-b font-medium text-sm xl:text-base'>
                      {item.label}
                    </td>
                    <td className='p-1 xl:p-3 border-b'>
                      <div className='flex items-center justify-between'>
                        <span>
                          {servingCounts[item.id as keyof typeof servingCounts]}
                          / {currentUsers}
                        </span>
                        <div className='flex items-center gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleServingDecrement(item.id)}
                            disabled={
                              !Object.values(sideChecklist).every(Boolean) ||
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
                              !Object.values(sideChecklist).every(Boolean) ||
                              servingCounts[
                                item.id as keyof typeof servingCounts
                              ] >= currentUsers
                            }
                            className='bg-blue-500 hover:bg-blue-600 text-white'
                          >
                            +
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => {
                              updateTableState({
                                servingCounts: {
                                  ...servingCounts,
                                  [item.id]: currentUsers,
                                },
                              });
                            }}
                            disabled={
                              !Object.values(sideChecklist).every(Boolean) ||
                              currentUsers === 0
                            }
                          >
                            완료
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

        <DialogFooter className='mt-2 xl:mt-6 flex flex-col gap-2'>
          <Button
            className='bg-blue-500 hover:bg-blue-600 text-white w-full text-base font-semibold'
            onClick={handleUpdate}
          >
            등록
          </Button>
          <Button
            variant='destructive'
            className='w-full text-base font-semibold'
            onClick={handleEndMeal}
            disabled={currentUsers === 0}
          >
            식사 종료
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Table;
