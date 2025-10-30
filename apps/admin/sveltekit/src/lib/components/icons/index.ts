// Re-export Icon component for easier imports
export { default as Icon } from './Icon.svelte';

// Icon name constants for type safety
export const ICON_NAMES = {
  // Navigation
  DASHBOARD: 'dashboard',
  USERS: 'users',
  USER: 'user',
  MAHASISWA: 'mahasiswa',
  PAYMENT: 'payment',
  COURSE: 'course',
  ACADEMIC: 'academic',
  CAMPUS: 'campus',
  FAKULTAS: 'fakultas',
  JURUSAN: 'jurusan',
  BIAYA: 'biaya',
  
  // Actions
  MENU: 'menu',
  PLUS: 'plus',
  EDIT: 'edit',
  DELETE: 'delete',
  SEARCH: 'search',
  EYE: 'eye',
  EYE_OFF: 'eye-off',
  LOGOUT: 'logout',
  LOGOUT_RED: 'logout-red',
  WARNING: 'warning',
  CHECK: 'check',
  X: 'x',
  
  // Navigation arrows
  CHEVRON_LEFT: 'chevron-left',
  CHEVRON_RIGHT: 'chevron-right',
  CHEVRON_UP: 'chevron-up',
  CHEVRON_DOWN: 'chevron-down',
  
  // Other
  CALENDAR: 'calendar',
  CLOCK: 'clock',
  MAIL: 'mail',
  PHONE: 'phone',
  
  // Additional specific icons
  GRADUATION_CAP: 'graduation-cap',
  BUILDING: 'building',
  CREDIT_CARD: 'credit-card',
  BOOK: 'book',
  SETTINGS: 'settings',
  DOWNLOAD: 'download',
  UPLOAD: 'upload',
  FILTER: 'filter',
  SORT: 'sort',
  REFRESH: 'refresh',
  INFO: 'info'
} as const;

export type IconName = typeof ICON_NAMES[keyof typeof ICON_NAMES];
