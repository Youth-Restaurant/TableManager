export interface SideDish {
  id: string;
  label: string;
  checked: boolean;
}

export interface TableData {
  id: number;
  status: TableStatus;
  currentUsers: number;
  capacity: number;
  menu: string;
  price: number;
  visitTime: Date | null;
  basicChecklist: { [key: string]: boolean };
  sideChecklist: SideDish[];
  servingCounts: {
    rice: number;
    soup: number;
  };
}

export type TableStatus = 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'FINISHED';
