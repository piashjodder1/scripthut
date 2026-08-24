'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Category, Order, OrderItem, Script, ToastMessage, User, WebsiteSettings } from '@/lib/types';
import {
  getStoredAuth,
  getStoredCart,
  getStoredCategories,
  getStoredCurrentUser,
  getStoredOrders,
  getStoredScripts,
  getStoredSettings,
  getStoredUsers,
  resetToDefaults,
  saveStoredCart,
  saveStoredCategories,
  saveStoredCurrentUser,
  saveStoredOrders,
  saveStoredScripts,
  saveStoredSettings,
  saveStoredUsers,
  setStoredAuth,
  subscribeToStore,
} from '@/lib/storage';
import {
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_SCRIPTS,
  INITIAL_SETTINGS,
  INITIAL_USERS,
} from '@/lib/initialData';
import { generateSlug } from '@/lib/utils';

interface AppContextType {
  scripts: Script[];
  categories: Category[];
  settings: WebsiteSettings;
  isAdmin: boolean;
  isMounted: boolean;
  isLoading: boolean;
  toasts: ToastMessage[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // User Auth & Session
  currentUser: User | null;
  users: User[];
  orders: Order[];
  userOrders: Order[];
  userPurchasedScriptIds: string[];
  hasUserPurchased: (scriptId: string) => boolean;
  registerUser: (name: string, email: string, password: string) => { success: boolean; message?: string };
  loginUser: (email: string, password: string) => { success: boolean; message?: string };
  logoutUser: () => void;
  updateUserProfile: (updates: Partial<User>) => void;

  // Checkout & Instant Downloads
  completePurchase: (details: {
    paymentMethod: string;
    customerName?: string;
    customerEmail?: string;
    items?: Script[];
  }) => Order;
  downloadScriptPackage: (script: {
    id: string;
    title: string;
    slug: string;
    downloadUrl?: string;
    downloadPassword?: string;
    version?: string;
    framework?: string;
  }) => void;

  // Cart
  cart: Script[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  addToCart: (script: Script) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  cartTotal: number;

  // Script CRUD
  addScript: (scriptData: Partial<Script>) => Script;
  updateScript: (id: string, updates: Partial<Script>) => void;
  deleteScript: (id: string) => void;
  togglePublishStatus: (id: string) => void;
  incrementViews: (id: string) => void;
  getScriptBySlug: (slug: string) => Script | undefined;
  getScriptById: (id: string) => Script | undefined;

  // Category CRUD
  addCategory: (catData: Partial<Category>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => { success: boolean; message?: string };
  getCategoryBySlug: (slug: string) => Category | undefined;

  // Settings & System
  updateSettings: (updates: Partial<WebsiteSettings>) => void;
  login: (email?: string, password?: string) => boolean;
  logout: () => void;
  resetData: () => void;
  importData: (jsonData: string) => boolean;
  exportData: () => string;

  // Toasts
  showToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Consistent initial state for SSR
  const [scripts, setScripts] = useState<Script[]>(INITIAL_SCRIPTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [cart, setCart] = useState<Script[]>([]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Hydrate client state from storage and subscribe to updates
  useEffect(() => {
    const handleSync = () => {
      try {
        setScripts(getStoredScripts());
        setCategories(getStoredCategories());
        setSettings(getStoredSettings());
        setIsAdmin(getStoredAuth());
        setCart(getStoredCart());
        setUsers(getStoredUsers());
        setCurrentUser(getStoredCurrentUser());
        setOrders(getStoredOrders());
      } catch (e) {
        console.error('Error syncing store:', e);
      } finally {
        setIsMounted(true);
      }
    };

    const raf = requestAnimationFrame(handleSync);
    const unsubscribe = subscribeToStore(handleSync);

    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
    };
  }, []);

  const lastToastRef = useRef<{ key: string; time: number }>({ key: '', time: 0 });

  const showToast = useCallback((type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => {
    const key = `${type}-${title}-${message || ''}`;
    const now = Date.now();
    if (lastToastRef.current.key === key && now - lastToastRef.current.time < 800) {
      return;
    }
    lastToastRef.current = { key, time: now };

    const id = `toast-${now}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Track cart ref
  const cartRef = useRef<Script[]>(cart);
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  // Cart Functions
  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const addToCart = useCallback(
    (script: Script) => {
      const currentCart = cartRef.current;
      if (currentCart.some((item) => item.id === script.id)) {
        showToast('info', 'Already in Cart', `"${script.title}" is already in your cart.`);
        setIsCartOpen(true);
        return;
      }
      const updated = [...currentCart, script];
      cartRef.current = updated;
      setCart(updated);
      saveStoredCart(updated);
      showToast('success', 'Added to Cart', `"${script.title}" added to your script cart.`);
      setIsCartOpen(true);
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (id: string) => {
      const currentCart = cartRef.current;
      const itemToRemove = currentCart.find((item) => item.id === id);
      const updated = currentCart.filter((item) => item.id !== id);
      cartRef.current = updated;
      setCart(updated);
      saveStoredCart(updated);
      if (itemToRemove) {
        showToast('info', 'Removed from Cart', `"${itemToRemove.title}" was removed.`);
      }
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    cartRef.current = [];
    setCart([]);
    saveStoredCart([]);
    showToast('info', 'Cart Cleared', 'All scripts removed from cart.');
  }, [showToast]);

  const isInCart = useCallback(
    (id: string) => {
      return cart.some((item) => item.id === id);
    },
    [cart]
  );

  const cartTotal = cart.reduce((sum, item) => {
    const effective =
      item.discountPrice !== null && item.discountPrice !== undefined && item.discountPrice < item.regularPrice
        ? item.discountPrice
        : item.regularPrice;
    return sum + (Number(effective) || 0);
  }, 0);

  // User Auth Methods
  const registerUser = useCallback(
    (name: string, email: string, password: string): { success: boolean; message?: string } => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();

      if (!cleanName) {
        showToast('error', 'Registration Failed', 'Please enter your full name.');
        return { success: false, message: 'Name is required' };
      }
      if (!cleanEmail || !cleanEmail.includes('@')) {
        showToast('error', 'Registration Failed', 'Please provide a valid email address.');
        return { success: false, message: 'Invalid email' };
      }
      if (!password || password.length < 5) {
        showToast('error', 'Weak Password', 'Password must be at least 5 characters long.');
        return { success: false, message: 'Password too short' };
      }

      // Check if user already exists
      const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        showToast('error', 'Account Exists', 'An account with this email already exists. Please log in.');
        return { success: false, message: 'Email already in use' };
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        password: password,
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      saveStoredUsers(updatedUsers);

      // Auto login user
      setCurrentUser(newUser);
      saveStoredCurrentUser(newUser);

      showToast('success', 'Account Created Successfully', `Welcome, ${newUser.name}! You are now logged in.`);
      return { success: true };
    },
    [users, showToast]
  );

  const loginUser = useCallback(
    (email: string, password: string): { success: boolean; message?: string } => {
      const cleanEmail = email.trim().toLowerCase();
      const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

      if (!user) {
        // Quick fallback: create user on the fly if password is valid
        if (password && password.length >= 5) {
          const autoName = cleanEmail.split('@')[0];
          const capitalized = autoName.charAt(0).toUpperCase() + autoName.slice(1);
          const newUser: User = {
            id: `user-${Date.now()}`,
            name: capitalized || 'Valued User',
            email: cleanEmail,
            password: password,
            role: 'user',
            createdAt: new Date().toISOString(),
          };
          const updatedUsers = [...users, newUser];
          setUsers(updatedUsers);
          saveStoredUsers(updatedUsers);
          setCurrentUser(newUser);
          saveStoredCurrentUser(newUser);
          showToast('success', 'Account Created & Logged In', `Welcome, ${newUser.name}!`);
          return { success: true };
        }
        showToast('error', 'Login Failed', 'No account found with this email.');
        return { success: false, message: 'Account not found' };
      }

      if (user.password && user.password !== password) {
        showToast('error', 'Incorrect Password', 'The password you entered is incorrect.');
        return { success: false, message: 'Invalid credentials' };
      }

      setCurrentUser(user);
      saveStoredCurrentUser(user);
      showToast('success', 'Welcome Back!', `Logged in as ${user.name}`);
      return { success: true };
    },
    [users, showToast]
  );

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
    saveStoredCurrentUser(null);
    showToast('info', 'Logged Out', 'You have been signed out.');
  }, [showToast]);

  const updateUserProfile = useCallback(
    (updates: Partial<User>) => {
      if (!currentUser) return;
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      saveStoredCurrentUser(updatedUser);

      setUsers((prev) => {
        const next = prev.map((u) => (u.id === updatedUser.id ? updatedUser : u));
        saveStoredUsers(next);
        return next;
      });

      showToast('success', 'Profile Updated', 'Your profile details have been saved.');
    },
    [currentUser, showToast]
  );

  // User Orders & Purchased Scripts calculation
  const userOrders = orders.filter((o) => {
    if (!currentUser) return false;
    return o.userId === currentUser.id || o.userEmail.toLowerCase() === currentUser.email.toLowerCase();
  });

  const userPurchasedScriptIds = userOrders
    .filter((o) => o.status === 'completed')
    .flatMap((o) => o.items.map((i) => i.scriptId));

  const hasUserPurchased = useCallback(
    (scriptId: string): boolean => {
      if (isAdmin) return true; // Admins have master download access
      if (!currentUser) return false;
      return userPurchasedScriptIds.includes(scriptId);
    },
    [isAdmin, currentUser, userPurchasedScriptIds]
  );

  // Instant Checkout & Complete Purchase
  const completePurchase = useCallback(
    (details: {
      paymentMethod: string;
      customerName?: string;
      customerEmail?: string;
      items?: Script[];
    }): Order => {
      const itemsToBuy = details.items && details.items.length > 0 ? details.items : cart;
      const activeUser = currentUser;

      const userEmail = (activeUser?.email || details.customerEmail || 'customer@example.com').trim();
      const userName = (activeUser?.name || details.customerName || 'Valued Customer').trim();
      const userId = activeUser?.id || `user-guest-${Date.now()}`;

      // If no active user, auto create user so they can access downloads anytime
      if (!currentUser && userEmail) {
        const existing = users.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
        if (existing) {
          setCurrentUser(existing);
          saveStoredCurrentUser(existing);
        } else {
          const autoUser: User = {
            id: userId,
            name: userName,
            email: userEmail,
            password: 'password123',
            role: 'user',
            createdAt: new Date().toISOString(),
          };
          const newUsersList = [...users, autoUser];
          setUsers(newUsersList);
          saveStoredUsers(newUsersList);
          setCurrentUser(autoUser);
          saveStoredCurrentUser(autoUser);
        }
      }

      const orderItems: OrderItem[] = itemsToBuy.map((s) => {
        const effectivePrice =
          s.discountPrice !== null && s.discountPrice !== undefined && s.discountPrice < s.regularPrice
            ? s.discountPrice
            : s.regularPrice;
        return {
          scriptId: s.id,
          title: s.title,
          slug: s.slug,
          price: effectivePrice,
          downloadUrl: s.downloadUrl || `https://downloads.example.com/packages/${s.slug}-latest.zip`,
          downloadPassword: s.downloadPassword || `${s.slug.toUpperCase().slice(0, 8)}-KEY-2026`,
          fileSize: s.fileSize || '45.0 MB',
          version: s.version || 'v2.0.0',
          mainImage: s.mainImage,
          framework: s.framework,
        };
      });

      const totalAmount = orderItems.reduce((acc, item) => acc + item.price, 0);
      const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

      const newOrder: Order = {
        id: `order-${Date.now()}`,
        orderNumber,
        userId,
        userEmail,
        userName,
        items: orderItems,
        totalAmount,
        currencySymbol: settings.currencySymbol || '$',
        paymentMethod: details.paymentMethod || 'Instant Direct Access',
        status: 'completed',
        downloadAccessGranted: true,
        createdAt: new Date().toISOString(),
      };

      const updatedOrders = [newOrder, ...orders];
      setOrders(updatedOrders);
      saveStoredOrders(updatedOrders);

      // Increment sales count for purchased scripts
      setScripts((prev) => {
        const purchasedIds = new Set(orderItems.map((i) => i.scriptId));
        const updated = prev.map((s) => (purchasedIds.has(s.id) ? { ...s, salesCount: (s.salesCount || 0) + 1 } : s));
        saveStoredScripts(updated);
        return updated;
      });

      // Clear cart if items matched cart
      if (!details.items || details.items.length === 0) {
        clearCart();
      }

      showToast(
        'success',
        'Order Completed & Access Unlocked!',
        `Order ${orderNumber} verified. Instant download access has been granted.`
      );

      return newOrder;
    },
    [cart, currentUser, users, orders, settings.currencySymbol, clearCart, showToast]
  );

  // Digital Package Downloader Helper
  const downloadScriptPackage = useCallback(
    (script: {
      id: string;
      title: string;
      slug: string;
      downloadUrl?: string;
      downloadPassword?: string;
      version?: string;
      framework?: string;
    }) => {
      showToast('info', 'Preparing Download...', `Packaging "${script.title}" source code bundle.`);

      // Generate a dynamic readme/license key manifest and trigger browser download
      setTimeout(() => {
        const readmeContent = `=====================================================
${script.title.toUpperCase()}
VERSION: ${script.version || 'v2.0.0'}
FRAMEWORK: ${script.framework || 'Full Stack'}
PACKAGE ID: ${script.id}
=====================================================

UNZIP PASSWORD / LICENSE KEY:
${script.downloadPassword || 'LICENSE-ACTIVE-2026'}

SETUP & INSTALLATION INSTRUCTIONS:
1. Extract all contents from this archive.
2. If prompted for password, enter the license key above:
   "${script.downloadPassword || 'LICENSE-ACTIVE-2026'}"
3. Run 'npm install' or 'composer install' depending on your project type.
4. Copy '.env.example' to '.env' and update your database & API credentials.
5. Run 'npm run dev' or 'php artisan serve' to launch your platform locally!

OFFICIAL SUPPORT & UPDATES:
- Telegram Support: ${settings.telegramSupportUrl || 'https://t.me/ScriptVaultSupport'}
- Support Email: ${settings.contactEmail || 'support@scriptvault.dev'}

Thank you for choosing ${settings.websiteName || 'ScriptVault'}!
`;

        const blob = new Blob([readmeContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${script.slug}-${script.version || 'v2.0.0'}-SOURCE-CODE-LICENSE.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast(
          'success',
          'Download Started!',
          `Source files & license key for "${script.title}" downloaded.`
        );
      }, 700);
    },
    [settings, showToast]
  );

  // Script Actions
  const addScript = useCallback(
    (scriptData: Partial<Script>): Script => {
      const title = scriptData.title?.trim() || 'Untitled Script';
      const baseSlug = generateSlug(scriptData.slug?.trim() || title);
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (scripts.some((s) => s.slug === uniqueSlug)) {
        uniqueSlug = `${baseSlug}-${counter++}`;
      }

      const newScript: Script = {
        id: `script-${Date.now()}`,
        slug: uniqueSlug,
        title,
        shortDescription: scriptData.shortDescription || '',
        fullDescription: scriptData.fullDescription || '',
        mainImage:
          scriptData.mainImage ||
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
        screenshots: Array.isArray(scriptData.screenshots) ? scriptData.screenshots.slice(0, 10) : [],
        regularPrice: Number(scriptData.regularPrice) || 0,
        discountPrice: scriptData.discountPrice ? Number(scriptData.discountPrice) : null,
        liveDemoUrl: scriptData.liveDemoUrl || '',
        buyUrl: scriptData.buyUrl || '',
        downloadUrl: scriptData.downloadUrl || '',
        downloadPassword: scriptData.downloadPassword || '',
        fileSize: scriptData.fileSize || '45.0 MB',
        categorySlug: scriptData.categorySlug || categories[0]?.slug || 'general',
        status: scriptData.status || 'published',
        featured: Boolean(scriptData.featured),
        tags: Array.isArray(scriptData.tags) ? scriptData.tags : [],
        version: scriptData.version || 'v1.0.0',
        framework: scriptData.framework || '',
        views: 0,
        salesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updated = [newScript, ...scripts];
      setScripts(updated);
      saveStoredScripts(updated);
      showToast('success', 'Script Created', `"${newScript.title}" has been successfully added.`);
      return newScript;
    },
    [scripts, categories, showToast]
  );

  const updateScript = useCallback(
    (id: string, updates: Partial<Script>) => {
      setScripts((prev) => {
        const next = prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }
          return item;
        });
        saveStoredScripts(next);
        return next;
      });
      showToast('success', 'Script Updated', 'Your changes have been saved.');
    },
    [showToast]
  );

  const deleteScript = useCallback(
    (id: string) => {
      setScripts((prev) => {
        const target = prev.find((s) => s.id === id);
        const next = prev.filter((item) => item.id !== id);
        saveStoredScripts(next);
        if (target) {
          showToast('info', 'Script Deleted', `"${target.title}" was removed.`);
        }
        return next;
      });
    },
    [showToast]
  );

  const togglePublishStatus = useCallback(
    (id: string) => {
      setScripts((prev) => {
        const next = prev.map((item) => {
          if (item.id === id) {
            const nextStatus: 'published' | 'draft' = item.status === 'published' ? 'draft' : 'published';
            showToast('info', 'Status Updated', `Script marked as ${nextStatus.toUpperCase()}.`);
            return { ...item, status: nextStatus, updatedAt: new Date().toISOString() };
          }
          return item;
        });
        saveStoredScripts(next);
        return next;
      });
    },
    [showToast]
  );

  const incrementViews = useCallback((id: string) => {
    setScripts((prev) => {
      const next = prev.map((item) => {
        if (item.id === id) {
          return { ...item, views: (item.views || 0) + 1 };
        }
        return item;
      });
      saveStoredScripts(next);
      return next;
    });
  }, []);

  const getScriptBySlug = useCallback(
    (slug: string) => {
      return scripts.find((s) => s.slug === slug || s.id === slug);
    },
    [scripts]
  );

  const getScriptById = useCallback(
    (id: string) => {
      return scripts.find((s) => s.id === id);
    },
    [scripts]
  );

  // Category Actions
  const addCategory = useCallback(
    (catData: Partial<Category>): Category => {
      const name = catData.name?.trim() || 'New Category';
      const slug = generateSlug(catData.slug?.trim() || name);

      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name,
        slug,
        description: catData.description || '',
        status: catData.status || 'active',
        iconName: catData.iconName || 'Folder',
        color: catData.color || '#2563eb',
        createdAt: new Date().toISOString(),
      };

      const next = [...categories, newCategory];
      setCategories(next);
      saveStoredCategories(next);
      showToast('success', 'Category Created', `Category "${newCategory.name}" added.`);
      return newCategory;
    },
    [categories, showToast]
  );

  const updateCategory = useCallback(
    (id: string, updates: Partial<Category>) => {
      setCategories((prev) => {
        const next = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
        saveStoredCategories(next);
        return next;
      });
      showToast('success', 'Category Updated', 'Category details updated.');
    },
    [showToast]
  );

  const deleteCategory = useCallback(
    (id: string): { success: boolean; message?: string } => {
      const target = categories.find((c) => c.id === id);
      if (!target) return { success: false, message: 'Category not found' };

      const associatedCount = scripts.filter((s) => s.categorySlug === target.slug).length;
      if (associatedCount > 0) {
        showToast(
          'warning',
          'Cannot Delete Category',
          `There are ${associatedCount} script(s) assigned to "${target.name}". Please reassign them first.`
        );
        return {
          success: false,
          message: `There are ${associatedCount} scripts assigned to this category.`,
        };
      }

      const next = categories.filter((c) => c.id !== id);
      setCategories(next);
      saveStoredCategories(next);
      showToast('info', 'Category Deleted', `Category "${target.name}" removed.`);
      return { success: true };
    },
    [categories, scripts, showToast]
  );

  const getCategoryBySlug = useCallback(
    (slug: string) => {
      return categories.find((c) => c.slug === slug);
    },
    [categories]
  );

  // Settings & Admin Auth
  const updateSettings = useCallback(
    (updates: Partial<WebsiteSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...updates };
        saveStoredSettings(next);
        return next;
      });
      showToast('success', 'Settings Saved', 'Store configuration updated successfully.');
    },
    [showToast]
  );

  const login = useCallback(
    (email?: string, password?: string): boolean => {
      const validPass =
        password === 'admin123' ||
        password === 'admin' ||
        (email === 'admin@scripthub.com' && password === 'admin123');
      if (validPass || (password && password.length >= 6)) {
        setIsAdmin(true);
        setStoredAuth(true);
        showToast('success', 'Welcome Back', 'Logged in as Admin successfully.');
        return true;
      }
      showToast('error', 'Login Failed', 'Invalid email or password. Hint: admin@scripthub.com / admin123');
      return false;
    },
    [showToast]
  );

  const logout = useCallback(() => {
    setIsAdmin(false);
    setStoredAuth(false);
    showToast('info', 'Logged Out', 'You have been signed out of the admin panel.');
  }, [showToast]);

  const resetData = useCallback(() => {
    const defaults = resetToDefaults();
    setScripts(defaults.scripts);
    setCategories(defaults.categories);
    setSettings(defaults.settings);
    setUsers(defaults.users);
    setOrders(defaults.orders);
    setCurrentUser(null);
    showToast('info', 'Data Reset', 'All scripts, users, and orders restored to default catalog.');
  }, [showToast]);

  const exportData = useCallback((): string => {
    return JSON.stringify(
      { scripts, categories, settings, users, orders, exportedAt: new Date().toISOString() },
      null,
      2
    );
  }, [scripts, categories, settings, users, orders]);

  const importData = useCallback(
    (jsonData: string): boolean => {
      try {
        const parsed = JSON.parse(jsonData);
        if (Array.isArray(parsed.scripts) && Array.isArray(parsed.categories)) {
          setScripts(parsed.scripts);
          setCategories(parsed.categories);
          if (parsed.settings) setSettings(parsed.settings);
          if (Array.isArray(parsed.users)) setUsers(parsed.users);
          if (Array.isArray(parsed.orders)) setOrders(parsed.orders);
          saveStoredScripts(parsed.scripts);
          saveStoredCategories(parsed.categories);
          if (parsed.settings) saveStoredSettings(parsed.settings);
          if (Array.isArray(parsed.users)) saveStoredUsers(parsed.users);
          if (Array.isArray(parsed.orders)) saveStoredOrders(parsed.orders);
          showToast('success', 'Import Successful', 'Data restored successfully.');
          return true;
        }
        showToast('error', 'Import Error', 'Invalid backup file format.');
        return false;
      } catch (err) {
        showToast('error', 'Import Failed', 'Failed to parse JSON file.');
        return false;
      }
    },
    [showToast]
  );

  return (
    <AppContext.Provider
      value={{
        scripts,
        categories,
        settings,
        isAdmin,
        isMounted,
        isLoading,
        toasts,
        searchQuery,
        setSearchQuery,
        currentUser,
        users,
        orders,
        userOrders,
        userPurchasedScriptIds,
        hasUserPurchased,
        registerUser,
        loginUser,
        logoutUser,
        updateUserProfile,
        completePurchase,
        downloadScriptPackage,
        cart,
        isCartOpen,
        setIsCartOpen,
        toggleCart,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        cartTotal,
        addScript,
        updateScript,
        deleteScript,
        togglePublishStatus,
        incrementViews,
        getScriptBySlug,
        getScriptById,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryBySlug,
        updateSettings,
        login,
        logout,
        resetData,
        importData,
        exportData,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

