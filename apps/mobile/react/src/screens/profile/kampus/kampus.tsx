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
import { ArrowLeft } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface KampusCardProps {
  image: any;
  label: string;
  labelColor: string;
  name: string;
  address: string;
  mapsUrl: string;
  onPress: () => void;
}

const KampusCard: React.FC<KampusCardProps> = ({
  image,
  label,
  labelColor,
  name,
  address,
  mapsUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.kampusCard} onPress={onPress}>
      <View style={styles.cardContainer}>
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.kampusImage} />
          {label !== '' && (
            <View
              style={[
                styles.labelContainer,
                { backgroundColor: labelColor },
              ]}
            >
              <Text style={styles.labelText}>{label}</Text>
            </View>
          )}
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.kampusName}>{name}</Text>
          <Text style={styles.kampusAddress}>{address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const KampusUBSIPages: React.FC = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleKampusPress = () => {
    // Navigate to MapsKampusPage equivalent
    // navigation.navigate('MapsKampus');
    console.log('Navigate to Maps Kampus');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* AppBar */}
            <View style={styles.appBar}>
              <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                <ArrowLeft size={24} color="white" />
              </TouchableOpacity>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Kampus UBSI</Text>
              </View>
            </View>

            {/* Content */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.contentPadding}>
                <Text style={styles.sectionTitle}>Kampus Utama</Text>
                
                <KampusCard
                  image={require('../../../../assets/images/Kramat98.png')}
                  label="Rektorat"
                  labelColor="#2196F3"
                  name="UBSI Kramat 98"
                  address="Jl. Kramat Raya No.98, RT.2/RW.9, Kec. Senen, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10450"
                  mapsUrl="https://maps.app.goo.gl/QLJb4hC94D1HmMBt7"
                  onPress={handleKampusPress}
                />

                <KampusCard
                  image={require('../../../../assets/images/SartikaA.png')}
                  label="Kantor Pusat UBSI"
                  labelColor="#2196F3"
                  name="UBSI Dewi Sartika A"
                  address="Jl. Dewi Sartika Blok, Jl. H. Abdul Hamid No.77, RT.8/RW.4, Cawang, Kramat Jati, Jakarta Timur, Jakarta 13630"
                  mapsUrl="https://maps.app.goo.gl/vgsUfTf5R8VZpxwY6"
                  onPress={handleKampusPress}
                />

                <Text style={styles.sectionTitleDark}>Kampus Lainnya</Text>

                <KampusCard
                  image={require('../../../../assets/images/Slipi.png')}
                  label=""
                  labelColor="transparent"
                  name="UBSI Slipi"
                  address="Jl. Kemanggisan Utama, RT.3/RW.2, Slipi, Kec. Palmerah, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11480"
                  mapsUrl="https://maps.app.goo.gl/43e9HKy2ftbV9FB56"
                  onPress={handleKampusPress}
                />

                <KampusCard
                  image={require('../../../../assets/images/SartikaB.png')}
                  label=""
                  labelColor="transparent"
                  name="UBSI Dewi Sartika B"
                  address="Jl. Dewi Sartika No.2, RT.8/RW.4, Cawang, Kramat Jati, Jakarta Timur, Jakarta 13630"
                  mapsUrl="https://maps.app.goo.gl/pT3cNZdksdEvY4wB7"
                  onPress={handleKampusPress}
                />
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    backgroundColor: '#75ABFF',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.01,
  },
  backButton: {
    padding: 8,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: screenWidth * 0.02,
  },
  title: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: screenWidth * 0.05,
  },
  scrollView: {
    flex: 1,
    marginTop: screenHeight * 0.01,
  },
  contentPadding: {
    paddingHorizontal: screenWidth * 0.04,
    paddingBottom: screenHeight * 0.03,
  },
  sectionTitle: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: screenWidth * 0.04,
    marginBottom: screenHeight * 0.015,
  },
  sectionTitleDark: {
    color: 'black',
    fontFamily: 'Poppins-Bold',
    fontSize: screenWidth * 0.04,
    marginBottom: screenHeight * 0.015,
    marginTop: screenHeight * 0.03,
  },
  kampusCard: {
    marginBottom: screenHeight * 0.02,
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  kampusImage: {
    height: screenHeight * 0.2,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    resizeMode: 'cover',
  },
  labelContainer: {
    position: 'absolute',
    top: screenHeight * 0.015,
    right: screenWidth * 0.025,
    paddingHorizontal: screenWidth * 0.025,
    paddingVertical: screenHeight * 0.005,
    borderRadius: 8,
  },
  labelText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: screenWidth * 0.03,
  },
  cardContent: {
    padding: screenWidth * 0.04,
  },
  kampusName: {
    fontFamily: 'Poppins-Bold',
    fontSize: screenWidth * 0.042,
    marginBottom: screenHeight * 0.005,
  },
  kampusAddress: {
    color: '#333333',
    fontFamily: 'Poppins-Regular',
    fontSize: screenWidth * 0.032,
  },
});

export default KampusUBSIPages;