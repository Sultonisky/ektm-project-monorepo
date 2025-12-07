import React, { useState, useEffect } from 'react';
import {
  View,
  Text as RNText,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  TextProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Wrapper Text component dengan font Poppins sebagai default
const Text = ({ style, ...props }: TextProps) => (
  <RNText style={[{ fontFamily: 'Poppins-Regular' }, style]} {...props} />
);

export default function InfoBeritaScreen() {
  const navigation = useNavigation<any>();
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const carouselRef = React.useRef<FlatList>(null);

  const categories = ['Semua', 'Mahasiswa', 'Kegiatan', 'Beasiswa'];

  // Featured news carousel data
  const featuredNews = [
    {
      id: 1,
      image: require('@images/dummy_berita/Rectangle_berita.png'),
      title: 'Yuk, Daftar Beasiswanya Sekarang!',
      subtitle: 'Beasiswa terbatas, manfaatnya maksimal.',
    },
    {
      id: 2,
      image: require('@images/dummy_berita/Rectangle2_berita.png'),
      title: 'Untuk Kita ya',
      subtitle: 'Mendukung',
    },
    {
      id: 3,
      image: require('@images/dummy_berita/Rectangle3_berita.png'),
      title: 'Beasiswa Terbaru',
      subtitle: 'Dapatkan kesempatan emas',
    },
  ];

  // News articles data
  const newsArticles = [
    {
      id: 1,
      image: require('@images/dummy_berita/berita1.png'),
      title: 'Update Seputar Dunia Mahasiswa',
      description: 'Kabar terbaru tentang perkuliahan, komunit...',
      time: '10 menit lalu',
      category: 'Mahasiswa',
    },
    {
      id: 2,
      image: require('@images/dummy_berita/berita2.png'),
      title: 'Ada Apa di Kampus Minggu Ini?',
      description: 'Cek kegiatan yang bisa kamu ikuti',
      time: '1 jam lalu',
      category: 'Kegiatan',
    },
    {
      id: 3,
      image: require('@images/dummy_berita/berita3.png'),
      title: 'Beasiswa Terbaru Buat Kamu',
      description: 'Daftar sekarang sebelum kuotanya habis. Ja...',
      time: '10 menit lalu',
      category: 'Beasiswa',
    },
    {
      id: 4,
      image: require('@images/dummy_berita/berita4.png'),
      title: 'Workshop Keterampilan Digital',
      description: 'Pelatihan untuk meningkatkan soft skill',
      time: '1 jam lalu',
      category: 'Kegiatan',
    },
    {
      id: 5,
      image: require('@images/dummy_berita/berita5.png'),
      title: 'Pengumuman Jadwal Ujian',
      description: 'Jadwal ujian semester akan diumumkan',
      time: '2 jam lalu',
      category: 'Mahasiswa',
    },
    {
      id: 6,
      image: require('@images/dummy_berita/berita6.png'),
      title: 'Data Mahasiswa Update',
      description: 'Informasi terbaru tentang data mahasiswa',
      time: '3 jam lalu',
      category: 'Mahasiswa',
    },
  ];

  const onCarouselScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const itemWidth = 314; // carouselItem width (294) + left margin (10) + right margin (10)
    const index = Math.round(scrollPosition / itemWidth);
    setActiveCarouselIndex(index);
  };

  // Auto-scroll carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCarouselIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % featuredNews.length;
        const offset = nextIndex * 314; // itemWidth
        carouselRef.current?.scrollToOffset({
          offset: offset,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [featuredNews.length]);

  const renderCarouselItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.carouselItem}
      onPress={() => navigation.navigate('DetailBerita', {
        id: item.id,
        title: item.title,
        description: item.subtitle,
        image: item.image,
        time: 'Baru saja',
        category: 'Berita Terbaru',
      })}
    >
      <Image source={item.image} style={styles.carouselImage} resizeMode="cover" />
      <View style={styles.carouselContent}>
        <Text style={styles.carouselTitle}>{item.title}</Text>
        <Text style={styles.carouselSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderNewsItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.newsItem}
      onPress={() => navigation.navigate('DetailBerita', {
        id: item.id,
        title: item.title,
        description: item.description,
        image: item.image,
        time: item.time,
        category: item.category,
      })}
    >
      <Image source={item.image} style={styles.newsImage} resizeMode="cover" />
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.newsTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Berita</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Berita Terbaru Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Berita Terbaru</Text>
        </View>

        {/* Carousel */}
        <View style={{ height: 200 }}>
          <FlatList
            ref={carouselRef}
            data={featuredNews}
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={onCarouselScroll}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={314}
            snapToAlignment="start"
          />
        </View>

        {/* Carousel Indicator */}
        <View style={styles.indicatorContainer}>
          {featuredNews.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                activeCarouselIndex === index && styles.indicatorActive,
              ]}
            />
          ))}
        </View>

        <View style={{ height: 20 }} />

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                activeCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 20 }} />

        {/* News List */}
        <FlatList
          data={activeCategory === 'Semua' 
            ? newsArticles 
            : newsArticles.filter(article => article.category === activeCategory)
          }
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },
  
  // ScrollView styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },
  sectionIcon: {
    fontSize: 20,
  },
  
  // Carousel styles
  carouselItem: {
    width: 294,
    height: 162,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 0,
    position: 'relative',
    margin: 10,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  carouselTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: '#fff',
    marginBottom: 4,
  },
  carouselSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#fff',
  },
  
  // Indicator styles
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 4,
  },
  indicatorActive: {
    width: 24,
    backgroundColor: '#1E69DD',
  },
  
  // Category styles
  categoryContainer: {
    paddingVertical: 4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    // borderWidth: 1,
    // borderColor: '#E0E0E0',
  },
  categoryButtonActive: {
    backgroundColor: '#1E69DD',
    borderColor: '#1E69DD',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
  },
  categoryTextActive: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  
  // News Item styles
  newsItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 2,
  },
  newsImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  newsContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  newsTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
    marginBottom: 4,
  },
  newsDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginBottom: 4,
  },
  newsTime: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#999',
  },
  
  // FAB styles
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E69DD',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
    color: '#fff',
  },
});
