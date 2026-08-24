import { Category, Order, Script, User, WebsiteSettings } from './types';
import {
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_SCRIPTS,
  INITIAL_SETTINGS,
  INITIAL_USERS,
} from './initialData';

const SCRIPTS_STORAGE_KEY = 'scripthub_scripts_v1';
const CATEGORIES_STORAGE_KEY = 'scripthub_categories_v1';
const SETTINGS_STORAGE_KEY = 'scripthub_settings_v1';
const AUTH_STORAGE_KEY = 'scripthub_admin_auth_v1';
const CART_STORAGE_KEY = 'scripthub_cart_v1';
const USERS_STORAGE_KEY = 'scripthub_users_v1';
const CURRENT_USER_STORAGE_KEY = 'scripthub_current_user_v1';
const ORDERS_STORAGE_KEY = 'scripthub_orders_v1';

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', listener);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', listener);
    }
  };
}

export function notifyStoreChange(): void {
  listeners.forEach((l) => {
    try {
      l();
    } catch (e) {
      console.error('Store listener error:', e);
    }
  });
}

export function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return INITIAL_USERS;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored users:', e);
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    notifyStoreChange();
  } catch (e) {
    console.error('Error saving users:', e);
  }
}

export function getStoredCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading current user:', e);
    return null;
  }
}

export function saveStoredCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
    notifyStoreChange();
  } catch (e) {
    console.error('Error saving current user:', e);
  }
}

export function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return INITIAL_ORDERS;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored orders:', e);
    return INITIAL_ORDERS;
  }
}

export function saveStoredOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    notifyStoreChange();
  } catch (e) {
    console.error('Error saving orders:', e);
  }
}

export function getStoredCart(): Script[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored cart:', e);
    return [];
  }
}

export function saveStoredCart(cart: Script[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    notifyStoreChange();
  } catch (e) {
    console.error('Error saving cart:', e);
  }
}

export function getStoredScripts(): Script[] {
  if (typeof window === 'undefined') return INITIAL_SCRIPTS;
  try {
    const raw = localStorage.getItem(SCRIPTS_STORAGE_KEY);
    if (!raw) {
      return INITIAL_SCRIPTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored scripts:', e);
    return INITIAL_SCRIPTS;
  }
}

export function saveStoredScripts(scripts: Script[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SCRIPTS_STORAGE_KEY, JSON.stringify(scripts));
    notifyStoreChange();
  } catch (e) {
    console.error('Error saving scripts:', e);
  }
}

export function getStoredCategories(): Category[] {
  if (typeof window === 'undefined') return INITIAL_CATEGORIES;
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!raw) {
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading stored categories:', e);
    return INITIAL_CATEGORIES;
  }
}

export function saveStoredCategories(categories: Category[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    notifyStoreChange();
  } catch (e) {
    console.error('Error saving categories:', e);
  }
}

export function getStoredSettings(): WebsiteSettings {
  if (typeof window === 'undefined') return INITIAL_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return INITIAL_SETTINGS;
    }
    return { ...INITIAL_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error reading stored settings:', e);
    return INITIAL_SETTINGS;
  }
}

export function saveStoredSettings(settings: WebsiteSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    notifyStoreChange();
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

export function getStoredAuth(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setStoredAuth(isAuthed: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (isAuthed) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    notifyStoreChange();
  } catch (e) {
    console.error('Error saving auth:', e);
  }
}

export function resetToDefaults(): {
  scripts: Script[];
  categories: Category[];
  settings: WebsiteSettings;
  users: User[];
  orders: Order[];
} {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SCRIPTS_STORAGE_KEY, JSON.stringify(INITIAL_SCRIPTS));
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    notifyStoreChange();
  }
  return {
    scripts: INITIAL_SCRIPTS,
    categories: INITIAL_CATEGORIES,
    settings: INITIAL_SETTINGS,
    users: INITIAL_USERS,
    orders: INITIAL_ORDERS,
  };
}

