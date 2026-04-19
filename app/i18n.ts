export type Locale = "en" | "ar";

export const locales: Locale[] = ["en", "ar"];
export const defaultLocale: Locale = "en";

type TranslationSchema = {
  common: {
    appName: string;
    language: string;
    english: string;
    arabic: string;
    save: string;
    cancel: string;
    loading: string;
    search: string;
    filter: string;
    sort: string;
    price: string;
    quantity: string;
    total: string;
    subtotal: string;
    status: string;
    date: string;
    actions: string;
    viewAll: string;
    required: string;
  };
  nav: {
    home: string;
    products: string;
    categories: string;
    cart: string;
    checkout: string;
    orders: string;
    account: string;
    admin: string;
    login: string;
    register: string;
    logout: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    shopNow: string;
    featuredProducts: string;
    bestSellers: string;
    newArrivals: string;
  };
  products: {
    title: string;
    noProducts: string;
    productNumber: string;
    productName: string;
    brand: string;
    color: string;
    addToCart: string;
    outOfStock: string;
    inStock: string;
    category: string;
    allCategories: string;
    minPrice: string;
    maxPrice: string;
  };
  cart: {
    title: string;
    empty: string;
    continueShopping: string;
    removeItem: string;
    updateQuantity: string;
    clearCart: string;
    proceedToCheckout: string;
    codNotice: string;
  };
  checkout: {
    title: string;
    customerInfo: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    notes: string;
    paymentMethod: string;
    cashOnDelivery: string;
    placeOrder: string;
    orderSummary: string;
    successTitle: string;
    successMessage: string;
  };
  orders: {
    title: string;
    orderId: string;
    orderDate: string;
    orderTotal: string;
    orderStatus: string;
    noOrders: string;
    details: string;
    pending: string;
    confirmed: string;
    shipped: string;
    delivered: string;
    cancelled: string;
  };
  admin: {
    dashboard: string;
    products: string;
    orders: string;
    users: string;
    addProduct: string;
    editProduct: string;
    deleteProduct: string;
    manageOrders: string;
    manageUsers: string;
    salesOverview: string;
    customer: string;
    phone: string;
    city: string;
    orderId: string;
    loadingOrders: string;
    noOrdersFound: string;
    updateStatus: string;
  };
  auth: {
    welcomeBack: string;
    loginTitle: string;
    registerTitle: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    noAccount: string;
    haveAccount: string;
    loginButton: string;
    registerButton: string;
    invalidCredentials: string;
  };
  footer: {
    about: string;
    contact: string;
    terms: string;
    privacy: string;
    rights: string;
  };
  errors: {
    generic: string;
    unauthorized: string;
    notFound: string;
  };
};

export const translations: Record<Locale, TranslationSchema> = {
  en: {
    common: {
      appName: "Nasr Sanitary",
      language: "Language",
      english: "English",
      arabic: "Arabic",
      save: "Save",
      cancel: "Cancel",
      loading: "Loading...",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      price: "Price",
      quantity: "Quantity",
      total: "Total",
      subtotal: "Subtotal",
      status: "Status",
      date: "Date",
      actions: "Actions",
      viewAll: "View All",
      required: "This field is required",
    },
    nav: {
      home: "Home",
      products: "Products",
      categories: "Categories",
      cart: "Cart",
      checkout: "Checkout",
      orders: "Orders",
      account: "Account",
      admin: "Admin",
      login: "Login",
      register: "Register",
      logout: "Logout",
    },
    home: {
      heroTitle: "Quality Sanitary Products for Every Home",
      heroSubtitle: "Trusted products, fair prices, and fast delivery.",
      shopNow: "Shop Now",
      featuredProducts: "Featured Products",
      bestSellers: "Best Sellers",
      newArrivals: "New Arrivals",
    },
    products: {
      title: "Products",
      noProducts: "No products found.",
      productNumber: "Product Number",
      productName: "Product Name",
      brand: "Brand",
      color: "Color",
      addToCart: "Add to Cart",
      outOfStock: "Out of Stock",
      inStock: "In Stock",
      category: "Category",
      allCategories: "All Categories",
      minPrice: "Min Price",
      maxPrice: "Max Price",
    },
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty.",
      continueShopping: "Continue Shopping",
      removeItem: "Remove Item",
      updateQuantity: "Update Quantity",
      clearCart: "Clear Cart",
      proceedToCheckout: "Proceed to Checkout",
      codNotice: "Payment method: Cash on Delivery only.",
    },
    checkout: {
      title: "Checkout",
      customerInfo: "Customer Information",
      fullName: "Full Name",
      phone: "Phone Number",
      address: "Address",
      city: "City",
      notes: "Order Notes",
      paymentMethod: "Payment Method",
      cashOnDelivery: "Cash on Delivery",
      placeOrder: "Place Order",
      orderSummary: "Order Summary",
      successTitle: "Order Placed Successfully",
      successMessage: "Thank you for your order. We will contact you soon.",
    },
    orders: {
      title: "My Orders",
      orderId: "Order ID",
      orderDate: "Order Date",
      orderTotal: "Order Total",
      orderStatus: "Order Status",
      noOrders: "You have no orders yet.",
      details: "Details",
      pending: "Pending",
      confirmed: "Confirmed",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    },
    admin: {
      dashboard: "Dashboard",
      products: "Products Management",
      orders: "Orders Management",
      users: "Users Management",
      addProduct: "Add Product",
      editProduct: "Edit Product",
      deleteProduct: "Delete Product",
      manageOrders: "Manage Orders",
      manageUsers: "Manage Users",
      salesOverview: "Sales Overview",
      customer: "Customer",
      phone: "Phone",
      city: "City",
      orderId: "Order ID",
      loadingOrders: "Loading orders...",
      noOrdersFound: "No orders found.",
      updateStatus: "Update Status",
    },
    auth: {
      welcomeBack: "Welcome Back",
      loginTitle: "Login to your account",
      registerTitle: "Create a new account",
      name: "Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      forgotPassword: "Forgot Password?",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      loginButton: "Login",
      registerButton: "Register",
      invalidCredentials: "Invalid email or password.",
    },
    footer: {
      about: "About Us",
      contact: "Contact",
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
      rights: "All rights reserved.",
    },
    errors: {
      generic: "Something went wrong. Please try again.",
      unauthorized: "You are not authorized to access this page.",
      notFound: "The page you are looking for does not exist.",
    },
  },
  ar: {
    common: {
      appName: "نصر للأدوات الصحية",
      language: "اللغة",
      english: "الإنجليزية",
      arabic: "العربية",
      save: "حفظ",
      cancel: "إلغاء",
      loading: "جاري التحميل...",
      search: "بحث",
      filter: "تصفية",
      sort: "ترتيب",
      price: "السعر",
      quantity: "الكمية",
      total: "الإجمالي",
      subtotal: "المجموع الفرعي",
      status: "الحالة",
      date: "التاريخ",
      actions: "الإجراءات",
      viewAll: "عرض الكل",
      required: "هذا الحقل مطلوب",
    },
    nav: {
      home: "الرئيسية",
      products: "المنتجات",
      categories: "الفئات",
      cart: "السلة",
      checkout: "إتمام الطلب",
      orders: "الطلبات",
      account: "الحساب",
      admin: "لوحة التحكم",
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      logout: "تسجيل الخروج",
    },
    home: {
      heroTitle: "منتجات صحية عالية الجودة لكل منزل",
      heroSubtitle: "منتجات موثوقة، أسعار مناسبة، وتوصيل سريع.",
      shopNow: "تسوق الآن",
      featuredProducts: "منتجات مميزة",
      bestSellers: "الأكثر مبيعًا",
      newArrivals: "وصل حديثًا",
    },
    products: {
      title: "المنتجات",
      noProducts: "لا توجد منتجات.",
      productNumber: "رقم المنتج",
      productName: "اسم المنتج",
      brand: "الماركة",
      color: "اللون",
      addToCart: "أضف إلى السلة",
      outOfStock: "غير متوفر",
      inStock: "متوفر",
      category: "الفئة",
      allCategories: "كل الفئات",
      minPrice: "أقل سعر",
      maxPrice: "أعلى سعر",
    },
    cart: {
      title: "سلة التسوق",
      empty: "السلة فارغة.",
      continueShopping: "متابعة التسوق",
      removeItem: "حذف المنتج",
      updateQuantity: "تحديث الكمية",
      clearCart: "إفراغ السلة",
      proceedToCheckout: "متابعة إلى الدفع",
      codNotice: "طريقة الدفع: الدفع عند الاستلام فقط.",
    },
    checkout: {
      title: "إتمام الطلب",
      customerInfo: "بيانات العميل",
      fullName: "الاسم الكامل",
      phone: "رقم الهاتف",
      address: "العنوان",
      city: "المدينة",
      notes: "ملاحظات الطلب",
      paymentMethod: "طريقة الدفع",
      cashOnDelivery: "الدفع عند الاستلام",
      placeOrder: "تأكيد الطلب",
      orderSummary: "ملخص الطلب",
      successTitle: "تم تأكيد الطلب بنجاح",
      successMessage: "شكرًا لطلبك. سنتواصل معك قريبًا.",
    },
    orders: {
      title: "طلباتي",
      orderId: "رقم الطلب",
      orderDate: "تاريخ الطلب",
      orderTotal: "إجمالي الطلب",
      orderStatus: "حالة الطلب",
      noOrders: "لا توجد طلبات حتى الآن.",
      details: "التفاصيل",
      pending: "قيد الانتظار",
      confirmed: "تم التأكيد",
      shipped: "تم الشحن",
      delivered: "تم التسليم",
      cancelled: "ملغي",
    },
    admin: {
      dashboard: "لوحة التحكم",
      products: "إدارة المنتجات",
      orders: "إدارة الطلبات",
      users: "إدارة المستخدمين",
      addProduct: "إضافة منتج",
      editProduct: "تعديل منتج",
      deleteProduct: "حذف منتج",
      manageOrders: "إدارة الطلبات",
      manageUsers: "إدارة المستخدمين",
      salesOverview: "نظرة عامة على المبيعات",
      customer: "العميل",
      phone: "الهاتف",
      city: "المدينة",
      orderId: "رقم الطلب",
      loadingOrders: "جاري تحميل الطلبات...",
      noOrdersFound: "لا توجد طلبات.",
      updateStatus: "تحديث الحالة",
    },
    auth: {
      welcomeBack: "مرحبًا بعودتك",
      loginTitle: "سجّل الدخول إلى حسابك",
      registerTitle: "أنشئ حسابًا جديدًا",
      name: "الاسم",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      forgotPassword: "هل نسيت كلمة المرور؟",
      noAccount: "ليس لديك حساب؟",
      haveAccount: "لديك حساب بالفعل؟",
      loginButton: "تسجيل الدخول",
      registerButton: "إنشاء حساب",
      invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    },
    footer: {
      about: "من نحن",
      contact: "اتصل بنا",
      terms: "الشروط والأحكام",
      privacy: "سياسة الخصوصية",
      rights: "جميع الحقوق محفوظة.",
    },
    errors: {
      generic: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
      unauthorized: "ليس لديك صلاحية للوصول إلى هذه الصفحة.",
      notFound: "الصفحة التي تبحث عنها غير موجودة.",
    },
  },
};

export const getDictionary = (locale: Locale) =>
  translations[locales.includes(locale) ? locale : defaultLocale];

export const getDirection = (locale: Locale): "ltr" | "rtl" =>
  locale === "ar" ? "rtl" : "ltr";
