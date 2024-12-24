import { TableData } from '../types/table';

type PickTableData = Pick<
  TableData,
  'id' | 'capacity' | 'currentUsers' | 'menu' | 'price' | 'visitTime'
>;

export const mockTables: PickTableData[] = [
  {
    id: 1,
    capacity: 4,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
  },
  {
    id: 2,
    capacity: 4,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
  },
  {
    id: 3,
    capacity: 4,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
  },
  {
    id: 4,
    capacity: 4,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
  },
  {
    id: 5,
    capacity: 6,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
  },
  {
    id: 6,
    capacity: 6,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
  },
  {
    id: 7,
    capacity: 6,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
  },
  {
    id: 8,
    capacity: 6,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
  },
  {
    id: 9,
    capacity: 6,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
  },
  {
    id: 10,
    capacity: 4,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
  },
  {
    id: 11,
    capacity: 4,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
  },
  {
    id: 12,
    capacity: 4,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
  },
  {
    id: 13,
    capacity: 4,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
  },
  {
    id: 14,
    capacity: 6,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
  },
  {
    id: 15,
    capacity: 6,
    currentUsers: 0,
    price: 10000,
    menu: '점심특선',
    visitTime: null,
  },
];

export const getTableData = (id: number): PickTableData | undefined => {
  return mockTables.find((table) => table.id === id);
};
