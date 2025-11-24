# 📡 API Service Layer

Dokumentasi untuk menggunakan REST API NestJS dari React Native mobile app.

## 🚀 Setup

### 1. Install Dependencies

Pastikan sudah install semua dependencies yang diperlukan:

```bash
# Dari root monorepo
pnpm install

# Atau install manual di mobile app
cd apps/mobile/react
pnpm add axios @react-native-async-storage/async-storage
```

### 2. Konfigurasi API Base URL

Edit file `src/services/api/config.ts` untuk mengatur base URL sesuai environment:

**Untuk Android Emulator:**
```typescript
const API_BASE_URL = 'http://10.0.2.2:3000';
```

**Untuk Physical Device (Android/iOS):**
```typescript
// Ganti dengan IP komputer Anda di jaringan yang sama
const API_BASE_URL = 'http://192.168.1.100:3000';
```

**Untuk iOS Simulator:**
```typescript
const API_BASE_URL = 'http://localhost:3000';
```

**Cara menemukan IP komputer:**
- Windows: `ipconfig` (lihat IPv4 Address)
- Mac/Linux: `ifconfig` atau `ip addr`

### 3. Android Network Security

Pastikan `AndroidManifest.xml` sudah memiliki permission untuk internet dan allow cleartext traffic untuk development:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

Dan di `android/app/src/main/res/xml/network_security_config.xml` (jika ada), pastikan allow cleartext traffic untuk development.

## 📚 Cara Menggunakan

### Authentication Service

```typescript
import { authService } from '../services/api';

// Login sebagai mahasiswa
try {
  const response = await authService.loginMahasiswa('12345678', 'password123');
  console.log('Login berhasil!', response.user);
  // Token sudah otomatis disimpan di AsyncStorage
} catch (error) {
  console.error('Login gagal:', error.message);
}

// Login sebagai admin
try {
  const response = await authService.loginAdmin('admin@example.com', 'password123');
  console.log('Login berhasil!', response.user);
} catch (error) {
  console.error('Login gagal:', error.message);
}

// Cek apakah sudah login
const isLoggedIn = await authService.isAuthenticated();

// Get current user
const currentUser = await authService.getCurrentUser();

// Logout
await authService.logout();
```

### Payment Service

```typescript
import { paymentService } from '../services/api';

// Get semua payment untuk mahasiswa
try {
  const payments = await paymentService.getAllPayments('mahasiswa-id', 'pending');
  console.log('Payments:', payments);
} catch (error) {
  console.error('Error:', error.message);
}

// Buat payment baru
try {
  const payment = await paymentService.createPayment({
    mahasiswaId: 'mahasiswa-id',
    biayaId: 'biaya-id',
    amount: 1000000,
    paymentMethod: 'bank_transfer',
  });
  console.log('Payment created:', payment);
} catch (error) {
  console.error('Error:', error.message);
}

// Get biaya default untuk mahasiswa
try {
  const biaya = await paymentService.getBiayaDefault('mahasiswa-id', 1); // semester 1
  console.log('Biaya:', biaya);
} catch (error) {
  console.error('Error:', error.message);
}
```

### Biaya Service

```typescript
import { biayaService } from '../services/api';

// Get semua biaya
try {
  const biayaList = await biayaService.getAllBiaya();
  console.log('Biaya list:', biayaList);
} catch (error) {
  console.error('Error:', error.message);
}

// Get biaya by jurusan
try {
  const biayaJurusan = await biayaService.getAllBiaya('jurusan-id');
  console.log('Biaya jurusan:', biayaJurusan);
} catch (error) {
  console.error('Error:', error.message);
}
```

### Notifikasi Service

```typescript
import { notifikasiService } from '../services/api';

// Get notifikasi untuk user yang sedang login
try {
  const notifikasi = await notifikasiService.getMyNotifikasi('unread');
  console.log('Notifikasi:', notifikasi);
} catch (error) {
  console.error('Error:', error.message);
}

// Get stats notifikasi
try {
  const stats = await notifikasiService.getMyNotifikasiStats();
  console.log('Stats:', stats); // { total: 10, unread: 5, read: 5 }
} catch (error) {
  console.error('Error:', error.message);
}

// Mark notifikasi as read
try {
  await notifikasiService.markAsRead('notifikasi-id');
} catch (error) {
  console.error('Error:', error.message);
}

// Mark all as read
try {
  await notifikasiService.markAllMyNotifikasiAsRead();
} catch (error) {
  console.error('Error:', error.message);
}
```

## 🔐 Authentication Flow

API client secara otomatis akan:
1. Menyimpan token setelah login berhasil
2. Menambahkan token ke header `Authorization: Bearer <token>` pada setiap request
3. Menghapus token jika mendapatkan error 401 (unauthorized)

## 📝 Contoh Integrasi di Screen

### Login Screen

```typescript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { authService } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!nim || !password) {
      Alert.alert('Error', 'NIM dan Password harus diisi');
      return;
    }

    setLoading(true);
    try {
      await authService.loginMahasiswa(nim, password);
      // Login berhasil, navigate ke home
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Login Gagal', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        value={nim}
        onChangeText={setNim}
        placeholder="NIM"
        keyboardType="number-pad"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity onPress={handleLogin} disabled={loading}>
        <Text>{loading ? 'Loading...' : 'Login'}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Payment List Screen

```typescript
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { paymentService, authService } from '../services/api';
import type { PaymentResponse } from '../services/api';

export default function PaymentListScreen() {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user?.id) {
        const data = await paymentService.getAllPayments(user.id);
        setPayments(data);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlatList
      data={payments}
      renderItem={({ item }) => (
        <View>
          <Text>Amount: {item.amount}</Text>
          <Text>Status: {item.status}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
```

## 🐛 Troubleshooting

### Error: Network request failed

**Penyebab:** 
- API base URL salah
- Backend tidak running
- Network tidak terhubung

**Solusi:**
1. Pastikan backend NestJS sudah running di port 3000
2. Cek base URL di `config.ts` sesuai dengan device yang digunakan
3. Untuk physical device, pastikan mobile dan komputer dalam jaringan WiFi yang sama
4. Test API dengan Postman atau browser terlebih dahulu

### Error: 401 Unauthorized

**Penyebab:**
- Token expired atau invalid
- Belum login

**Solusi:**
1. Login ulang
2. Token akan otomatis dihapus dan redirect ke login screen (jika diimplementasikan)

### Error: Cannot connect to API

**Untuk Android Emulator:**
- Gunakan `http://10.0.2.2:3000` (bukan localhost)

**Untuk Physical Device:**
- Gunakan IP komputer (bukan localhost)
- Pastikan firewall tidak memblokir port 3000
- Pastikan mobile dan komputer dalam jaringan yang sama

## 🔗 Endpoint yang Tersedia

### Auth
- `POST /auth/login/mahasiswa` - Login mahasiswa
- `POST /auth/login/admin` - Login admin

### Payment
- `POST /payment` - Buat payment
- `POST /payment/midtrans` - Buat payment dengan Midtrans
- `GET /payment` - Get semua payment
- `GET /payment/:id` - Get payment by ID
- `GET /payment/biaya-default/:mahasiswaId` - Get biaya default
- `PATCH /payment/:id` - Update payment
- `DELETE /payment/:id` - Delete payment

### Biaya
- `POST /biaya` - Buat biaya
- `GET /biaya` - Get semua biaya
- `GET /biaya/:id` - Get biaya by ID
- `PATCH /biaya/:id` - Update biaya
- `DELETE /biaya/:id` - Delete biaya

### Notifikasi
- `POST /notifikasi` - Buat notifikasi
- `GET /notifikasi` - Get semua notifikasi
- `GET /notifikasi/me` - Get notifikasi saya (butuh auth)
- `GET /notifikasi/stats` - Get stats notifikasi
- `GET /notifikasi/me/stats` - Get stats notifikasi saya (butuh auth)
- `GET /notifikasi/:id` - Get notifikasi by ID
- `PATCH /notifikasi/:id` - Update notifikasi
- `PATCH /notifikasi/:id/read` - Mark as read
- `POST /notifikasi/mark-all-read` - Mark all as read
- `POST /notifikasi/me/mark-all-read` - Mark all my notifikasi as read (butuh auth)

### Mahasiswa, Campus, Fakultas, Jurusan
- Endpoint CRUD lengkap tersedia, bisa ditambahkan service sendiri mengikuti pattern yang sama

## 📦 Dependencies

- `axios` - HTTP client
- `@react-native-async-storage/async-storage` - Storage untuk token dan user data

