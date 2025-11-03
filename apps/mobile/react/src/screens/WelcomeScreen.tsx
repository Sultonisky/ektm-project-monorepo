import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';

type Props = { onLogin?: () => void };

const BANNERS = [
  require('@images/banner1.png'),
  require('@images/banner2.png'),
  require('@images/banner3.png'),
];

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width * 0.8;
const BANNER_HEIGHT = 369;

export default function WelcomeScreen({ onLogin }: Props) {
  const listRef = React.useRef<FlatList<any>>(null);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setIndex(prev => {
        const next = (prev + 1) % BANNERS.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.root}>
      <View style={{ height: 50 }} />

      <View style={{ height: 20 }} />
      <View style={styles.headerRow}>
        <Image source={require('@images/logo.png')} style={{ height: 50, width: 50, resizeMode: 'contain' }} />
        <View style={{ width: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeSmall}>Selamat Datang 👋</Text>
          <Text style={styles.title}>Di Universitas Bina Sarana Informatika</Text>
        </View>
      </View>

      <View style={{ height: 30 }} />

      <View style={{ alignItems: 'center', flex: 5, justifyContent: 'center' }}>
        <FlatList
          ref={listRef}
          data={BANNERS}
          keyExtractor={(item, i) => `${i}`}
          renderItem={({ item }) => (
            <View style={styles.bannerCard}>
              <Image source={item} style={styles.bannerImage} />
            </View>
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={e => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
            setIndex(newIndex);
          }}
          getItemLayout={(_, i) => ({ length: BANNER_WIDTH, offset: BANNER_WIDTH * i, index: i })}
        />

        <View style={{ height: 10 }} />
        <View style={styles.dotsRow}>
          {BANNERS.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      </View>

      <View style={{ height: 15 }} />

      <View style={styles.buttonsBox}>
        <TouchableOpacity style={styles.loginBtn} onPress={onLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <View style={{ height: 8 }} />
        <TouchableOpacity
          style={styles.exploreBtn}
          onPress={() => Linking.openURL('https://www.bsiexplore.com/')}
        >
          <Text style={styles.exploreText}>Explore</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  welcomeSmall: { fontSize: 10, color: '#0000008a' },
  title: { fontSize: 12, fontWeight: 'bold', color: '#000' },
  bannerCard: { width: BANNER_WIDTH, height: BANNER_HEIGHT, borderRadius: 30, overflow: 'hidden' },
  bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  dotsRow: { flexDirection: 'row' },
  dot: { height: 8, width: 30, borderRadius: 4, backgroundColor: 'grey', marginHorizontal: 3 },
  dotActive: { backgroundColor: '#2e0894' },
  buttonsBox: { paddingHorizontal: 20, paddingVertical: 40 },
  loginBtn: { backgroundColor: '#0d47a1', minHeight: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  loginText: { color: '#fff', fontSize: 16 },
  exploreBtn: { borderWidth: 1, borderColor: '#0d47a1', minHeight: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  exploreText: { color: '#0d47a1', fontSize: 16 },
});


