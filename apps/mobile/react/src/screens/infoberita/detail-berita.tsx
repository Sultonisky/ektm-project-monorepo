import React from 'react';
import {
  View,
  Text as RNText,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextProps,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ChevronLeft, Share2, CheckCircle2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Wrapper Text component dengan font Poppins sebagai default
const Text = ({ style, ...props }: TextProps) => (
  <RNText style={[{ fontFamily: 'Poppins-Regular' }, style]} {...props} />
);

type NewsDetailParams = {
  DetailBerita: {
    id: number;
    title: string;
    description: string;
    image: ImageSourcePropType;
    time: string;
    category: string;
  };
};

export default function DetailBeritaScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<NewsDetailParams, 'DetailBerita'>>();
  
  // Get news data from navigation params or use defaults
  const newsData = route.params || {
    id: 1,
    title: 'Update Seputar Dunia Mahasiswa',
    description: 'Kabar terbaru tentang perkuliahan, komunitas, dan kehidupan kampus.',
    image: require('@images/dummy_berita/berita1.png'),
    time: '10 menit lalu',
    category: 'Mahasiswa',
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share button pressed');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      
      {/* Hero Image Section - Fixed */}
      <View style={styles.heroContainer}>
        <Image 
          source={newsData.image} 
          style={styles.heroImage} 
          resizeMode="cover" 
        />
        
        {/* Gradient Overlay */}
        <View style={styles.gradientOverlay} />

        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>

        {/* Title and Description Overlay */}
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>{newsData.title}</Text>
          <Text style={styles.heroDescription}>{newsData.description}</Text>
        </View>
      </View>

      {/* White Content Card - Fixed Header */}
      <View style={styles.contentCard}>
        {/* Category Badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{newsData.category}</Text>
        </View>

        {/* Author Section */}
        <View style={styles.authorSection}>
          <View style={styles.authorInfo}>
            <Image 
              source={require('@images/dummy_berita/berita1.png')} 
              style={styles.authorAvatar}
              resizeMode="cover"
            />
            <View style={styles.authorDetails}>
              <View style={styles.authorNameContainer}>
                <Text style={styles.authorName}>UBSI NEWS</Text>
                <CheckCircle2 color="#7EFF00" size={16} fill="#7EFF00" />
              </View>
              <Text style={styles.authorInstitution}>
                Universitas Bina Sarana Informatika
              </Text>
            </View>
          </View>

          {/* Share Button */}
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Share2 color="#000" size={16} />
          </TouchableOpacity>
        </View>

        {/* Article Content - Scrollable */}
        <ScrollView 
          style={styles.articleScrollView}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View style={styles.articleContent}>
            <Text style={styles.articleText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              {'\n\n'}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              {'\n\n'}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  
  // Hero Section
  heroContainer: {
    width: width,
    height: width * 0.75, // Adjusted height for better layout
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  
  // Back Button
  backButton: {
    position: 'absolute',
    top: 50,
    left: 32,
    width: 32,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  
  // Hero Text Overlay
  heroTextContainer: {
    position: 'absolute',
    left: 32,
    right: 32,
    bottom: 60,
  },
  heroTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 30,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroDescription: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    lineHeight: 20,
    color: '#FFFFFF',
  },
  
  // Content Card
  contentCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -40,
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  
  // Category Badge
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 16,
    marginLeft: 56,
    backgroundColor: '#1E69DD',
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    lineHeight: 18,
  },
  
  // Author Section
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  authorDetails: {
    flex: 1,
  },
  authorNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  authorName: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    lineHeight: 18,
  },
  authorInstitution: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    lineHeight: 18,
  },
  
  // Share Button
  shareButton: {
    width: 32,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  
  // Article Content
  articleScrollView: {
    flex: 1,
  },
  articleContent: {
    marginTop: 18,
    paddingBottom: 40,
  },
  articleText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    lineHeight: 21,
    color: '#000000',
    textAlign: 'justify',
  },
});

