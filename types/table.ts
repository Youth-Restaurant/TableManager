export interface TableData {
  id: number;
  capacity: number;
  currentUsers: number;
  price: number;
  menu: string;
  visitTime: Date | null;
  isReserved: boolean;
}

export type TableStatus = 'empty' | 'in-use' | 'reserved';
