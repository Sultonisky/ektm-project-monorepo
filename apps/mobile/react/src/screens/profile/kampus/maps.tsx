import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import MapView, { Marker, UrlTile, PROVIDER_DEFAULT, LatLng, Region } from 'react-native-maps';
import Geolocation, { GeolocationError, GeolocationResponse } from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Navigation2, Phone, Mail, Crosshair } from 'lucide-react-native';

type CampusLocation = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  image: any;
  mapsUrl: string;
  phone?: string | null;
  email?: string | null;
};

const ALL_CAMPUSES: CampusLocation[] = [
  {
    name: 'Kampus Kramat 98',
    address: 'Jl. Kramat Raya No.98, Jakarta Pusat',
    latitude: -6.186486,
    longitude: 106.849979,
    image: require('@images/Kramat98.png'),
    mapsUrl: 'https://maps.app.goo.gl/QLJb4hC94D1HmMBt7',
    phone: '0211234567',
    email: 'info.kramat98@ubsi.ac.id',
  },
  {
    name: 'Kampus Dewi Sartika A',
    address: 'Jl. Dewi Sartika No.1, Jakarta Timur',
    latitude: -6.263265,
    longitude: 106.864601,
    image: require('@images/SartikaA.png'),
    mapsUrl: 'https://maps.app.goo.gl/vgsUfTf5R8VZpxwY6',
    phone: '0212345678',
    email: 'info.sartikaa@ubsi.ac.id',
  },
  {
    name: 'Kampus Slipi',
    address: 'Jl. Slipi No.1, Jakarta Barat',
    latitude: -6.200484,
    longitude: 106.797282,
    image: require('@images/Slipi.png'),
    mapsUrl: 'https://maps.app.goo.gl/43e9HKy2ftbV9FB56',
    phone: '0213456789',
    email: 'info.slipi@ubsi.ac.id',
  },
  {
    name: 'Kampus Dewi Sartika B',
    address: 'Jl. Dewi Sartika No.2, Jakarta Timur',
    latitude: -6.263265,
    longitude: 106.864601,
    image: require('@images/SartikaB.png'),
    mapsUrl: 'https://maps.app.goo.gl/pT3cNZdksdEvY4wB7',
    phone: '0214567890',
    email: 'info.sartikab@ubsi.ac.id',
  },
];

const { width, height } = Dimensions.get('window');

export default function MapsKampusScreen() {
  const navigation = useNavigation<any>();
  const mapRef = useRef<MapView | null>(null);
  const listRef = useRef<FlatList<CampusLocation> | null>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isMapLoading, setIsMapLoading] = useState<boolean>(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [useFallbackTiles, setUseFallbackTiles] = useState<boolean>(false);

  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const campus = ALL_CAMPUSES[currentIndex];

  useEffect(() => {
    const t = setTimeout(() => setIsMapLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const requestLocationPermission = useCallback(async () => {
    try {
      setIsLocationLoading(true);
      setLocationError(null);

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setLocationError('Izin lokasi ditolak.');
          setIsLocationLoading(false);
          return false;
        }
      }
      // iOS: permission handled by Geolocation or Info.plist; assume configured
      return true;
    } catch (e) {
      setLocationError(`Gagal meminta izin lokasi: ${e}`);
      setIsLocationLoading(false);
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    const ok = await requestLocationPermission();
    if (!ok) return;
    setIsLocationLoading(true);
    Geolocation.getCurrentPosition(
      (pos: GeolocationResponse) => {
        const coords: LatLng = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setCurrentPosition(coords);
        setIsLocationLoading(false);
        setLocationError(null);
        showBothLocations(coords, ALL_CAMPUSES[currentIndex]);
      },
      (error: GeolocationError) => {
        setLocationError(`Gagal mendapatkan lokasi saat ini: ${error.message}`);
        setIsLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [currentIndex, requestLocationPermission]);

  const showBothLocations = (me: LatLng | null, target: CampusLocation) => {
    if (!mapRef.current) return;
    if (me) {
      const center: LatLng = {
        latitude: (me.latitude + target.latitude) / 2,
        longitude: (me.longitude + target.longitude) / 2,
      };
      mapRef.current.animateCamera({ center, zoom: 15 }, { duration: 600 });
    } else {
      mapRef.current.animateCamera(
        { center: { latitude: target.latitude, longitude: target.longitude }, zoom: 17 },
        { duration: 600 }
      );
    }
  };

  const moveToCampus = useCallback((idx: number) => {
    const c = ALL_CAMPUSES[idx];
    if (mapRef.current) {
      mapRef.current.animateCamera(
        { center: { latitude: c.latitude, longitude: c.longitude }, zoom: 17 },
        { duration: 500 }
      );
    }
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
    if (viewableItems && viewableItems.length > 0) {
      const idx = viewableItems[0].index ?? 0;
      setCurrentIndex(idx);
      moveToCampus(idx);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 60 });

  const openExternal = (url: string) => Linking.openURL(url).catch(() => {});
  const callPhone = (phone?: string | null) => phone && Linking.openURL(`tel:${phone}`).catch(() => {});
  const sendEmail = (email?: string | null) => email && Linking.openURL(`mailto:${email}`).catch(() => {});

  const distanceText = useMemo(() => {
    if (!currentPosition) return null;
    const R = 6371000; // meters
    const dLat = toRad(campus.latitude - currentPosition.latitude);
    const dLon = toRad(campus.longitude - currentPosition.longitude);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(currentPosition.latitude)) * Math.cos(toRad(campus.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d < 1000 ? `${d.toFixed(0)} m` : `${(d / 1000).toFixed(1)} km`;
  }, [currentPosition, campus]);

  return (
    <View style={styles.root}>
      <MapView
        ref={(ref: MapView | null) => { mapRef.current = ref; }}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        initialRegion={regionFromPoint(campus.latitude, campus.longitude, 17)}
        onMapReady={() => setIsMapLoading(false)}
        onError={() => setMapError('Gagal memuat peta')}
      >
        <UrlTile
          urlTemplate={useFallbackTiles
            ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png'
            : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
          maximumZ={19}
          flipY={false}
          zIndex={-1}
        />

        <Marker coordinate={{ latitude: campus.latitude, longitude: campus.longitude }}>
          <View style={[styles.marker, { backgroundColor: '#1E69DD' }]} />
        </Marker>

        {currentPosition ? (
          <Marker coordinate={currentPosition}>
            <View style={[styles.marker, { backgroundColor: 'green' }]} />
          </Marker>
        ) : null}
      </MapView>

      {/* Back button */}
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.fabCircle} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#000" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.fabCircle} onPress={() => {
          if (!isLocationLoading) {
            getCurrentLocation();
          }
        }}>
          {isLocationLoading ? (
            <ActivityIndicator size="small" color="#1E69DD" />
          ) : (
            <Crosshair color={currentPosition ? 'green' : '#888'} size={20} />
          )}
        </TouchableOpacity>
      </View>

      {/* Open in Google Maps */}
      <View style={styles.openMapsWrap}>
        <TouchableOpacity style={styles.openMapsBtn} onPress={() => openExternal(campus.mapsUrl)}>
          <Navigation2 color="#1E69DD" size={18} />
          <View style={{ width: 8 }} />
          <Text style={styles.openMapsText}>Buka di Google Maps</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom carousel */}
      <View style={styles.bottomPanel}>
        <FlatList
          ref={ref => (listRef.current = ref as any)}
          data={ALL_CAMPUSES}
          keyExtractor={(item) => item.name}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={width * 0.9}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: width * 0.05 }}
          renderItem={({ item, index }) => (
            <View style={[styles.card, { width: width * 0.9, marginRight: index === ALL_CAMPUSES.length - 1 ? 0 : 10 }]}> 
              <Image
                source={item.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                <View style={{ height: 4 }} />
                <Text style={styles.cardAddress} numberOfLines={2}>{item.address}</Text>
                <View style={{ height: 8 }} />
                {currentPosition ? (
                  <View style={styles.distanceChip}>
                    <Text style={styles.distanceText}>{distanceText}</Text>
                  </View>
                ) : locationError ? (
                  <View style={styles.locationWarn}>
                    <Text style={styles.locationWarnText} numberOfLines={1}>Lokasi tidak tersedia</Text>
                  </View>
                ) : null}
                <View style={{ height: 10 }} />
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => callPhone(item.phone)}>
                    <Phone color="#1E69DD" size={18} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => sendEmail(item.email)}>
                    <Mail color="#1E69DD" size={18} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfigRef.current}
        />
      </View>

      {isMapLoading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1E69DD" />
          <View style={{ height: 8 }} />
          <Text style={styles.loadingText}>Memuat peta...</Text>
        </View>
      ) : null}

      {mapError ? (
        <View style={styles.errorOverlay}>
          <Text style={styles.errorTitle}>Gagal memuat peta</Text>
          <View style={{ height: 6 }} />
          <Text style={styles.errorText}>{mapError}</Text>
          <View style={{ height: 10 }} />
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.retryBtn} onPress={() => {
              setIsMapLoading(true);
              setMapError(null);
              setTimeout(() => setIsMapLoading(false), 500);
            }}>
              <Text style={styles.retryText}>Coba Lagi</Text>
            </TouchableOpacity>
            <View style={{ width: 10 }} />
            <TouchableOpacity style={styles.retryBtn} onPress={() => setUseFallbackTiles(true)}>
              <Text style={styles.retryText}>Gunakan Peta Alternatif</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function regionFromPoint(lat: number, lon: number, zoom: number): Region {
  const latitudeDelta = Math.exp(Math.log(360) - zoom * Math.LN2);
  const longitudeDelta = latitudeDelta * (width / height);
  return { latitude: lat, longitude: lon, latitudeDelta, longitudeDelta };
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  topRow: { position: 'absolute', top: 24, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  fabCircle: { backgroundColor: '#fff', width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', elevation: 2 },

  openMapsWrap: { position: 'absolute', top: 84, left: 0, right: 0, alignItems: 'center' },
  openMapsBtn: { backgroundColor: '#fff', borderRadius: 24, paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  openMapsText: { color: '#1E69DD', fontFamily: 'Poppins-SemiBold' },

  bottomPanel: { position: 'absolute', left: 0, right: 0, bottom: 18 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden', elevation: 3 },
  cardImage: { width: width * 0.25, height: 140 },
  cardContent: { flex: 1, padding: 14, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontFamily: 'Poppins-Bold', color: '#000' },
  cardAddress: { fontSize: 12, fontFamily: 'Poppins-Regular', color: '#111' },

  distanceChip: { alignSelf: 'flex-start', backgroundColor: 'rgba(76,175,80,0.12)', borderColor: 'rgba(76,175,80,0.3)', borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  distanceText: { color: '#2e7d32', fontSize: 12, fontFamily: 'Poppins-SemiBold' },
  locationWarn: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,152,0,0.12)', borderColor: 'rgba(255,152,0,0.3)', borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  locationWarnText: { color: '#e65100', fontSize: 12, fontFamily: 'Poppins-Regular' },

  actionsRow: { flexDirection: 'row' },
  actionBtn: { backgroundColor: 'rgba(30,105,221,0.08)', width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },

  marker: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: '#fff' },

  loadingOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#666', fontFamily: 'Poppins-Regular' },

  errorOverlay: { position: 'absolute', left: 16, right: 16, top: height * 0.25, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', elevation: 3 },
  errorTitle: { color: '#000', fontFamily: 'Poppins-Bold' },
  errorText: { color: '#333', fontFamily: 'Poppins-Regular', textAlign: 'center' },
  retryBtn: { backgroundColor: '#1E69DD', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  retryText: { color: '#fff', fontFamily: 'Poppins-SemiBold' },
});


