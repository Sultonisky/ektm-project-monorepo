# Font Constants

File ini berisi konfigurasi font untuk aplikasi mobile. Aplikasi menggunakan **Poppins** sebagai font utama.

## Penggunaan

### Import Font Constants

```typescript
import { Fonts, getFontFamily, FontStyles } from '../constants/fonts';
```

### Menggunakan Font di StyleSheet

```typescript
import { StyleSheet } from 'react-native';
import { Fonts } from '../constants/fonts';

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.bold,
    fontSize: 24,
  },
  body: {
    fontFamily: Fonts.regular,
    fontSize: 16,
  },
});
```

### Menggunakan Text Component

```typescript
import { Text } from '../components';

// Default (regular)
<Text>Regular text</Text>

// Dengan weight
<Text weight="bold">Bold text</Text>
<Text weight="semiBold">Semi bold text</Text>
<Text weight="medium">Medium text</Text>

// Dengan custom style
<Text weight="bold" style={{ fontSize: 20, color: '#000' }}>
  Custom styled text
</Text>
```

### Font Styles Predefined

```typescript
import { FontStyles } from '../constants/fonts';

// Headings
<Text style={FontStyles.h1}>Heading 1</Text>
<Text style={FontStyles.h2}>Heading 2</Text>
<Text style={FontStyles.h3}>Heading 3</Text>

// Body text
<Text style={FontStyles.body}>Body text</Text>
<Text style={FontStyles.bodySmall}>Small body text</Text>

// Labels & Buttons
<Text style={FontStyles.label}>Label text</Text>
<Text style={FontStyles.button}>Button text</Text>
```

## Font Variants

- `Poppins-Regular` - Font default untuk body text
- `Poppins-Medium` - Font untuk emphasis sedang
- `Poppins-SemiBold` - Font untuk headings dan emphasis kuat
- `Poppins-Bold` - Font untuk headings utama dan emphasis sangat kuat

