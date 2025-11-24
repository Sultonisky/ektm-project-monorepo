/**
 * Utility functions untuk API configuration
 */

/**
 * Get API base URL berdasarkan environment
 * 
 * @param customUrl - Custom URL jika ada
 * @returns API base URL
 */
export function getApiBaseUrl(customUrl?: string): string {
  if (customUrl) {
    return customUrl;
  }

  // Development default
  if (__DEV__) {
    // Android emulator default
    return 'http://10.0.2.2:3000';
  }

  // Production URL - sesuaikan dengan production API Anda
  return 'https://your-production-api.com';
}

/**
 * Helper untuk mendapatkan IP address komputer
 * Bisa digunakan untuk physical device testing
 * 
 * Catatan: Ini hanya untuk development.
 * Untuk production, gunakan domain yang sudah di-setup.
 */
export function getLocalNetworkIP(): string {
  // Untuk Windows, gunakan: ipconfig
  // Untuk Mac/Linux, gunakan: ifconfig atau ip addr
  // Contoh: '192.168.1.100'
  // Masukkan IP komputer Anda di sini jika ingin hardcode
  return '';
}

