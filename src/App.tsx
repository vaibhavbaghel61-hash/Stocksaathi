import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  AlertCircle,
  ClipboardList,
  Globe,
  MessageSquare,
  Package,
  ShoppingBag,
} from 'lucide-react';
import { DashboardView } from './components/DashboardView';
import { DemoBookingModal } from './components/DemoBookingModal';
import { FeedbackAndMoreView } from './components/FeedbackAndMoreView';
import { FounderView } from './components/FounderView';
import { GoogleGIcon } from './components/GoogleGIcon';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProductFormModal } from './components/ProductFormModal';
import { ReorderView } from './components/ReorderView';
import { SalesView } from './components/SalesView';
import { WelcomeView } from './components/WelcomeView';
import { buildSampleData } from './data/sampleData';
import { auth, googleProvider } from './firebase';
import { formatUnit, TRANSLATIONS } from './i18n';
import {
  AppTab,
  DemoBooking,
  Language,
  PilotFeedback,
  Product,
  SaleRecord,
  StockHistoryEntry,
  UnitType,
} from './types';
import {
  clearUserFirestoreData,
  createFirestoreDemoBooking,
  createFirestorePilotFeedback,
  createFirestoreProduct,
  createFirestoreSale,
  deleteFirestoreProduct,
  fetchFounderAdminCollections,
  migrateLocalDataIfCloudEmpty,
  subscribeUserProducts,
  subscribeUserSales,
  syncUserProfile,
  updateFirestoreProductDetails,
  updateFirestoreProductStock,
} from './utils/firestoreSync';
import { createId, sortForReorder } from './utils/stock';
import {
  clearAllAppData,
  loadDemos,
  loadFeedback,
  loadHasSeenWelcome,
  loadLanguage,
  loadProducts,
  loadSales,
  saveDemos,
  saveFeedback,
  saveHasSeenWelcome,
  saveLanguage,
  saveProducts,
  saveSales,
} from './utils/storage';

const FOUNDER_EMAIL = 'Vaibhavbaghel61@gmail.com';

export default function App() {
  const [lang, setLang] = useState<Language>(() => loadLanguage());
  const [showWelcome, setShowWelcome] = useState<boolean>(() => !loadHasSeenWelcome());
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);

  const [products, setProducts] = useState<Product[]>(() => loadProducts());
  const [sales, setSales] = useState<SaleRecord[]>(() => loadSales());
  const [demoBookings, setDemoBookings] = useState<DemoBooking[]>(() => loadDemos());
  const [feedbackList, setFeedbackList] = useState<PilotFeedback[]>(() => loadFeedback());

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const [toast, setToast] = useState<{ text: string; tone: 'success' | 'warn' } | null>(
    null
  );

  const productsRef = useRef(products);
  const salesRef = useRef(sales);
  productsRef.current = products;
  salesRef.current = sales;

  const t = TRANSLATIONS[lang];

  const showToast = useCallback((text: string, tone: 'success' | 'warn' = 'success') => {
    setToast({ text, tone });
  }, []);

  useEffect(() => {
    saveLanguage(lang);
  }, [lang]);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  useEffect(() => {
    saveSales(sales);
  }, [sales]);

  useEffect(() => {
    saveDemos(demoBookings);
  }, [demoBookings]);

  useEffect(() => {
    saveFeedback(feedbackList);
  }, [feedbackList]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  // Firebase Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);

      if (firebaseUser && firebaseUser.emailVerified) {
        try {
          await syncUserProfile(firebaseUser);
          await migrateLocalDataIfCloudEmpty(
            firebaseUser.uid,
            productsRef.current,
            salesRef.current
          );
        } catch (err) {
          console.error('Failed to sync profile/local data:', err);
        }
      }
    });
    return () => unsub();
  }, []);

  // Firestore real-time subscriptions when signed in
  useEffect(() => {
    if (!authReady || !user || !user.emailVerified) return;

    const unsubProducts = subscribeUserProducts(user.uid, (cloudProducts) => {
      setProducts(cloudProducts);
    });
    const unsubSales = subscribeUserSales(user.uid, (cloudSales) => {
      setSales(cloudSales);
    });

    return () => {
      unsubProducts();
      unsubSales();
    };
  }, [authReady, user]);

  // Fetch Founder admin cloud evidence when opening Founder view
  useEffect(() => {
    if (
      activeTab !== 'founder' ||
      !user ||
      !user.emailVerified ||
      user.email?.toLowerCase() !== FOUNDER_EMAIL.toLowerCase()
    ) {
      return;
    }

    fetchFounderAdminCollections()
      .then(({ feedback, demos }) => {
        if (feedback.length > 0) {
          setFeedbackList((prev) => {
            const ids = new Set(feedback.map((f) => f.id));
            return [...feedback, ...prev.filter((p) => !ids.has(p.id))];
          });
        }
        if (demos.length > 0) {
          setDemoBookings((prev) => {
            const ids = new Set(demos.map((d) => d.id));
            return [...demos, ...prev.filter((p) => !ids.has(p.id))];
          });
        }
      })
      .catch((err) => {
        console.error('Founder cloud fetch error:', err);
      });
  }, [activeTab, user]);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) ?? null,
    [products, selectedProductId]
  );

  const reorderCount = useMemo(() => sortForReorder(products).length, [products]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleSignInGoogle = async () => {
    if (authBusy) return;
    setAuthBusy(true);
    try {
      await signInWithPopup(auth, googleProvider);
      showToast(t.signInSuccessToast, 'success');
    } catch (err) {
      console.error('Google sign-in error:', err);
      showToast(t.signInErrorToast, 'warn');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignOut = async () => {
    if (authBusy) return;
    setAuthBusy(true);
    try {
      await signOut(auth);
      showToast(t.signOutSuccessToast, 'success');
    } catch (err) {
      console.error('Sign-out error:', err);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleStartUsing = () => {
    saveHasSeenWelcome(true);
    setShowWelcome(false);
    setActiveTab('dashboard');
  };

  const handleLoadSampleData = async () => {
    const { products: sampleProducts, sales: sampleSales } = buildSampleData();
    const existingNames = new Set(products.map((p) => p.name.toLowerCase()));
    const newItems = sampleProducts.filter(
      (sp) => !existingNames.has(sp.name.toLowerCase())
    );
    const itemsToAdd = newItems.length > 0 ? newItems : sampleProducts;

    const existingSaleIds = new Set(sales.map((s) => s.id));
    const salesToAdd = sampleSales.filter((ss) => !existingSaleIds.has(ss.id));

    setProducts((prev) => (newItems.length > 0 ? [...newItems, ...prev] : sampleProducts));
    setSales((prev) => [...salesToAdd, ...prev]);

    if (user && user.emailVerified) {
      await Promise.all([
        ...itemsToAdd.map((p) => createFirestoreProduct(user.uid, p)),
        ...salesToAdd.map((s) => createFirestoreSale(user.uid, s)),
      ]);
    }

    showToast(t.sampleDataLoadedToast, 'success');
  };

  const handleQuickAdjust = (productId: string, delta: 1 | -1) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return;

    if (delta < 0 && target.quantity + delta < 0) {
      showToast(t.cannotGoBelowZero, 'warn');
      return;
    }

    const nextQty = Math.max(0, Math.round((target.quantity + delta) * 100) / 100);
    const nowIso = new Date().toISOString();
    const entry: StockHistoryEntry = {
      id: createId('hist'),
      timestamp: nowIso,
      type: delta > 0 ? 'quick_add' : 'quick_remove',
      delta,
      resultingQuantity: nextQty,
    };
    const nextHistory = [entry, ...target.history].slice(0, 50);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantity: nextQty, updatedAt: nowIso, history: nextHistory } : p
      )
    );

    if (user && user.emailVerified) {
      void updateFirestoreProductStock(user.uid, productId, nextQty, nextHistory);
    }

    const unitLabel = formatUnit(target.unit, lang);
    showToast(`${target.name}: ${nextQty} ${unitLabel}`, 'success');
  };

  const handleSaveNewProduct = (data: {
    name: string;
    quantity: number;
    unit: UnitType;
    lowStockThreshold: number;
    price?: number;
  }) => {
    const nowIso = new Date().toISOString();
    const initialHistory: StockHistoryEntry[] =
      data.quantity > 0
        ? [
            {
              id: createId('hist'),
              timestamp: nowIso,
              type: 'initial',
              delta: data.quantity,
              resultingQuantity: data.quantity,
            },
          ]
        : [];

    const newProduct: Product = {
      id: createId('prod'),
      name: data.name,
      quantity: data.quantity,
      unit: data.unit,
      lowStockThreshold: data.lowStockThreshold,
      price: data.price,
      updatedAt: nowIso,
      history: initialHistory,
    };

    setProducts((prev) => [newProduct, ...prev]);
    setIsAddOpen(false);

    if (user && user.emailVerified) {
      void createFirestoreProduct(user.uid, newProduct);
    }

    showToast(t.productAddedToast, 'success');
  };

  const handleUpdateExistingProduct = (data: {
    name: string;
    quantity: number;
    unit: UnitType;
    lowStockThreshold: number;
    price?: number;
  }) => {
    if (!editingProduct) return;
    const nowIso = new Date().toISOString();
    const delta = Math.round((data.quantity - editingProduct.quantity) * 100) / 100;

    const nextHistory =
      delta !== 0
        ? [
            {
              id: createId('hist'),
              timestamp: nowIso,
              type: 'edited' as const,
              delta,
              resultingQuantity: data.quantity,
            },
            ...editingProduct.history,
          ].slice(0, 50)
        : editingProduct.history;

    const updatedProduct: Product = {
      ...editingProduct,
      name: data.name,
      quantity: data.quantity,
      unit: data.unit,
      lowStockThreshold: data.lowStockThreshold,
      price: data.price,
      updatedAt: nowIso,
      history: nextHistory,
    };

    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
    );
    setEditingProduct(null);

    if (user && user.emailVerified) {
      void updateFirestoreProductDetails(user.uid, updatedProduct);
    }

    showToast(t.productUpdatedToast, 'success');
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setEditingProduct(null);
    if (selectedProductId === productId) {
      setSelectedProductId(null);
    }

    if (user && user.emailVerified) {
      void deleteFirestoreProduct(user.uid, productId);
    }

    showToast(t.productDeletedToast, 'success');
  };

  const handleUpdateStock = (
    productId: string,
    mode: 'received' | 'sold',
    amount: number
  ): string | null => {
    const target = products.find((p) => p.id === productId);
    if (!target) return null;

    if (mode === 'sold' && amount > target.quantity) {
      return `${t.errInsufficientStock} (${target.quantity} ${formatUnit(target.unit, lang)})`;
    }

    const delta = mode === 'received' ? amount : -amount;
    const nextQty = Math.round((target.quantity + delta) * 100) / 100;
    const nowIso = new Date().toISOString();

    const entry: StockHistoryEntry = {
      id: createId('hist'),
      timestamp: nowIso,
      type: mode,
      delta,
      resultingQuantity: nextQty,
    };
    const nextHistory = [entry, ...target.history].slice(0, 50);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, quantity: nextQty, updatedAt: nowIso, history: nextHistory } : p
      )
    );

    if (user && user.emailVerified) {
      void updateFirestoreProductStock(user.uid, productId, nextQty, nextHistory);
    }

    if (mode === 'sold') {
      const sale: SaleRecord = {
        id: createId('sale'),
        productId: target.id,
        productName: target.name,
        unit: target.unit,
        quantity: amount,
        unitPrice: target.price,
        totalAmount: target.price ? target.price * amount : undefined,
        timestamp: nowIso,
      };
      setSales((prev) => [sale, ...prev]);

      if (user && user.emailVerified) {
        void createFirestoreSale(user.uid, sale);
      }
    }

    showToast(t.stockUpdatedToast, 'success');
    return null;
  };

  const handleRecordSale = (productId: string, quantity: number): string | null => {
    return handleUpdateStock(productId, 'sold', quantity);
  };

  const handleSaveDemoBooking = (data: {
    shopName: string;
    ownerName: string;
    phone: string;
    locality: string;
  }) => {
    const booking: DemoBooking = {
      id: createId('demo'),
      ...data,
      createdAt: new Date().toISOString(),
    };
    setDemoBookings((prev) => [booking, ...prev]);
    if (user && user.emailVerified) {
      void createFirestoreDemoBooking(user.uid, booking);
    }
  };

  const handleSubmitFeedback = (data: Omit<PilotFeedback, 'id' | 'createdAt'>) => {
    const item: PilotFeedback = {
      id: createId('fb'),
      ...data,
      createdAt: new Date().toISOString(),
    };
    setFeedbackList((prev) => [item, ...prev]);
    if (user && user.emailVerified) {
      void createFirestorePilotFeedback(user.uid, item);
    }
  };

  const handleClearData = async () => {
    clearAllAppData();
    setProducts([]);
    setSales([]);
    if (user && user.emailVerified) {
      await clearUserFirestoreData(user.uid);
    }
    showToast(t.dataClearedToast, 'success');
  };

  if (showWelcome) {
    return (
      <>
        <WelcomeView
          lang={lang}
          t={t}
          user={user}
          authBusy={authBusy}
          onToggleLanguage={toggleLanguage}
          onSignInGoogle={handleSignInGoogle}
          onSignOut={handleSignOut}
          onStartUsing={handleStartUsing}
          onOpenBookDemo={() => setIsDemoModalOpen(true)}
        />
        {isDemoModalOpen && (
          <DemoBookingModal
            t={t}
            onSaveBooking={handleSaveDemoBooking}
            onClose={() => setIsDemoModalOpen(false)}
          />
        )}
      </>
    );
  }

  const navItems: {
    id: Exclude<AppTab, 'founder'>;
    label: string;
    icon: typeof Package;
    badge?: number;
  }[] = [
    { id: 'dashboard', label: t.navInventory, icon: Package },
    {
      id: 'reorder',
      label: t.navReorder,
      icon: ClipboardList,
      badge: reorderCount > 0 ? reorderCount : undefined,
    },
    { id: 'sales', label: t.navSales, icon: ShoppingBag },
    { id: 'feedback', label: t.navFeedback, icon: MessageSquare },
  ];

  const userShortLabel = user?.email ? user.email.split('@')[0] : '';

  return (
    <div className="min-h-screen bg-[#F6F8F6] text-slate-900">
      {/* Top Bar — 3-Zone Contract: Brand | Nav Links (md+) | Account + Language */}
      <header className="sticky top-0 z-30 h-[52px] border-b border-slate-200 bg-white/95 backdrop-blur-xs">
        <div className="mx-auto max-w-6xl h-full px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="text-lg sm:text-xl font-bold tracking-tight text-emerald-800 whitespace-nowrap shrink-0"
          >
            {t.brandName}
          </button>

          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-6 text-sm font-semibold"
          >
            {navItems.map((item) => {
              const active =
                activeTab === item.id ||
                (activeTab === 'founder' && item.id === 'feedback');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`py-3.5 border-b-2 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    active
                      ? 'border-emerald-700 text-emerald-800'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="text-xs font-bold text-amber-800 tabular-nums">
                      ({item.badge})
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <button
                type="button"
                onClick={() => setActiveTab('feedback')}
                title={user.email ?? undefined}
                className="min-h-[38px] px-2.5 sm:px-3 rounded-xl border border-emerald-200 bg-emerald-50 text-xs sm:text-sm font-semibold text-emerald-900 hover:bg-emerald-100 flex items-center gap-1.5 whitespace-nowrap shrink-0 max-w-[140px] sm:max-w-[180px]"
              >
                <GoogleGIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{userShortLabel}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSignInGoogle}
                disabled={authBusy}
                className="min-h-[38px] px-2.5 sm:px-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-800 hover:bg-slate-50 flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <GoogleGIcon className="h-3.5 w-3.5 shrink-0" />
                <span>{authBusy ? t.signingIn : t.signInShort}</span>
              </button>
            )}

            <button
              type="button"
              onClick={toggleLanguage}
              className="min-h-[38px] px-3 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Globe className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              <span>{t.langToggleLabel}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Non-blocking Toast Feedback */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 px-4 w-full max-w-sm pointer-events-none">
          <div
            role="status"
            className={`rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-md flex items-center justify-center gap-2 ${
              toast.tone === 'warn'
                ? 'border-amber-300 bg-amber-50 text-amber-900'
                : 'border-emerald-700 bg-emerald-800 text-white'
            }`}
          >
            {toast.tone === 'warn' && (
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span className="truncate">{toast.text}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-4 sm:pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            products={products}
            lang={lang}
            t={t}
            onQuickAdjust={handleQuickAdjust}
            onSelectProduct={(p) => setSelectedProductId(p.id)}
            onOpenAddProduct={() => setIsAddOpen(true)}
            onLoadSampleData={handleLoadSampleData}
          />
        )}

        {activeTab === 'reorder' && (
          <ReorderView
            products={products}
            lang={lang}
            t={t}
            onSelectProduct={(p) => setSelectedProductId(p.id)}
            onNotify={(msg) => showToast(msg, 'success')}
          />
        )}

        {activeTab === 'sales' && (
          <SalesView
            products={products}
            sales={sales}
            lang={lang}
            t={t}
            onRecordSale={handleRecordSale}
          />
        )}

        {activeTab === 'feedback' && (
          <FeedbackAndMoreView
            t={t}
            user={user}
            authBusy={authBusy}
            onSignInGoogle={handleSignInGoogle}
            onSignOut={handleSignOut}
            onSubmitFeedback={handleSubmitFeedback}
            onOpenWelcome={() => setShowWelcome(true)}
            onOpenBookDemo={() => setIsDemoModalOpen(true)}
            onLoadSampleData={handleLoadSampleData}
            onClearData={handleClearData}
            onOpenFounderView={() => setActiveTab('founder')}
          />
        )}

        {activeTab === 'founder' && (
          <FounderView
            feedbackList={feedbackList}
            demoBookings={demoBookings}
            lang={lang}
            t={t}
            onBack={() => setActiveTab('feedback')}
            onNotify={(msg) => showToast(msg, 'success')}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Tab Bar (60px height) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xs border-t border-slate-200 pb-safe"
      >
        <div className="grid grid-cols-4 h-[60px]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              activeTab === item.id ||
              (activeTab === 'founder' && item.id === 'feedback');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center min-h-[48px] px-1 transition-colors ${
                  active ? 'text-emerald-800' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={active ? 2.4 : 1.9}
                  aria-hidden="true"
                />
                <span className="mt-0.5 text-[11px] font-semibold tracking-tight whitespace-nowrap truncate max-w-full">
                  {item.label}
                  {item.badge !== undefined ? ` (${item.badge})` : ''}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modals */}
      {isAddOpen && (
        <ProductFormModal
          lang={lang}
          t={t}
          onSave={handleSaveNewProduct}
          onClose={() => setIsAddOpen(false)}
        />
      )}

      {editingProduct && (
        <ProductFormModal
          lang={lang}
          t={t}
          initialProduct={editingProduct}
          onSave={handleUpdateExistingProduct}
          onDelete={handleDeleteProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {selectedProduct && !editingProduct && (
        <ProductDetailModal
          product={selectedProduct}
          lang={lang}
          t={t}
          onUpdateStock={handleUpdateStock}
          onEditProduct={(prod) => {
            setEditingProduct(prod);
          }}
          onClose={() => setSelectedProductId(null)}
        />
      )}

      {isDemoModalOpen && (
        <DemoBookingModal
          t={t}
          onSaveBooking={handleSaveDemoBooking}
          onClose={() => setIsDemoModalOpen(false)}
        />
      )}
    </div>
  );
}
