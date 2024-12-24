export interface TableData {
  id: number;
  currentUsers: number;
  capacity: number;
  menu: string;
  price: number;
  visitTime: Date | null;
  basicChecklist: { [key: string]: boolean };
  sideChecklist: { [key: string]: boolean };
  servingCounts: {
    rice: number;
    soup: number;
  };
}

export type TableStatus = 'empty' | 'in-use' | 'reserved';
