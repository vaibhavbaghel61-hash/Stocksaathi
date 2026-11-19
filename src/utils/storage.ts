import { DemoBooking, Language, PilotFeedback, Product, SaleRecord } from '../types';

export const STORAGE_KEYS = {
  PRODUCTS: 'stocksaathi_products_v1',
  SALES: 'stocksaathi_sales_v1',
  DEMOS: 'stocksaathi_demos_v1',
  FEEDBACK: 'stocksaathi_feedback_v1',
  LANG: 'stocksaathi_lang_v1',
  SEEN_WELCOME: 'stocksaathi_seen_welcome_v1',
};

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function loadProducts(): Product[] {
  return readJson<Product[]>(STORAGE_KEYS.PRODUCTS, []);
}

export function saveProducts(products: Product[]): void {
  writeJson(STORAGE_KEYS.PRODUCTS, products);
}

export function loadSales(): SaleRecord[] {
  return readJson<SaleRecord[]>(STORAGE_KEYS.SALES, []);
}

export function saveSales(sales: SaleRecord[]): void {
  writeJson(STORAGE_KEYS.SALES, sales);
}

export function loadDemos(): DemoBooking[] {
  return readJson<DemoBooking[]>(STORAGE_KEYS.DEMOS, []);
}

export function saveDemos(demos: DemoBooking[]): void {
  writeJson(STORAGE_KEYS.DEMOS, demos);
}

export function loadFeedback(): PilotFeedback[] {
  return readJson<PilotFeedback[]>(STORAGE_KEYS.FEEDBACK, []);
}

export function saveFeedback(feedback: PilotFeedback[]): void {
  writeJson(STORAGE_KEYS.FEEDBACK, feedback);
}

export function loadLanguage(): Language {
  const raw = window.localStorage.getItem(STORAGE_KEYS.LANG);
  return raw === 'hi' ? 'hi' : 'en';
}

export function saveLanguage(lang: Language): void {
  try {
    window.localStorage.setItem(STORAGE_KEYS.LANG, lang);
  } catch {
    // ignore
  }
}

export function loadHasSeenWelcome(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEYS.SEEN_WELCOME) === 'true';
  } catch {
    return false;
  }
}

export function saveHasSeenWelcome(seen: boolean): void {
  try {
    window.localStorage.setItem(STORAGE_KEYS.SEEN_WELCOME, seen ? 'true' : 'false');
  } catch {
    // ignore
  }
}

export function clearAllAppData(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    window.localStorage.removeItem(STORAGE_KEYS.SALES);
  } catch {
    // ignore
  }
}
