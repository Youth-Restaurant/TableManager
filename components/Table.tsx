'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { SideDish, TableData } from '@/types/table';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface TableProps {
  data: TableData;
  handleTableUpdate: (tableNumber: number, updates: Partial<TableData>) => void;
  selectedSideDishes: SideDish[];
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

// (예시) 체크리스트 항목
const basicItems = [
  { id: 'tablecloth', label: '테이블보' },
  { id: 'cups', label: '물컵' },
  { id: 'water', label: '물통' },
  { id: 'tissue', label: '티슈' },
  { id: 'wetTissue', label: '물티슈' },
  { id: 'spoons', label: '수저' },
];

const riceAndSoupItems = [
  { id: 'rice', label: '밥' },
  { id: 'soup', label: '국' },
];

const Table: React.FC<TableProps> = ({ data, handleTableUpdate, selectedSideDishes }) => {
  const [open, setOpen] = useState(false);
  // 부모에서 전달받은 sideDishes를 로컬에서 수정하기 위해 별도 상태로 관리합니다.
  const [sideDishes, setSideDishes] = useState<SideDish[]>(selectedSideDishes);

  // data에서 필요한 값 추출
  const {
    id,
    currentUsers,
    capacity,
    menu,
    price,
    visitTime,
    basicChecklist,
    servingCounts,
  } = data;

  // 부모로부터 전달받은 sideDishes가 변경될 경우 로컬 상태 동기화
  useEffect(() => {
    setSideDishes(selectedSideDishes);
  }, [selectedSideDishes]);

  // 테이블 업데이트 헬퍼
  const updateTableState = useCallback(
    (updates: Partial<TableData>) => {
      handleTableUpdate(id, updates);
    },
    [id, handleTableUpdate]
  );

  // 인원 증가/감소
  const handleIncrement = useCallback(() => {
    if (currentUsers < capacity) {
      updateTableState({ 
        currentUsers: currentUsers + 1,
        servingCounts: { rice: 0, soup: 0 } // 밥과 국 초기화
      });
    }
  }, [currentUsers, capacity, updateTableState]);

  const handleDecrement = useCallback(() => {
    if (currentUsers > 0) {
      updateTableState({ 
        currentUsers: currentUsers - 1,
        servingCounts: { rice: 0, soup: 0 } // 밥과 국 초기화
      });
    }
  }, [currentUsers, updateTableState]);

  // 밥/국 서빙 횟수 조절
  const handleServingIncrement = useCallback(
    (itemId: string) => {
      if (servingCounts[itemId as keyof typeof servingCounts] < currentUsers) {
        updateTableState({
          servingCounts: {
            ...servingCounts,
            [itemId]: servingCounts[itemId as keyof typeof servingCounts] + 1,
          },
        });
      }
    },
    [servingCounts, currentUsers, updateTableState]
  );

  const handleServingDecrement = useCallback(
    (itemId: string) => {
      if (servingCounts[itemId as keyof typeof servingCounts] > 0) {
        updateTableState({
          servingCounts: {
            ...servingCounts,
            [itemId]: servingCounts[itemId as keyof typeof servingCounts] - 1,
          },
        });
      }
    },
    [servingCounts, updateTableState]
  );

  // 모달 열림/닫힘 처리
  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
  }, []);

  // 등록 버튼 클릭 시 업데이트 (비동기 작업이 없으므로 async 제거)
  const handleUpdate = () => {
    const newVisitTime = currentUsers > 0 && !visitTime ? new Date() : visitTime || null;
    updateTableState({
      visitTime: newVisitTime,
      currentUsers,
      menu,
      price,
      basicChecklist,
      sideChecklist: sideDishes,
      servingCounts,
    });
    setOpen(false);
  };

  // 총 금액 계산
  const totalPrice = useMemo(() => price * currentUsers, [price, currentUsers]);

  // 체크리스트 완료 여부 계산
  const isBasicChecklistComplete = useMemo(() => {
    return Object.values(basicChecklist).every(Boolean);
  }, [basicChecklist]);

  const isSideChecklistComplete = useMemo(() => {
    return sideDishes.every((dish) => dish.checked);
  }, [sideDishes]);

  const isRiceAndSoupComplete = useMemo(() => {
    return servingCounts.rice === currentUsers && servingCounts.soup === currentUsers;
  }, [servingCounts, currentUsers]);

  // 서빙 단계에 따른 상태 구분 (basic → side → main → complete)
  const servingStage = useMemo(() => {
    if (!isBasicChecklistComplete) return 'basic';
    if (!isSideChecklistComplete) return 'side';
    if (!isRiceAndSoupComplete) return 'main';
    return 'complete';
  }, [isBasicChecklistComplete, isSideChecklistComplete, isRiceAndSoupComplete]);

  // 전체 단계 및 완료 단계 계산 (기본 세팅 + 밑반찬 + 밥/국 각 currentUsers수 만큼)
  const totalSteps = useMemo(() => {
    return basicItems.length + sideDishes.length + 2 * currentUsers;
  }, [currentUsers, sideDishes.length]);

  const doneSteps = useMemo(() => {
    const basicDone = Object.values(basicChecklist).filter(Boolean).length;
    const sideDone = sideDishes.filter((dish) => dish.checked).length;
    const mainDone = servingCounts.rice + servingCounts.soup;
      return basicDone + sideDone + mainDone;
  }, [basicChecklist, sideDishes, servingCounts]);

  // 진행률 및 색상 계산
  const progressPercentage = useMemo(() => {
    return totalSteps === 0 ? 0 : Math.floor((doneSteps / totalSteps) * 100);
  }, [doneSteps, totalSteps]);
  
  const progressColorClass = useMemo(() => {
    if (progressPercentage === 100) return 'bg-green-500';
    if (progressPercentage >= 80) return 'bg-blue-600';
    if (progressPercentage >= 50) return 'bg-yellow-500';
    if (progressPercentage >= 1) return 'bg-red-500';
    return 'bg-gray-300';
  }, [progressPercentage]);

  // 카드 배경 및 글자색 (서빙 단계에 따라 다름)
  const cardBackgroundClass = useMemo(() => {
    switch (servingStage) {
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
  }, [servingStage]);

  const textColorClass = useMemo(() => {
    return servingStage === 'basic' ? 'text-black' : 'text-white';
  }, [servingStage]);

  // 서빙 상태 표시 (문구 및 JSX)
  const statusDisplay = useMemo(() => {
    switch (servingStage) {
      case 'basic':
        return (
          <span>
            기본 세팅: {Object.values(basicChecklist).filter(Boolean).length} / {basicItems.length}
          </span>
        );
      case 'side':
        return (
          <span>
            밑반찬: {sideDishes.filter((dish) => dish.checked).length} / {sideDishes.length}
          </span>
        );
      case 'main':
        return (
          <div className="flex gap-3">
            <span>
              밥: <span className="font-bold">{servingCounts.rice}</span> / {currentUsers}
            </span>
            <span>
              국: <span className="font-bold">{servingCounts.soup}</span> / {currentUsers}
            </span>
          </div>
        );
      case 'complete':
        return <span>서빙 완료</span>;
      default:
        return null;
    }
  }, [servingStage, basicChecklist, sideDishes, servingCounts, currentUsers]);

  // 식사 종료 시 테이블 초기화
  const handleEndMeal = useCallback(() => {
    updateTableState({
      currentUsers: 0,
      menu: menuOptions[0].name,
      price: menuOptions[0].price,
      visitTime: null,
      basicChecklist: Object.fromEntries(basicItems.map((item) => [item.id, false])),
      sideChecklist: sideDishes.map((dish) => ({ ...dish, checked: false })),
      servingCounts: { rice: 0, soup: 0 },
    });
    setSideDishes((prev) => prev.map((dish) => ({ ...dish, checked: false })));
    setOpen(false);
  }, [updateTableState, sideDishes]);

  // 기본 세팅 단계일 때 인원이 1명 이상이면 펄스 애니메이션 적용
  const pulseClass = useMemo(() => {
    return servingStage === 'basic' && currentUsers > 0 ? 'animate-pulse bg-gray-300' : '';
  }, [servingStage, currentUsers]);

  if (!data) return <div>loading...</div>;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Card
          className={cn(
            'relative p-2 w-32 h-32 xl:h-36 text-sm transition-shadow cursor-pointer',
            'lg:p-2 xl:w-44 xl:h-36 2xl:w-56 2xl:h-40 xl:text-base hover:shadow-lg',
            cardBackgroundClass,
            textColorClass,
            pulseClass
          )}
        >
          {/* 테이블 번호 */}
          <div className="absolute top-2 left-2 text-xs md:text-sm font-bold bg-white px-2 py-1 rounded text-black">
            #{id}
          </div>
          {/* 인원 표시 */}
          <div className="flex items-center gap-1 md:gap-2 mb-3 absolute top-2 right-2">
            <Users className={cn(textColorClass, 'w-4 h-4 2xl:w-5 2xl:h-5')} />
            <div className="flex items-baseline gap-1">
              <span className="text-base md:text-lg xl:text-xl font-bold">{currentUsers}</span>
              <span className={cn(textColorClass, 'text-xs md:text-sm')}>{`/ ${capacity}`}</span>
            </div>
          </div>
          {/* 진행률 바 */}
          <div className="mt-9 2xl:mt-10 w-full bg-gray-200 h-2 rounded-full mb-2">
            <div
              className={cn('h-full rounded-full', progressColorClass)}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {/* 메뉴 및 상태 표시 */}
          <div className="flex justify-between items-center mb-1">
            <span className={cn(textColorClass, 'text-sm font-semibold hidden 2xl:block')}>메뉴</span>
            <span className={cn(textColorClass, 'text-xs md:text-sm')}>{menu || '미선택'}</span>
            <span className="block xl:hidden">{totalPrice.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className={cn(textColorClass, 'text-sm font-semibold hidden 2xl:block')}>서빙 상태</span>
            <span className={cn(textColorClass, 'text-xs md:text-sm')}>{statusDisplay}</span>
          </div>
          <div className="flex justify-end items-center">
            <span className="hidden xl:block text-xs md:text-base font-bold">{totalPrice.toLocaleString()}원</span>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-4xl" closeButton={true}>
        <DialogHeader>
          <DialogTitle>테이블 {id}번</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* 왼쪽: 테이블 정보 */}
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border rounded-lg overflow-hidden">
                <td className="font-medium bg-gray-50 p-3 w-1/4 text-sm xl:text-base">인원</td>
                <td className="p-3">
                  <div className="flex items-center justify-between">
                    <span>
                      {currentUsers} / {capacity}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleDecrement} disabled={currentUsers <= 0}>
                        -
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleIncrement}
                        disabled={currentUsers >= capacity}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </td>
              </tr>
              <tr className="border rounded-lg overflow-hidden">
                <td className="font-medium bg-gray-50 p-3 text-sm xl:text-base">메뉴</td>
                <td className="p-3">
                  <Select
                    defaultValue={menuOptions[0].name}
                    onValueChange={(value) => {
                      const selected = menuOptions.find((m) => m.name === value);
                      if (selected) {
                        updateTableState({ menu: selected.name, price: selected.price });
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="메뉴를 선택하세요" />
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
              <tr className="border rounded-lg overflow-hidden">
                <td className="font-medium bg-gray-50 p-3 text-sm xl:text-base">방문 시간</td>
                <td className="p-3">{formatDate(visitTime)}</td>
              </tr>
              <tr className="border rounded-lg overflow-hidden">
                <td className="font-medium bg-gray-50 p-3 text-sm xl:text-base">가격</td>
                <td className="p-3">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">
                      {price.toLocaleString()}원 × {currentUsers}명
                    </div>
                    <Input
                      type="text"
                      value={`${totalPrice.toLocaleString()}원`}
                      className="w-full font-medium"
                      readOnly
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* 오른쪽: 서빙 체크리스트 */}
          <div className="space-y-1 xl:space-y-6">
            {/* 기본 세팅 */}
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-1 px-2 xl:p-3 bg-gray-50 border rounded-t-lg font-medium" colSpan={6}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm xl:text-base">기본 세팅</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const allChecked = Object.fromEntries(basicItems.map((item) => [item.id, true]));
                          updateTableState({ basicChecklist: allChecked });
                        }}
                      >
                        모두 완료
                      </Button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.ceil(basicItems.length / 3) }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {basicItems.slice(rowIndex * 3, rowIndex * 3 + 3).map((item, colIndex) => (
                      <React.Fragment key={item.id}>
                        <td
                          className={cn(
                            'p-1 xl:p-3 border-b cursor-pointer hover:bg-gray-50 text-sm xl:text-base',
                            basicChecklist[item.id] ? 'bg-green-100' : ''
                          )}
                          onClick={() =>
                            updateTableState({
                              basicChecklist: { ...basicChecklist, [item.id]: !basicChecklist[item.id] },
                            })
                          }
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
                            onCheckedChange={(checked) =>
                              updateTableState({
                                basicChecklist: { ...basicChecklist, [item.id]: checked === true },
                              })
                            }
                          />
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 밑반찬 */}
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-1 px-2 xl:p-3 bg-gray-50 border rounded-t-lg font-medium" colSpan={6}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm xl:text-base">밑반찬 ({sideDishes.length})</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSideDishes(sideDishes.map((dish) => ({ ...dish, checked: true })))}
                        disabled={!isBasicChecklistComplete}
                      >
                        모두 완료
                      </Button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className={!isBasicChecklistComplete ? 'opacity-50' : ''}>
                {Array.from({ length: Math.ceil(sideDishes.length / 3) }).map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {sideDishes.slice(rowIndex * 3, rowIndex * 3 + 3).map((item, colIndex) => (
                      <React.Fragment key={item.id}>
                        <td
                          className={cn(
                            'p-1 xl:p-3 border-b text-sm xl:text-base',
                            item.checked ? 'bg-green-100' : '',
                            isBasicChecklistComplete ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed'
                          )}
                          onClick={() => {
                            if (!isBasicChecklistComplete) return;
                            setSideDishes((prev) =>
                              prev.map((dish) =>
                                dish.id === item.id ? { ...dish, checked: !dish.checked } : dish
                              )
                            );
                          }}
                        >
                          {item.label}
                        </td>
                        <td
                          className={cn(
                            'py-2 xl:p-3 w-12 text-center border-b',
                            item.checked ? 'bg-green-100' : '',
                            colIndex < 2 ? 'border-r' : ''
                          )}
                        >
                          <Checkbox
                            id={`side-${item.id}`}
                            checked={item.checked}
                            disabled={!isBasicChecklistComplete}
                            onCheckedChange={(checked) =>
                              setSideDishes((prev) =>
                                prev.map((dish) =>
                                  dish.id === item.id ? { ...dish, checked: checked === true } : dish
                                )
                              )
                            }
                          />
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 밥과 국 */}
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th
                    className="text-left py-1 px-2 xl:p-3 bg-gray-50 border rounded-t-lg font-medium"
                    colSpan={2}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm xl:text-base">밥과 국</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          updateTableState({
                            servingCounts: {
                              ...servingCounts,
                              rice: currentUsers,
                              soup: currentUsers,
                            },
                          });
                        }}
                        disabled={!sideDishes.every((dish) => dish.checked) || currentUsers === 0}
                      >
                        모두 완료
                      </Button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className={!sideDishes.every((dish) => dish.checked) ? 'opacity-50' : ''}>
                {riceAndSoupItems.map((item) => (
                  <tr
                    key={item.id}
                    className={
                      servingCounts[item.id as keyof typeof servingCounts] >= 1 && servingCounts[item.id as keyof typeof servingCounts] === currentUsers ? 'bg-green-100' : ''
                    }
                  >
                    <td className="px-3 xl:p-3 border-b font-medium text-sm xl:text-base">{item.label}</td>
                    <td className="p-1 xl:p-3 border-b">
                      <div className="flex items-center justify-between">
                        <span>
                          {servingCounts[item.id as keyof typeof servingCounts]} / {currentUsers}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleServingDecrement(item.id)}
                            disabled={
                              !sideDishes.every((dish) => dish.checked) ||
                              servingCounts[item.id as keyof typeof servingCounts] <= 0
                            }
                          >
                            -
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleServingIncrement(item.id)}
                            disabled={
                              !sideDishes.every((dish) => dish.checked) ||
                              servingCounts[item.id as keyof typeof servingCounts] >= currentUsers
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            +
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              updateTableState({
                                servingCounts: {
                                  ...servingCounts,
                                  [item.id]: currentUsers,
                                },
                              });
                            }}
                            disabled={!sideDishes.every((dish) => dish.checked) || currentUsers === 0}
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

        <DialogFooter className="mt-2 xl:mt-6 flex flex-col gap-2">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white w-full text-base font-semibold"
            onClick={handleUpdate}
          >
            등록
          </Button>
          <Button
            variant="destructive"
            className="w-full text-base font-semibold"
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
