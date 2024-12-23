import { TableData } from '../types/table';

export const mockTables: TableData[] = [
  {
    id: 1,
    capacity: 4,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
    isReserved: false,
  },
  {
    id: 2,
    capacity: 4,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
    isReserved: false,
  },
  {
    id: 4,
    capacity: 4,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
    isReserved: false,
  },
  {
    id: 5,
    capacity: 6,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
    isReserved: false,
  },
  {
    id: 6,
    capacity: 6,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
    isReserved: false,
  },
  {
    id: 7,
    capacity: 6,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
    isReserved: false,
  },
  {
    id: 8,
    capacity: 6,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
    isReserved: false,
  },
  {
    id: 9,
    capacity: 6,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
    isReserved: false,
  },
  {
    id: 10,
    capacity: 4,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
    isReserved: false,
  },
  {
    id: 11,
    capacity: 4,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
    isReserved: false,
  },
  {
    id: 12,
    capacity: 4,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
    isReserved: false,
  },
  {
    id: 13,
    capacity: 4,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
    isReserved: false,
  },
  {
    id: 14,
    capacity: 6,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
    isReserved: false,
  },
  {
    id: 15,
    capacity: 6,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
    isReserved: false,
  },
];

export const getTableData = (id: number): TableData | undefined => {
  return mockTables.find((table) => table.id === id);
};