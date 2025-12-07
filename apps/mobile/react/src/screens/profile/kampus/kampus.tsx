import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface KampusCardProps {
  image: any;
  label: string;
  name: string;
  address: string;
  mapsUrl: string;
  onPress: () => void;
}

const KampusCard: React.FC<KampusCardProps> = ({
  image,
  label,
  name,
  address,
  mapsUrl,
  onPress,
}) => {
  const cardWidth = (screenWidth - 64 - 16) / 2; // 32px padding each side + 16px gap
  const cardHeight = cardWidth * 1.37; // Maintain aspect ratio from design (240/175)
  
  return (
    <TouchableOpacity style={[styles.kampusCard, { width: cardWidth, height: cardHeight }]} onPress={onPress}>
      {/* Background Tint */}
      <View style={[styles.cardBackground, { width: cardWidth, height: cardHeight }]}>
        <Image source={image} style={[styles.kampusImage, { width: cardWidth, height: cardHeight }]} />
        
        {/* Blue Tint Overlay */}
        <View style={styles.blueTintOverlay} />
        
        {/* Bottom White Overlay */}
        <View style={styles.solidOverlay} />
        
        {/* Label Badge */}
        {label !== '' && (
          <View style={styles.labelBadge}>
            <Text style={styles.labelText}>{label}</Text>
          </View>
        )}
        
        {/* Card Content */}
        <View style={styles.cardContent}>
          <Text style={styles.kampusName}>{name}</Text>
          <Text style={styles.kampusAddress} numberOfLines={3}>{address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const KampusUBSIPages: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleKampusPress = (campusIndex: number) => {
    navigation.navigate('MapsKampus', { campusIndex });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* AppBar */}
          <View style={styles.appBar}>
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <ChevronLeft size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.title}>Kampus UBSI</Text>
          </View>

          {/* Content */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.contentPadding}>
              {/* Kampus Utama Section */}
              <Text style={styles.sectionTitle}>Kampus Utama</Text>
              
              <View style={styles.cardsRow}>
                <KampusCard
                  image={require('../../../../assets/images/Kramat98.png')}
                  label="Rektorat"
                  name="UBSI Kramat 98"
                  address="Jl. Kramat Raya No.98, RT.2/RW.9, Kwitang, Kec. Senen, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10450"
                  mapsUrl="https://www.openstreetmap.org/?mlat=-6.186486&mlon=106.849979#map=18/-6.186486/106.849979"
                  onPress={() => handleKampusPress(0)}
                />

                <KampusCard
                  image={require('../../../../assets/images/SartikaA.png')}
                  label="Rektorat"
                  name="UBSI Dewi Sartika A"
                  address="Jl. Dewi Sartika Blok, Jl. H. Abdul Hamid No.77, RT.8/RW.4, Cawang, Kramat Jati, East Jakarta City, Jakarta 13630"
                  mapsUrl="https://www.openstreetmap.org/?mlat=-6.263265&mlon=106.864601#map=18/-6.263265/106.864601"
                  onPress={() => handleKampusPress(1)}
                />
              </View>

              {/* Kampus Lainnya Section */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitleDark}>Kampus Lainnya</Text>
                <ChevronRight size={24} color="#000000" />
              </View>

              <View style={styles.cardsGrid}>
                <KampusCard
                  image={require('../../../../assets/images/Slipi.png')}
                  label=""
                  name="UBSI Slipi"
                  address="Jl. Kemanggisan Utama, RT.3/RW.2, Slipi, Kec. Palmerah, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11480"
                  mapsUrl="https://www.openstreetmap.org/?mlat=-6.200484&mlon=106.797282#map=18/-6.200484/106.797282"
                  onPress={() => handleKampusPress(2)}
                />

                <KampusCard
                  image={require('../../../../assets/images/SartikaB.png')}
                  label=""
                  name="UBSI Dewi Sartika B"
                  address="Jl. Dewi Sartika No.289 4, Cawang, Kec. Kramat jati, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13630"
                  mapsUrl="https://www.openstreetmap.org/?mlat=-6.263265&mlon=106.864601#map=18/-6.263265/106.864601"
                  onPress={() => handleKampusPress(3)}
                />

                <KampusCard
                  image={require('../../../../assets/images/Kramat98.png')}
                  label=""
                  name="UBSI Kramat 98"
                  address="Jl. Kramat Raya No.98, RT.2/RW.9, Kwitang, Kec. Senen, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10450"
                  mapsUrl="https://www.openstreetmap.org/?mlat=-6.186486&mlon=106.849979#map=18/-6.186486/106.849979"
                  onPress={() => handleKampusPress(0)}
                />

                <KampusCard
                  image={require('../../../../assets/images/SartikaA.png')}
                  label=""
                  name="UBSI Dewi Sartika A"
                  address="Jl. Dewi Sartika Blok, Jl. H. Abdul Hamid No.77, RT.8/RW.4, Cawang, Kramat Jati, East Jakarta City, Jakarta 13630"
                  mapsUrl="https://www.openstreetmap.org/?mlat=-6.263265&mlon=106.864601#map=18/-6.263265/106.864601"
                  onPress={() => handleKampusPress(1)}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  content: {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    paddingTop: 40,
    gap: 16,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#000000',
  },
  title: {
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  contentPadding: {
    paddingHorizontal: 31,
    paddingBottom: 24,
  },
  sectionTitle: {
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
    gap: 8,
  },
  sectionTitleDark: {
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 0,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    rowGap: 16,
  },
  kampusCard: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  cardBackground: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  kampusImage: {
    borderRadius: 12,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  blueTintOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#87D2F3',
    opacity: 0.3,
    borderRadius: 12,
  },
  solidOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '36%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  labelBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#1E69DD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  labelText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 8,
    lineHeight: 10,
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    gap: 4,
  },
  kampusName: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 16,
    color: '#000000',
  },
  kampusAddress: {
    color: '#000000',
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 6,
    lineHeight: 7,
  },
});

export default KampusUBSIPages;