import { Language, Product, StockStatus } from '../types';

export function getStockStatus(product: Product): StockStatus {
  if (product.quantity <= 0) return 'out';
  if (product.quantity <= product.lowStockThreshold) return 'low';
  return 'ok';
}

export function sortForReorder(products: Product[]): Product[] {
  return [...products]
    .filter((p) => p.quantity <= p.lowStockThreshold)
    .sort((a, b) => {
      const aOut = a.quantity <= 0 ? 0 : 1;
      const bOut = b.quantity <= 0 ? 0 : 1;
      if (aOut !== bOut) return aOut - bOut;
      return a.quantity - b.quantity || a.name.localeCompare(b.name);
    });
}

export function createId(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function formatDateTime(iso: string, lang: Language): string {
  try {
    const date = new Date(iso);
    return date.toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function isSameLocalDay(iso: string, refDate = new Date()): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === refDate.getFullYear() &&
    d.getMonth() === refDate.getMonth() &&
    d.getDate() === refDate.getDate()
  );
}

export function isWithinLastDays(iso: string, days: number): boolean {
  const d = new Date(iso).getTime();
  const cutoff = Date.now() - days * 86400 * 1000;
  return d >= cutoff;
}
