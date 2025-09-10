const sequences: Record<number, number> = {};

export function generateOrderNumber(date: Date = new Date()): string {
  const year = date.getFullYear();
  const seq = (sequences[year] || 0) + 1;
  sequences[year] = seq;
  return `ORD-${year}-${String(seq).padStart(4, '0')}`;
}
