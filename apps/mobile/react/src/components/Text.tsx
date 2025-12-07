import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { Fonts } from '../constants/fonts';

export interface TextProps extends RNTextProps {
  /**
   * Font weight variant
   * @default 'regular'
   */
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
}

/**
 * Text component dengan Poppins sebagai default font
 * 
 * @example
 * <Text>Regular text</Text>
 * <Text weight="bold">Bold text</Text>
 * <Text weight="semiBold" style={{ fontSize: 18 }}>Custom styled text</Text>
 */
export const Text: React.FC<TextProps> = ({ 
  weight = 'regular', 
  style, 
  children,
  ...props 
}) => {
  const fontFamily = Fonts[weight];
  
  return (
    <RNText 
      style={[styles.default, { fontFamily }, style]} 
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  default: {
    fontFamily: Fonts.regular,
  },
});

export default Text;

