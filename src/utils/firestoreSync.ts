import { User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  DemoBooking,
  PilotFeedback,
  Product,
  SaleRecord,
  StockHistoryEntry,
} from '../types';

const MAX_NAME_LEN = 120;
const MAX_COMMENT_LEN = 500;
const MAX_HISTORY_ITEMS = 50;

function sanitizeStr(val: string, maxLen: number): string {
  return val.trim().slice(0, maxLen);
}

function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 128) || `id_${Date.now()}`;
}

function tsToIso(val: unknown): string {
  if (val instanceof Timestamp) {
    return val.toDate().toISOString();
  }
  if (typeof val === 'string') return val;
  return new Date().toISOString();
}

export async function syncUserProfile(user: User): Promise<void> {
  const path = `users/${user.uid}`;
  const ref = doc(db, 'users', user.uid);
  const email = sanitizeStr(user.email || 'user@gmail.com', 200);
  const displayName = sanitizeStr(
    user.displayName || email.split('@')[0] || 'Shopkeeper',
    MAX_NAME_LEN
  );

  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        email,
        displayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        email,
        displayName,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeUserProducts(
  userId: string,
  onData: (products: Product[]) => void
): Unsubscribe {
  const path = `users/${userId}/products`;
  const q = query(
    collection(db, 'users', userId, 'products'),
    where('ownerId', '==', userId)
  );
  return onSnapshot(
    q,
    (snap) => {
      const list: Product[] = snap.docs
        .map((d) => {
          const data = d.data();
          return {
            id: String(data.id || d.id),
            name: String(data.name || ''),
            quantity: typeof data.quantity === 'number' ? data.quantity : 0,
            unit: data.unit,
            lowStockThreshold:
              typeof data.lowStockThreshold === 'number' ? data.lowStockThreshold : 5,
            price: typeof data.price === 'number' ? data.price : undefined,
            updatedAt: tsToIso(data.updatedAt),
            history: Array.isArray(data.history)
              ? (data.history as StockHistoryEntry[])
              : [],
          };
        })
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export function subscribeUserSales(
  userId: string,
  onData: (sales: SaleRecord[]) => void
): Unsubscribe {
  const path = `users/${userId}/sales`;
  const q = query(
    collection(db, 'users', userId, 'sales'),
    where('ownerId', '==', userId)
  );
  return onSnapshot(
    q,
    (snap) => {
      const list: SaleRecord[] = snap.docs
        .map((d) => {
          const data = d.data();
          return {
            id: String(data.id || d.id),
            productId: String(data.productId || ''),
            productName: String(data.productName || ''),
            unit: data.unit,
            quantity: typeof data.quantity === 'number' ? data.quantity : 0,
            unitPrice: typeof data.unitPrice === 'number' ? data.unitPrice : undefined,
            totalAmount:
              typeof data.totalAmount === 'number' ? data.totalAmount : undefined,
            timestamp: tsToIso(data.createdAt),
          };
        })
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function createFirestoreProduct(
  userId: string,
  product: Product
): Promise<void> {
  const productId = sanitizeId(product.id);
  const path = `users/${userId}/products/${productId}`;
  const ref = doc(db, 'users', userId, 'products', productId);

  const payload: Record<string, unknown> = {
    id: productId,
    ownerId: userId,
    name: sanitizeStr(product.name, MAX_NAME_LEN),
    quantity: Math.max(0, product.quantity),
    unit: product.unit,
    lowStockThreshold: Math.max(0, product.lowStockThreshold),
    history: product.history.slice(0, MAX_HISTORY_ITEMS),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (
    typeof product.price === 'number' &&
    Number.isFinite(product.price) &&
    product.price >= 0
  ) {
    payload.price = product.price;
  }

  try {
    await setDoc(ref, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateFirestoreProductStock(
  userId: string,
  productId: string,
  quantity: number,
  history: StockHistoryEntry[]
): Promise<void> {
  const safeId = sanitizeId(productId);
  const path = `users/${userId}/products/${safeId}`;
  const ref = doc(db, 'users', userId, 'products', safeId);

  try {
    await updateDoc(ref, {
      quantity: Math.max(0, quantity),
      history: history.slice(0, MAX_HISTORY_ITEMS),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateFirestoreProductDetails(
  userId: string,
  product: Product
): Promise<void> {
  const safeId = sanitizeId(product.id);
  const path = `users/${userId}/products/${safeId}`;
  const ref = doc(db, 'users', userId, 'products', safeId);

  try {
    const updatePayload: Record<string, unknown> = {
      name: sanitizeStr(product.name, MAX_NAME_LEN),
      quantity: Math.max(0, product.quantity),
      unit: product.unit,
      lowStockThreshold: Math.max(0, product.lowStockThreshold),
      history: product.history.slice(0, MAX_HISTORY_ITEMS),
      updatedAt: serverTimestamp(),
      price:
        typeof product.price === 'number' &&
        Number.isFinite(product.price) &&
        product.price >= 0
          ? product.price
          : deleteField(),
    };

    await updateDoc(ref, updatePayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteFirestoreProduct(
  userId: string,
  productId: string
): Promise<void> {
  const safeId = sanitizeId(productId);
  const path = `users/${userId}/products/${safeId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'products', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function createFirestoreSale(
  userId: string,
  sale: SaleRecord
): Promise<void> {
  const saleId = sanitizeId(sale.id);
  const path = `users/${userId}/sales/${saleId}`;
  const payload: Record<string, unknown> = {
    id: saleId,
    ownerId: userId,
    productId: sanitizeId(sale.productId),
    productName: sanitizeStr(sale.productName, MAX_NAME_LEN),
    unit: sale.unit,
    quantity: Math.max(0.01, sale.quantity),
    createdAt: serverTimestamp(),
  };

  if (typeof sale.unitPrice === 'number' && sale.unitPrice >= 0) {
    payload.unitPrice = sale.unitPrice;
  }
  if (typeof sale.totalAmount === 'number' && sale.totalAmount >= 0) {
    payload.totalAmount = sale.totalAmount;
  }

  try {
    await setDoc(doc(db, 'users', userId, 'sales', saleId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function clearUserFirestoreData(userId: string): Promise<void> {
  const prodPath = `users/${userId}/products`;
  const salesPath = `users/${userId}/sales`;
  try {
    const [prodSnap, salesSnap] = await Promise.all([
      getDocs(
        query(collection(db, 'users', userId, 'products'), where('ownerId', '==', userId))
      ),
      getDocs(
        query(collection(db, 'users', userId, 'sales'), where('ownerId', '==', userId))
      ),
    ]);

    const batch = writeBatch(db);
    prodSnap.docs.forEach((d) => batch.delete(d.ref));
    salesSnap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${prodPath} & ${salesPath}`);
  }
}

export async function migrateLocalDataIfCloudEmpty(
  userId: string,
  localProducts: Product[],
  localSales: SaleRecord[]
): Promise<void> {
  if (localProducts.length === 0 && localSales.length === 0) return;

  const prodPath = `users/${userId}/products`;
  try {
    const existingProds = await getDocs(
      query(collection(db, 'users', userId, 'products'), where('ownerId', '==', userId))
    );
    if (!existingProds.empty) return;

    const batch = writeBatch(db);
    for (const p of localProducts) {
      const safeId = sanitizeId(p.id);
      const ref = doc(db, 'users', userId, 'products', safeId);
      const docData: Record<string, unknown> = {
        id: safeId,
        ownerId: userId,
        name: sanitizeStr(p.name, MAX_NAME_LEN),
        quantity: Math.max(0, p.quantity),
        unit: p.unit,
        lowStockThreshold: Math.max(0, p.lowStockThreshold),
        history: p.history.slice(0, MAX_HISTORY_ITEMS),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (typeof p.price === 'number' && p.price >= 0) {
        docData.price = p.price;
      }
      batch.set(ref, docData);
    }

    for (const s of localSales) {
      const safeSaleId = sanitizeId(s.id);
      const ref = doc(db, 'users', userId, 'sales', safeSaleId);
      const saleData: Record<string, unknown> = {
        id: safeSaleId,
        ownerId: userId,
        productId: sanitizeId(s.productId),
        productName: sanitizeStr(s.productName, MAX_NAME_LEN),
        unit: s.unit,
        quantity: Math.max(0.01, s.quantity),
        createdAt: serverTimestamp(),
      };
      if (typeof s.unitPrice === 'number' && s.unitPrice >= 0) {
        saleData.unitPrice = s.unitPrice;
      }
      if (typeof s.totalAmount === 'number' && s.totalAmount >= 0) {
        saleData.totalAmount = s.totalAmount;
      }
      batch.set(ref, saleData);
    }

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, prodPath);
  }
}

export async function createFirestoreDemoBooking(
  userId: string,
  booking: DemoBooking
): Promise<void> {
  const safeId = sanitizeId(booking.id);
  const path = `demoBookings/${safeId}`;
  try {
    await setDoc(doc(db, 'demoBookings', safeId), {
      id: safeId,
      ownerId: userId,
      shopName: sanitizeStr(booking.shopName, MAX_NAME_LEN),
      ownerName: sanitizeStr(booking.ownerName, MAX_NAME_LEN),
      phone: sanitizeStr(booking.phone, 20),
      locality: sanitizeStr(booking.locality, MAX_NAME_LEN),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function createFirestorePilotFeedback(
  userId: string,
  feedback: PilotFeedback
): Promise<void> {
  const safeId = sanitizeId(feedback.id);
  const path = `pilotFeedback/${safeId}`;
  try {
    await setDoc(doc(db, 'pilotFeedback', safeId), {
      id: safeId,
      ownerId: userId,
      easyToAdd: feedback.easyToAdd,
      useDaily: feedback.useDaily,
      pay199: feedback.pay199,
      comment: sanitizeStr(feedback.comment || '', MAX_COMMENT_LEN),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchFounderAdminCollections(): Promise<{
  feedback: PilotFeedback[];
  demos: DemoBooking[];
}> {
  try {
    const [fbSnap, demoSnap] = await Promise.all([
      getDocs(collection(db, 'pilotFeedback')),
      getDocs(collection(db, 'demoBookings')),
    ]);

    const feedback: PilotFeedback[] = fbSnap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: String(data.id || d.id),
          easyToAdd: data.easyToAdd,
          useDaily: data.useDaily,
          pay199: data.pay199,
          comment: String(data.comment || ''),
          createdAt: tsToIso(data.createdAt),
        };
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    const demos: DemoBooking[] = demoSnap.docs
      .map((d) => {
        const data = d.data();
        return {
          id: String(data.id || d.id),
          shopName: String(data.shopName || ''),
          ownerName: String(data.ownerName || ''),
          phone: String(data.phone || ''),
          locality: String(data.locality || ''),
          createdAt: tsToIso(data.createdAt),
        };
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return { feedback, demos };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'pilotFeedback / demoBookings');
  }
}
