import { HistoryType, Language, UnitType } from './types';

export interface Translations {
  brandName: string;
  langToggleLabel: string;
  // Navigation
  navInventory: string;
  navReorder: string;
  navSales: string;
  navFeedback: string;
  // Welcome Screen
  welcomeStartFree: string;
  welcomeBookDemo: string;
  welcomeHeadline: string;
  welcomeSubhead: string;
  welcomeBenefit1Title: string;
  welcomeBenefit1Desc: string;
  welcomeBenefit2Title: string;
  welcomeBenefit2Desc: string;
  welcomeBenefit3Title: string;
  welcomeBenefit3Desc: string;
  pricingTitle: string;
  pricingSubtitle: string;
  planFreeTitle: string;
  planFreePrice: string;
  planFreePeriod: string;
  planFreeFeature1: string;
  planFreeFeature2: string;
  planFreeFeature3: string;
  planFreeFeature4: string;
  planPlusTitle: string;
  planPlusPrice: string;
  planPlusPeriod: string;
  planPlusComingSoon: string;
  planPlusValidationNote: string;
  planPlusFeature1: string;
  planPlusFeature2: string;
  planPlusFeature3: string;
  welcomeLocationNote: string;
  // Demo Booking Form
  demoModalTitle: string;
  demoModalSubtitle: string;
  demoShopName: string;
  demoShopPlaceholder: string;
  demoOwnerName: string;
  demoOwnerPlaceholder: string;
  demoPhone: string;
  demoPhonePlaceholder: string;
  demoLocality: string;
  demoLocalityPlaceholder: string;
  demoSubmit: string;
  demoCancel: string;
  demoSuccessTitle: string;
  demoSuccessDesc: string;
  demoErrShop: string;
  demoErrOwner: string;
  demoErrPhone: string;
  demoErrLocality: string;
  // Dashboard
  summaryTotal: string;
  summaryLow: string;
  summaryOut: string;
  searchPlaceholder: string;
  clearSearch: string;
  filterAll: string;
  filterLow: string;
  filterOut: string;
  loadSampleData: string;
  sampleDataLoadedToast: string;
  addProduct: string;
  statusOk: string;
  statusLow: string;
  statusOut: string;
  thresholdShort: string;
  emptyInventoryTitle: string;
  emptyInventoryDesc: string;
  noSearchMatchTitle: string;
  noSearchMatchDesc: string;
  showAllItems: string;
  cannotGoBelowZero: string;
  stockAdjustedPlus: string;
  stockAdjustedMinus: string;
  // Add / Edit Product
  addProductTitle: string;
  editProductTitle: string;
  fieldProductName: string;
  fieldProductNamePlaceholder: string;
  fieldCurrentQty: string;
  fieldUnit: string;
  fieldThreshold: string;
  fieldThresholdHelper: string;
  fieldPrice: string;
  fieldPriceOptional: string;
  fieldPricePlaceholder: string;
  saveProduct: string;
  updateProduct: string;
  cancel: string;
  deleteProduct: string;
  deleteConfirmQuestion: string;
  deleteConfirmYes: string;
  errProductName: string;
  errQuantityInvalid: string;
  errThresholdInvalid: string;
  errPriceInvalid: string;
  productAddedToast: string;
  productUpdatedToast: string;
  productDeletedToast: string;
  // Product Detail & Update Stock
  currentStockLabel: string;
  editDetails: string;
  stockReceived: string;
  stockSold: string;
  enterQuantityLabel: string;
  confirmReceived: string;
  confirmSold: string;
  errPositiveQty: string;
  errInsufficientStock: string;
  stockUpdatedToast: string;
  historyTitle: string;
  historyEmpty: string;
  resultingLabel: string;
  close: string;
  // Reorder View
  reorderTitle: string;
  reorderSubtitle: string;
  reorderEmptyTitle: string;
  reorderEmptyDesc: string;
  shareWhatsApp: string;
  copyList: string;
  copiedToast: string;
  listPreviewTitle: string;
  quickRestock: string;
  whatsappHeader: string;
  whatsappCurrentPrefix: string;
  // Sales View
  salesTitle: string;
  salesSubtitle: string;
  todaySalesCountLabel: string;
  todayItemsSoldLabel: string;
  pickProductLabel: string;
  saleQtyLabel: string;
  recordSaleBtn: string;
  saleSuccessToast: string;
  noInStockProducts: string;
  fastSellingTitle: string;
  fastSellingEmpty: string;
  soldThisWeek: string;
  recentSalesTitle: string;
  recentSalesEmpty: string;
  // Feedback & More
  feedbackTitle: string;
  feedbackSubtitle: string;
  qEasyAdd: string;
  qUseDaily: string;
  qPay199: string;
  qComment: string;
  qCommentPlaceholder: string;
  ansYes: string;
  ansMaybe: string;
  ansNo: string;
  submitFeedback: string;
  feedbackThanksTitle: string;
  feedbackThanksDesc: string;
  submitAnother: string;
  storeToolsTitle: string;
  viewWelcomeBtn: string;
  bookDemoFromAppBtn: string;
  resetAllDataBtn: string;
  resetConfirmText: string;
  resetConfirmYes: string;
  dataClearedToast: string;
  founderViewLink: string;
  // Founder View
  founderTitle: string;
  founderSubtitle: string;
  backToFeedback: string;
  founderResponsesCount: string;
  founderEasyAddPct: string;
  founderDailyUsePct: string;
  founderPay199Pct: string;
  founderFeedbackListTitle: string;
  founderNoFeedback: string;
  founderDemoLeadsTitle: string;
  founderNoDemos: string;
  founderCopySummary: string;
  founderCopiedToast: string;
  // Google Auth & Account
  signInWithGoogle: string;
  signInShort: string;
  signingIn: string;
  signOut: string;
  signedInAs: string;
  accountSectionTitle: string;
  accountLocalOnlyDesc: string;
  accountCloudSyncedDesc: string;
  signInSuccessToast: string;
  signOutSuccessToast: string;
  signInErrorToast: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandName: 'StockSaathi',
    langToggleLabel: 'हिंदी',
    navInventory: 'Inventory',
    navReorder: 'Reorder',
    navSales: 'Record Sale',
    navFeedback: 'Feedback',
    welcomeStartFree: 'Start using free',
    welcomeBookDemo: 'Book a free 10-minute demo',
    welcomeHeadline: 'Easy stock management without complicated software.',
    welcomeSubhead:
      'Built for neighbourhood kirana shops in Selaqui and Dehradun. As simple as your paper register, right on your phone.',
    welcomeBenefit1Title: "Know what's in stock",
    welcomeBenefit1Desc:
      'See every item and exact quantity in one place without flipping through register pages.',
    welcomeBenefit2Title: 'Get low-stock warnings',
    welcomeBenefit2Desc:
      'Helps you see what is running low or finished before customers ask for it.',
    welcomeBenefit3Title: 'Spend less time on registers',
    welcomeBenefit3Desc:
      'Record goods received or sold in just two taps, even when the shop is busy.',
    pricingTitle: 'Simple, honest pricing',
    pricingSubtitle: 'Start free with everything you need for daily stock tracking.',
    planFreeTitle: 'Free Basic Plan',
    planFreePrice: '₹0',
    planFreePeriod: 'Free for daily shop use',
    planFreeFeature1: 'Unlimited product records',
    planFreeFeature2: 'Quick stock received & sold updates',
    planFreeFeature3: 'Searchable inventory view',
    planFreeFeature4: 'Low-stock alerts & WhatsApp reorder list',
    planPlusTitle: 'StockSaathi Plus',
    planPlusPrice: '₹199',
    planPlusPeriod: 'per month',
    planPlusComingSoon: 'Coming soon, for pilot stores',
    planPlusValidationNote: 'Proposed price under validation — free during pilot.',
    planPlusFeature1: 'Multi-phone backup for shop helpers',
    planPlusFeature2: 'Weekly supplier summary messages',
    planPlusFeature3: 'Priority support in Selaqui & Dehradun',
    welcomeLocationNote: 'Works offline on your phone · No login required',
    demoModalTitle: 'Book a free 10-minute demo',
    demoModalSubtitle:
      'We will visit or call your shop to help set up your first 10 items.',
    demoShopName: 'Shop Name',
    demoShopPlaceholder: 'e.g. Rawat Kirana Store',
    demoOwnerName: 'Owner Name',
    demoOwnerPlaceholder: 'e.g. Ramesh Rawat',
    demoPhone: 'Phone Number',
    demoPhonePlaceholder: '10-digit mobile number',
    demoLocality: 'Locality / Area',
    demoLocalityPlaceholder: 'e.g. Selaqui, Prem Nagar, Vikasnagar',
    demoSubmit: 'Save Demo Request',
    demoCancel: 'Cancel',
    demoSuccessTitle: 'Demo request saved',
    demoSuccessDesc:
      'Thank you! Your request has been recorded on this device for the pilot team.',
    demoErrShop: 'Please enter your shop name.',
    demoErrOwner: 'Please enter the owner name.',
    demoErrPhone: 'Please enter a valid 10-digit phone number.',
    demoErrLocality: 'Please enter your locality (e.g. Selaqui).',
    summaryTotal: 'Total Products',
    summaryLow: 'Low Stock',
    summaryOut: 'Out of Stock',
    searchPlaceholder: 'Search item name (e.g. Atta, Salt, Maggi)...',
    clearSearch: 'Clear',
    filterAll: 'All',
    filterLow: 'Low',
    filterOut: 'Out',
    loadSampleData: 'Load sample data',
    sampleDataLoadedToast: '10 sample kirana products loaded.',
    addProduct: 'Add Product',
    statusOk: 'OK',
    statusLow: 'Low',
    statusOut: 'Out of stock',
    thresholdShort: 'Alert at',
    emptyInventoryTitle: 'Your shop register is empty',
    emptyInventoryDesc:
      'Add your first product in under 30 seconds, or load 10 common kirana items to try the app right away.',
    noSearchMatchTitle: 'No matching items found',
    noSearchMatchDesc: 'Try a different spelling or clear the search filter.',
    showAllItems: 'Show all items',
    cannotGoBelowZero: 'Stock cannot go below 0.',
    stockAdjustedPlus: 'Added 1',
    stockAdjustedMinus: 'Removed 1',
    addProductTitle: 'Add New Product',
    editProductTitle: 'Edit Product',
    fieldProductName: 'Product Name',
    fieldProductNamePlaceholder: 'e.g. Aashirvaad Atta 5kg',
    fieldCurrentQty: 'Current Quantity',
    fieldUnit: 'Unit',
    fieldThreshold: 'Low-Stock Alert Threshold',
    fieldThresholdHelper: 'Shows a Low warning when stock reaches this number or below.',
    fieldPrice: 'Selling Price in ₹',
    fieldPriceOptional: 'Optional',
    fieldPricePlaceholder: 'e.g. 245',
    saveProduct: 'Save Product',
    updateProduct: 'Save Changes',
    cancel: 'Cancel',
    deleteProduct: 'Remove Product',
    deleteConfirmQuestion: 'Remove this item from your list?',
    deleteConfirmYes: 'Yes, Remove',
    errProductName: 'Please write the product name.',
    errQuantityInvalid: 'Quantity must be 0 or more.',
    errThresholdInvalid: 'Alert number must be 0 or more.',
    errPriceInvalid: 'Price must be a positive number.',
    productAddedToast: 'Product added to register.',
    productUpdatedToast: 'Product details updated.',
    productDeletedToast: 'Product removed.',
    currentStockLabel: 'Current Stock',
    editDetails: 'Edit details',
    stockReceived: 'Stock Received',
    stockSold: 'Stock Sold',
    enterQuantityLabel: 'How many?',
    confirmReceived: 'Add to Stock',
    confirmSold: 'Reduce Stock',
    errPositiveQty: 'Please enter a number greater than 0.',
    errInsufficientStock: 'Cannot sell more than what is in stock.',
    stockUpdatedToast: 'Stock updated.',
    historyTitle: 'Stock History',
    historyEmpty: 'No stock changes recorded yet.',
    resultingLabel: 'Balance',
    close: 'Close',
    reorderTitle: 'Need to Reorder',
    reorderSubtitle: 'Items at or below your low-stock level. Out-of-stock items appear first.',
    reorderEmptyTitle: 'All items are well stocked',
    reorderEmptyDesc: 'Nothing is below its low-stock threshold right now.',
    shareWhatsApp: 'Share on WhatsApp',
    copyList: 'Copy List',
    copiedToast: 'Reorder list copied.',
    listPreviewTitle: 'Message preview for supplier',
    quickRestock: 'Restock',
    whatsappHeader: 'Reorder List - Kirana Store',
    whatsappCurrentPrefix: 'Current',
    salesTitle: 'Record Sale',
    salesSubtitle: 'Pick an item and quantity. Stock updates automatically.',
    todaySalesCountLabel: "Today's Sales",
    todayItemsSoldLabel: 'Items Sold Today',
    pickProductLabel: '1. Tap product sold',
    saleQtyLabel: '2. Quantity sold',
    recordSaleBtn: 'Record Sale',
    saleSuccessToast: 'Sale recorded and stock updated.',
    noInStockProducts: 'No in-stock products available to sell. Add or restock items first.',
    fastSellingTitle: 'Fast-selling items this week',
    fastSellingEmpty: 'Record a few sales to see which items move fastest this week.',
    soldThisWeek: 'sold this week',
    recentSalesTitle: 'Recent sales today',
    recentSalesEmpty: 'No sales recorded yet today.',
    feedbackTitle: 'Pilot Feedback',
    feedbackSubtitle:
      'Your honest feedback helps us keep StockSaathi simple for Selaqui & Dehradun stores.',
    qEasyAdd: 'Was it easy to add a product?',
    qUseDaily: 'Would you use this daily?',
    qPay199: 'Would you pay ₹199/month?',
    qComment: 'Any suggestion or difficulty? (Optional)',
    qCommentPlaceholder: 'Write anything you liked or found confusing...',
    ansYes: 'Yes',
    ansMaybe: 'Maybe',
    ansNo: 'No',
    submitFeedback: 'Submit Feedback',
    feedbackThanksTitle: 'Thank you for your feedback!',
    feedbackThanksDesc: 'Your response has been saved on this device.',
    submitAnother: 'Submit another response',
    storeToolsTitle: 'Demo & Store Tools',
    viewWelcomeBtn: 'View Welcome & Pricing',
    bookDemoFromAppBtn: 'Book a free 10-minute demo',
    resetAllDataBtn: 'Clear all saved data',
    resetConfirmText: 'This will remove all products and sales from this phone.',
    resetConfirmYes: 'Clear Everything',
    dataClearedToast: 'All saved data cleared.',
    founderViewLink: 'Founder view (pilot evidence)',
    founderTitle: 'Founder View — Pilot Evidence',
    founderSubtitle: 'Locally collected feedback and demo requests from store visits.',
    backToFeedback: 'Back to Feedback',
    founderResponsesCount: 'Responses',
    founderEasyAddPct: 'Easy to Add',
    founderDailyUsePct: 'Daily Use (Yes)',
    founderPay199Pct: 'Pay ₹199 (Yes)',
    founderFeedbackListTitle: 'Shopkeeper Feedback Responses',
    founderNoFeedback: 'No pilot feedback responses submitted yet.',
    founderDemoLeadsTitle: 'Demo Booking Requests',
    founderNoDemos: 'No demo requests saved yet.',
    founderCopySummary: 'Copy Pilot Report',
    founderCopiedToast: 'Pilot report copied to clipboard.',
    signInWithGoogle: 'Sign in with Google',
    signInShort: 'Google Login',
    signingIn: 'Signing in...',
    signOut: 'Sign out',
    signedInAs: 'Signed in as',
    accountSectionTitle: 'Google Account & Backup',
    accountLocalOnlyDesc:
      'Currently saved on this phone only. Sign in with your Google email to back up your stock.',
    accountCloudSyncedDesc:
      'Your stock and sales are synced to your Google account.',
    signInSuccessToast: 'Signed in with Google.',
    signOutSuccessToast: 'Signed out.',
    signInErrorToast: 'Google sign-in could not be completed. Please try again.',
  },
  hi: {
    brandName: 'स्टॉकसाथी',
    langToggleLabel: 'English',
    navInventory: 'स्टॉक',
    navReorder: 'ऑर्डर लिस्ट',
    navSales: 'बिक्री लिखें',
    navFeedback: 'सुझाव',
    welcomeStartFree: 'फ्री शुरू करें',
    welcomeBookDemo: '10 मिनट का फ्री डेमो बुक करें',
    welcomeHeadline: 'बिना झंझट के आसान स्टॉक हिसाब।',
    welcomeSubhead:
      'सेलाकुई और देहरादून की किराना दुकानों के लिए बनाया गया। कागज़ के रजिस्टर जितना आसान, अब आपके फ़ोन पर।',
    welcomeBenefit1Title: 'तुरंत जानें क्या बचा है',
    welcomeBenefit1Desc:
      'रजिस्टर के पन्ने पलटे बिना एक जगह देखें कि कौन-सा सामान कितना बचा है।',
    welcomeBenefit2Title: 'कम स्टॉक की चेतावनी',
    welcomeBenefit2Desc:
      'सामान खत्म होने से पहले ही पता चल जाता है कि क्या मंगाना है।',
    welcomeBenefit3Title: 'रजिस्टर में कम समय लगे',
    welcomeBenefit3Desc:
      'भीड़ के समय भी सिर्फ दो टैप में नया आया या बिका हुआ स्टॉक अपडेट करें।',
    pricingTitle: 'सीधा और आसान प्लान',
    pricingSubtitle: 'दुकान के रोज़ाना स्टॉक हिसाब के लिए बिल्कुल फ्री शुरू करें।',
    planFreeTitle: 'फ्री बेसिक प्लान',
    planFreePrice: '₹0',
    planFreePeriod: 'रोज़ाना दुकान के लिए फ्री',
    planFreeFeature1: 'जितने चाहें उतने सामान जोड़ें',
    planFreeFeature2: 'स्टॉक आया और बिका तुरंत लिखें',
    planFreeFeature3: 'आसान सर्च के साथ पूरा स्टॉक देखें',
    planFreeFeature4: 'कम स्टॉक अलर्ट और WhatsApp ऑर्डर लिस्ट',
    planPlusTitle: 'स्टॉकसाथी प्लस',
    planPlusPrice: '₹199',
    planPlusPeriod: 'प्रति माह',
    planPlusComingSoon: 'जल्द आ रहा है, पायलट दुकानों के लिए',
    planPlusValidationNote: 'प्रस्तावित कीमत (अभी जांच में है) — पायलट के दौरान फ्री।',
    planPlusFeature1: 'दुकान के स्टाफ के लिए मल्टी-फ़ोन बैकअप',
    planPlusFeature2: 'सप्लायर के लिए साप्ताहिक लिस्ट',
    planPlusFeature3: 'सेलाकुई और देहरादून में सीधी मदद',
    welcomeLocationNote: 'बिना इंटरनेट (ऑफलाइन) चलता है · लॉगिन की ज़रूरत नहीं',
    demoModalTitle: '10 मिनट का फ्री डेमो बुक करें',
    demoModalSubtitle:
      'हम आपकी दुकान पर आकर या कॉल करके पहले 10 सामान सेट करने में मदद करेंगे।',
    demoShopName: 'दुकान का नाम',
    demoShopPlaceholder: 'जैसे: रावत किराना स्टोर',
    demoOwnerName: 'मालिक का नाम',
    demoOwnerPlaceholder: 'जैसे: रमेश रावत',
    demoPhone: 'फ़ोन नंबर',
    demoPhonePlaceholder: '10 अंकों का मोबाइल नंबर',
    demoLocality: 'इलाका / क्षेत्र',
    demoLocalityPlaceholder: 'जैसे: सेलाकुई, प्रेमनगर, विकासनगर',
    demoSubmit: 'डेमो अनुरोध सेव करें',
    demoCancel: 'रद्द करें',
    demoSuccessTitle: 'डेमो अनुरोध सेव हो गया',
    demoSuccessDesc: 'धन्यवाद! आपका अनुरोध इस फ़ोन पर पायलट टीम के लिए सेव हो गया है।',
    demoErrShop: 'कृपया दुकान का नाम लिखें।',
    demoErrOwner: 'कृपया मालिक का नाम लिखें।',
    demoErrPhone: 'कृपया सही 10 अंकों का फ़ोन नंबर डालें।',
    demoErrLocality: 'कृपया अपने इलाके का नाम लिखें।',
    summaryTotal: 'कुल सामान',
    summaryLow: 'कम स्टॉक',
    summaryOut: 'स्टॉक खत्म',
    searchPlaceholder: 'सामान खोजें (जैसे: आटा, नमक, मैगी)...',
    clearSearch: 'साफ़ करें',
    filterAll: 'सभी',
    filterLow: 'कम',
    filterOut: 'खत्म',
    loadSampleData: 'सैंपल डेटा डालें',
    sampleDataLoadedToast: '10 आम किराना सामान जोड़ दिए गए।',
    addProduct: 'नया सामान जोड़ें',
    statusOk: 'ठीक है',
    statusLow: 'कम',
    statusOut: 'खत्म',
    thresholdShort: 'अलर्ट सीमा',
    emptyInventoryTitle: 'आपका स्टॉक रजिस्टर खाली है',
    emptyInventoryDesc:
      '30 सेकंड में पहला सामान जोड़ें, या तुरंत देखने के लिए 10 आम किराना सामान लोड करें।',
    noSearchMatchTitle: 'ऐसा कोई सामान नहीं मिला',
    noSearchMatchDesc: 'दूसरा नाम लिखकर खोजें या फ़िल्टर हटाएँ।',
    showAllItems: 'सभी सामान दिखाएँ',
    cannotGoBelowZero: 'स्टॉक 0 से कम नहीं हो सकता।',
    stockAdjustedPlus: '1 जोड़ा गया',
    stockAdjustedMinus: '1 घटाया गया',
    addProductTitle: 'नया सामान जोड़ें',
    editProductTitle: 'सामान बदलें',
    fieldProductName: 'सामान का नाम',
    fieldProductNamePlaceholder: 'जैसे: आशीर्वाद आटा 5 किलो',
    fieldCurrentQty: 'अभी कितना स्टॉक है',
    fieldUnit: 'इकाई (Unit)',
    fieldThreshold: 'कम स्टॉक अलर्ट संख्या',
    fieldThresholdHelper: 'स्टॉक इस संख्या या इससे कम होने पर "कम" चेतावनी दिखेगी।',
    fieldPrice: 'कीमत (₹ में)',
    fieldPriceOptional: 'वैकल्पिक',
    fieldPricePlaceholder: 'जैसे: 245',
    saveProduct: 'सामान सेव करें',
    updateProduct: 'बदलाव सेव करें',
    cancel: 'रद्द करें',
    deleteProduct: 'सामान हटाएँ',
    deleteConfirmQuestion: 'क्या इस सामान को लिस्ट से हटाना है?',
    deleteConfirmYes: 'हाँ, हटाएँ',
    errProductName: 'कृपया सामान का नाम लिखें।',
    errQuantityInvalid: 'मात्रा 0 या उससे ज़्यादा होनी चाहिए।',
    errThresholdInvalid: 'अलर्ट संख्या 0 या उससे ज़्यादा होनी चाहिए।',
    errPriceInvalid: 'कीमत सही संख्या में डालें।',
    productAddedToast: 'सामान रजिस्टर में जुड़ गया।',
    productUpdatedToast: 'सामान की जानकारी अपडेट हो गई।',
    productDeletedToast: 'सामान हटा दिया गया।',
    currentStockLabel: 'मौजूदा स्टॉक',
    editDetails: 'जानकारी बदलें',
    stockReceived: 'स्टॉक आया',
    stockSold: 'स्टॉक बिका',
    enterQuantityLabel: 'कितना?',
    confirmReceived: 'स्टॉक में जोड़ें',
    confirmSold: 'स्टॉक घटाएँ',
    errPositiveQty: 'कृपया 0 से बड़ी संख्या डालें।',
    errInsufficientStock: 'जितना स्टॉक है उससे ज़्यादा बिक्री नहीं लिख सकते।',
    stockUpdatedToast: 'स्टॉक अपडेट हो गया।',
    historyTitle: 'स्टॉक इतिहास',
    historyEmpty: 'अभी तक कोई बदलाव नहीं हुआ है।',
    resultingLabel: 'बचा स्टॉक',
    close: 'बंद करें',
    reorderTitle: 'मंगाने वाला सामान',
    reorderSubtitle: 'जो सामान कम या खत्म हो गया है। खत्म सामान सबसे ऊपर दिखेगा।',
    reorderEmptyTitle: 'सभी सामान पर्याप्त मात्रा में हैं',
    reorderEmptyDesc: 'अभी कोई भी सामान कम स्टॉक सीमा से नीचे नहीं है।',
    shareWhatsApp: 'WhatsApp पर भेजें',
    copyList: 'लिस्ट कॉपी करें',
    copiedToast: 'ऑर्डर लिस्ट कॉपी हो गई।',
    listPreviewTitle: 'सप्लायर को भेजने वाला मैसेज',
    quickRestock: 'स्टॉक आया',
    whatsappHeader: 'ऑर्डर लिस्ट - किराना स्टोर',
    whatsappCurrentPrefix: 'मौजूदा',
    salesTitle: 'बिक्री लिखें',
    salesSubtitle: 'सामान और मात्रा चुनें। स्टॉक अपने आप कम हो जाएगा।',
    todaySalesCountLabel: 'आज की बिक्री',
    todayItemsSoldLabel: 'आज बिका सामान',
    pickProductLabel: '1. बिका हुआ सामान चुनें',
    saleQtyLabel: '2. कितनी मात्रा बिकी',
    recordSaleBtn: 'बिक्री सेव करें',
    saleSuccessToast: 'बिक्री दर्ज हुई और स्टॉक अपडेट हो गया।',
    noInStockProducts: 'बिक्री के लिए स्टॉक में कोई सामान नहीं है। पहले स्टॉक जोड़ें।',
    fastSellingTitle: 'इस हफ़्ते सबसे तेज़ बिकने वाला सामान',
    fastSellingEmpty: 'इस हफ़्ते की तेज़ बिक्री देखने के लिए कुछ बिक्री दर्ज करें।',
    soldThisWeek: 'इस हफ़्ते बिका',
    recentSalesTitle: 'आज की ताज़ा बिक्री',
    recentSalesEmpty: 'आज अभी तक कोई बिक्री दर्ज नहीं हुई है।',
    feedbackTitle: 'पायलट सुझाव',
    feedbackSubtitle:
      'आपकी ईमानदार राय से स्टॉकसाथी को सेलाकुई और देहरादून के दुकानदारों के लिए आसान बनाने में मदद मिलती है।',
    qEasyAdd: 'क्या नया सामान जोड़ना आसान था?',
    qUseDaily: 'क्या आप इसे रोज़ इस्तेमाल करेंगे?',
    qPay199: 'क्या आप ₹199/महीना देना चाहेंगे?',
    qComment: 'कोई सुझाव या परेशानी? (वैकल्पिक)',
    qCommentPlaceholder: 'जो अच्छा लगा या कठिन लगा वह लिखें...',
    ansYes: 'हाँ',
    ansMaybe: 'शायद',
    ansNo: 'नहीं',
    submitFeedback: 'सुझाव भेजें',
    feedbackThanksTitle: 'आपके सुझाव के लिए धन्यवाद!',
    feedbackThanksDesc: 'आपका जवाब इस फ़ोन पर सेव हो गया है।',
    submitAnother: 'एक और सुझाव दें',
    storeToolsTitle: 'डेमो और दुकान टूल्स',
    viewWelcomeBtn: 'वेलकम और प्लान देखें',
    bookDemoFromAppBtn: '10 मिनट का फ्री डेमो बुक करें',
    resetAllDataBtn: 'सारा सेव डेटा मिटाएँ',
    resetConfirmText: 'इससे इस फ़ोन के सभी सामान और बिक्री हट जाएँगी।',
    resetConfirmYes: 'सब मिटाएँ',
    dataClearedToast: 'सारा डेटा मिटा दिया गया।',
    founderViewLink: 'फ़ाउंडर व्यू (पायलट रिपोर्ट)',
    founderTitle: 'फ़ाउंडर व्यू — पायलट रिपोर्ट',
    founderSubtitle: 'दुकान विज़िट के दौरान इकट्ठा किए गए सुझाव और डेमो अनुरोध।',
    backToFeedback: 'सुझाव पेज पर वापस जाएँ',
    founderResponsesCount: 'कुल जवाब',
    founderEasyAddPct: 'जोड़ना आसान',
    founderDailyUsePct: 'रोज़ उपयोग (हाँ)',
    founderPay199Pct: '₹199 देने को तैयार',
    founderFeedbackListTitle: 'दुकानदारों के सुझाव',
    founderNoFeedback: 'अभी तक कोई सुझाव दर्ज नहीं हुआ है।',
    founderDemoLeadsTitle: 'डेमो बुकिंग अनुरोध',
    founderNoDemos: 'अभी तक कोई डेमो अनुरोध सेव नहीं हुआ है।',
    founderCopySummary: 'पायलट रिपोर्ट कॉपी करें',
    founderCopiedToast: 'पायलट रिपोर्ट कॉपी हो गई।',
    signInWithGoogle: 'Google से लॉगिन करें',
    signInShort: 'Google लॉगिन',
    signingIn: 'लॉगिन हो रहा है...',
    signOut: 'लॉगआउट',
    signedInAs: 'लॉगिन ईमेल',
    accountSectionTitle: 'Google अकाउंट और बैकअप',
    accountLocalOnlyDesc:
      'अभी डेटा सिर्फ इस फ़ोन पर सेव है। बैकअप के लिए अपने Google ईमेल से लॉगिन करें।',
    accountCloudSyncedDesc:
      'आपका स्टॉक और बिक्री आपके Google अकाउंट में सुरक्षित है।',
    signInSuccessToast: 'Google से लॉगिन हो गया।',
    signOutSuccessToast: 'लॉगआउट हो गया।',
    signInErrorToast: 'Google लॉगिन पूरा नहीं हो सका। कृपया फिर से कोशिश करें।',
  },
};

export function formatUnit(unit: UnitType, lang: Language): string {
  const map: Record<UnitType, { en: string; hi: string }> = {
    pcs: { en: 'pcs', hi: 'पीस' },
    kg: { en: 'kg', hi: 'किलो' },
    litre: { en: 'litre', hi: 'लीटर' },
    packet: { en: 'packet', hi: 'पैकेट' },
  };
  return map[unit][lang];
}

export function formatHistoryType(type: HistoryType, lang: Language): string {
  const map: Record<HistoryType, { en: string; hi: string }> = {
    initial: { en: 'Opening stock', hi: 'शुरुआती स्टॉक' },
    received: { en: 'Stock Received', hi: 'स्टॉक आया' },
    sold: { en: 'Stock Sold', hi: 'स्टॉक बिका' },
    quick_add: { en: 'Quick +1', hi: 'तुरंत +1' },
    quick_remove: { en: 'Quick -1', hi: 'तुरंत -1' },
    edited: { en: 'Manual Edit', hi: 'सीधा बदलाव' },
  };
  return map[type][lang];
}
