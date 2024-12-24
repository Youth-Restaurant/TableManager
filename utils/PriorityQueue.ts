interface TableData {
  number: number;
  visitTime: string | null;
  currentUsers: number;
  // ... other table properties
}

class PriorityQueue {
  private heap: TableData[];

  constructor() {
    this.heap = [];
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  private getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  private swap(index1: number, index2: number): void {
    const temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp;
  }

  private compareVisitTime(a: TableData, b: TableData): number {
    if (!a.visitTime) return 1;
    if (!b.visitTime) return -1;
    return new Date(a.visitTime).getTime() - new Date(b.visitTime).getTime();
  }

  private heapifyUp(): void {
    let currentIndex = this.heap.length - 1;
    while (currentIndex > 0) {
      const parentIndex = this.getParentIndex(currentIndex);
      if (
        this.compareVisitTime(this.heap[currentIndex], this.heap[parentIndex]) <
        0
      ) {
        this.swap(currentIndex, parentIndex);
        currentIndex = parentIndex;
      } else {
        break;
      }
    }
  }

  private heapifyDown(): void {
    let currentIndex = 0;
    while (this.getLeftChildIndex(currentIndex) < this.heap.length) {
      let smallestChildIndex = this.getLeftChildIndex(currentIndex);
      const rightChildIndex = this.getRightChildIndex(currentIndex);

      if (
        rightChildIndex < this.heap.length &&
        this.compareVisitTime(
          this.heap[rightChildIndex],
          this.heap[smallestChildIndex]
        ) < 0
      ) {
        smallestChildIndex = rightChildIndex;
      }

      if (
        this.compareVisitTime(
          this.heap[currentIndex],
          this.heap[smallestChildIndex]
        ) > 0
      ) {
        this.swap(currentIndex, smallestChildIndex);
        currentIndex = smallestChildIndex;
      } else {
        break;
      }
    }
  }

  enqueue(table: TableData): void {
    if (table.currentUsers > 0 && table.visitTime) {
      this.heap.push(table);
      this.heapifyUp();
    }
  }

  dequeue(): TableData | null {
    if (this.isEmpty()) {
      return null;
    }
    const min = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown();
    }
    return min;
  }

  peek(): TableData | null {
    return this.isEmpty() ? null : this.heap[0];
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  size(): number {
    return this.heap.length;
  }

  getItems(): TableData[] {
    return [...this.heap];
  }
}

export default PriorityQueue;
