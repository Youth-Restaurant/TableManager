// write code

import { TableData } from '@/types/table';

class TableManager {
  private tables: Map<number, TableData>;

  constructor(tables: TableData[]) {
    this.tables = new Map();
    tables.forEach((table) => {
      this.tables.set(table.id, table);
    });
  }

  // Initialize a table with default data
  initTable(tableNumber: number, capacity: number) {
    const defaultData: TableData = {
      id: tableNumber,
      status: 'AVAILABLE',
      capacity: capacity,
      currentUsers: 0,
      menu: '점심특선',
      price: 10000,
      visitTime: null,
      basicChecklist: {
        tablecloth: false,
        cups: false,
        water: false,
        tissue: false,
        wetTissue: false,
        spoons: false,
      },
      sideChecklist: {
        kimchi: false,
        radish: false,
      },
      servingCounts: {
        rice: 0,
        soup: 0,
      },
    };

    this.tables.set(tableNumber, defaultData);
  }

  // Get table data
  getTable(tableNumber: number): TableData | undefined {
    return this.tables.get(tableNumber);
  }

  // Update table data
  updateTable(tableNumber: number, updates: Partial<TableData>) {
    const currentData = this.tables.get(tableNumber);
    if (!currentData) return;

    this.tables.set(tableNumber, {
      ...currentData,
      ...updates,
    });
  }

  // Get all tables
  getTables(): TableData[] {
    return Array.from(this.tables.values());
  }

  // Reset table to default state
  resetTable(tableNumber: number) {
    const table = this.tables.get(tableNumber);
    if (!table) return;

    this.initTable(tableNumber, table.capacity);
  }
}

export default TableManager;
