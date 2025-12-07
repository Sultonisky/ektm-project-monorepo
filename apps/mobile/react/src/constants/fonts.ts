/**
 * Font constants untuk aplikasi EKTM
 * Menggunakan Poppins sebagai font utama
 */

export const Fonts = {
  // Poppins font family
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
  
  // Default font
  default: 'Poppins-Regular',
} as const;

export type FontWeight = 'regular' | 'medium' | 'semiBold' | 'bold';

/**
 * Helper function untuk mendapatkan font family berdasarkan weight
 */
export const getFontFamily = (weight: FontWeight = 'regular'): string => {
  return Fonts[weight];
};

/**
 * Font styles yang sering digunakan
 */
export const FontStyles = {
  // Headings
  h1: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  h4: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    lineHeight: 24,
  },
  
  // Body text
  body: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: Fonts.regular,
    fontSize: 18,
    lineHeight: 28,
  },
  
  // Labels & Captions
  label: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  
  // Buttons
  button: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    lineHeight: 24,
  },
  buttonSmall: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
} as const;

