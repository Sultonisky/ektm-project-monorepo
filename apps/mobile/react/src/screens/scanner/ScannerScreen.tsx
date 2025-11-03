import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ScannerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanner</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontFamily: 'Poppins-Bold' },
});


