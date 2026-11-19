export type Language = 'en' | 'hi';

export type UnitType = 'pcs' | 'kg' | 'litre' | 'packet';

export type StockStatus = 'ok' | 'low' | 'out';

export type HistoryType =
  | 'initial'
  | 'received'
  | 'sold'
  | 'quick_add'
  | 'quick_remove'
  | 'edited';

export interface StockHistoryEntry {
  id: string;
  timestamp: string;
  type: HistoryType;
  delta: number;
  resultingQuantity: number;
  note?: string;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  unit: UnitType;
  lowStockThreshold: number;
  price?: number;
  updatedAt: string;
  history: StockHistoryEntry[];
}

export interface SaleRecord {
  id: string;
  productId: string;
  productName: string;
  unit: UnitType;
  quantity: number;
  unitPrice?: number;
  totalAmount?: number;
  timestamp: string;
}

export interface DemoBooking {
  id: string;
  shopName: string;
  ownerName: string;
  phone: string;
  locality: string;
  createdAt: string;
}

export type YesNo = 'yes' | 'no';
export type YesMaybeNo = 'yes' | 'maybe' | 'no';

export interface PilotFeedback {
  id: string;
  easyToAdd: YesNo;
  useDaily: YesMaybeNo;
  pay199: YesMaybeNo;
  comment: string;
  createdAt: string;
}

export type AppTab = 'dashboard' | 'reorder' | 'sales' | 'feedback' | 'founder';
