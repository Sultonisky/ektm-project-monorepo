import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Linking,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import Geolocation from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Navigation2, Phone, Mail, Crosshair } from 'lucide-react-native';

// Set MapLibre access token (not required for self-hosted tiles, but needed to initialize)
MapLibreGL.setAccessToken(null);

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
    mapsUrl: 'https://www.openstreetmap.org/?mlat=-6.186486&mlon=106.849979#map=18/-6.186486/106.849979',
    phone: '0211234567',
    email: 'info.kramat98@ubsi.ac.id',
  },
  {
    name: 'Kampus Dewi Sartika A',
    address: 'Jl. Dewi Sartika No.1, Jakarta Timur',
    latitude: -6.263265,
    longitude: 106.864601,
    image: require('@images/SartikaA.png'),
    mapsUrl: 'https://www.openstreetmap.org/?mlat=-6.263265&mlon=106.864601#map=18/-6.263265/106.864601',
    phone: '0212345678',
    email: 'info.sartikaa@ubsi.ac.id',
  },
  {
    name: 'Kampus Slipi',
    address: 'Jl. Slipi No.1, Jakarta Barat',
    latitude: -6.200484,
    longitude: 106.797282,
    image: require('@images/Slipi.png'),
    mapsUrl: 'https://www.openstreetmap.org/?mlat=-6.200484&mlon=106.797282#map=18/-6.200484/106.797282',
    phone: '0213456789',
    email: 'info.slipi@ubsi.ac.id',
  },
  {
    name: 'Kampus Dewi Sartika B',
    address: 'Jl. Dewi Sartika No.2, Jakarta Timur',
    latitude: -6.263265,
    longitude: 106.864601,
    image: require('@images/SartikaB.png'),
    mapsUrl: 'https://www.openstreetmap.org/?mlat=-6.263265&mlon=106.864601#map=18/-6.263265/106.864601',
    phone: '0214567890',
    email: 'info.sartikab@ubsi.ac.id',
  },
];

const { width, height } = Dimensions.get('window');

// OpenStreetMap style configuration for MapLibre
const OSM_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap Contributors',
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
      minzoom: 0,
      maxzoom: 22,
    },
  ],
};

export default function MapsKampusScreen({ route }: any) {
  const navigation = useNavigation<any>();
  const cameraRef = useRef<any>(null);
  const mapRef = useRef<any>(null);

  const initialIndex = route?.params?.campusIndex ?? 0;
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [isMapLoading, setIsMapLoading] = useState<boolean>(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Camera state for controlling view
  const [cameraConfig, setCameraConfig] = useState<{
    centerCoordinate: [number, number];
    zoomLevel: number;
  }>({
    centerCoordinate: [ALL_CAMPUSES[initialIndex].longitude, ALL_CAMPUSES[initialIndex].latitude],
    zoomLevel: 17,
  });

  // Safety check for campus index
  const validIndex = currentIndex >= 0 && currentIndex < ALL_CAMPUSES.length ? currentIndex : 0;
  const campus = ALL_CAMPUSES[validIndex];

  // If campus is undefined, show error
  if (!campus) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorTitle}>Kampus tidak ditemukan</Text>
        <TouchableOpacity 
          style={[styles.retryBtn, { marginTop: 16 }]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  useEffect(() => {
    console.log('MapsKampusScreen mounted with campus:', campus?.name);
    const t = setTimeout(() => setIsMapLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    console.log('Current campus changed to:', campus?.name, 'Index:', validIndex);
    // Update camera when campus changes
    if (campus) {
      setCameraConfig({
        centerCoordinate: [campus.longitude, campus.latitude],
        zoomLevel: 17,
      });
    }
  }, [campus, validIndex]);

  const requestLocationPermission = useCallback(async () => {
    try {
      setLocationError(null);
      console.log('Requesting location permission...');
      
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Izin Lokasi',
            message: 'Aplikasi memerlukan akses lokasi untuk menampilkan posisi Anda',
            buttonNeutral: 'Tanya Nanti',
            buttonNegative: 'Batal',
            buttonPositive: 'OK',
          },
        );
        
        console.log('Permission status:', granted);
        
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setLocationError('Izin lokasi ditolak.');
          setIsLocationLoading(false);
          return false;
        }
      }
      
      return true;
    } catch (e) {
      console.error('Permission request error:', e);
      setLocationError(`Gagal meminta izin lokasi: ${e}`);
      setIsLocationLoading(false);
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    try {
      console.log('getCurrentLocation called, map ready:', isMapReady);
      
      if (!isMapReady) {
        setLocationError('Peta belum siap, coba lagi');
        return;
      }
      
      const ok = await requestLocationPermission();
      console.log('Permission result:', ok);
      
      if (!ok) {
        console.log('Permission not granted, returning');
        return;
      }
      
      setIsLocationLoading(true);
      setLocationError(null);
      
      console.log('Getting current position with geolocation...');
      
      Geolocation.getCurrentPosition(
        (position) => {
          console.log('Position received:', position.coords);
          const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
          console.log('Formatted coords:', coords);
          
          setCurrentPosition(coords);
          setLocationError(null);
          
          // Update camera to show both locations
          const validIdx = currentIndex >= 0 && currentIndex < ALL_CAMPUSES.length ? currentIndex : 0;
          const target = ALL_CAMPUSES[validIdx];
          
          if (!target) {
            console.error('Target campus not found');
            setIsLocationLoading(false);
            return;
          }
          
          console.log('Target campus:', target.name);
          
          const centerLng = (coords[0] + target.longitude) / 2;
          const centerLat = (coords[1] + target.latitude) / 2;
          
          console.log('Setting camera to:', { centerLng, centerLat });
          
          setCameraConfig({
            centerCoordinate: [centerLng, centerLat],
            zoomLevel: 15,
          });
          
          setIsLocationLoading(false);
          console.log('Location update complete');
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMsg = 'Gagal mendapatkan lokasi';
          
          if (error.code === 1) {
            errorMsg = 'Izin lokasi ditolak';
          } else if (error.code === 2) {
            errorMsg = 'Lokasi tidak tersedia. Pastikan GPS aktif.';
          } else if (error.code === 3) {
            errorMsg = 'Timeout. Coba lagi.';
          } else {
            errorMsg = `Error: ${error.message}`;
          }
          
          setLocationError(errorMsg);
          setIsLocationLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 10000,
        }
      );
    } catch (error: any) {
      console.error('Error in getCurrentLocation:', error);
      setLocationError(`Gagal mendapatkan lokasi: ${error.message || 'Unknown error'}`);
      setIsLocationLoading(false);
    }
  }, [currentIndex, requestLocationPermission, isMapReady]);

  const moveToCampus = useCallback((idx: number) => {
    const c = ALL_CAMPUSES[idx];
    setCurrentIndex(idx);
    setCameraConfig({
      centerCoordinate: [c.longitude, c.latitude],
      zoomLevel: 17,
    });
  }, []);

  const openExternal = (url: string) => Linking.openURL(url).catch(() => {});
  const callPhone = (phone?: string | null) => phone && Linking.openURL(`tel:${phone}`).catch(() => {});
  const sendEmail = (email?: string | null) => email && Linking.openURL(`mailto:${email}`).catch(() => {});

  const distanceText = useMemo(() => {
    if (!currentPosition) return null;
    const R = 6371000; // meters
    const dLat = toRad(campus.latitude - currentPosition[1]);
    const dLon = toRad(campus.longitude - currentPosition[0]);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(currentPosition[1])) * Math.cos(toRad(campus.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d < 1000 ? `${d.toFixed(0)} m` : `${(d / 1000).toFixed(1)} km`;
  }, [currentPosition, campus]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={{ flex: 1 }}>
        <MapLibreGL.MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          // @ts-ignore - styleURL is supported but types may not be updated
          styleURL={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(OSM_STYLE))}`}
          onDidFinishLoadingMap={() => {
            console.log('Map ready!');
            setIsMapLoading(false);
            setIsMapReady(true);
          }}
          onDidFailLoadingMap={() => {
            console.error('Map error');
            setMapError('Gagal memuat peta');
          }}
          logoEnabled={false}
          attributionEnabled={true}
          attributionPosition={{ bottom: 8, right: 8 }}
        >
          <MapLibreGL.Camera
            ref={cameraRef}
            zoomLevel={cameraConfig.zoomLevel}
            centerCoordinate={cameraConfig.centerCoordinate}
            animationMode="flyTo"
            animationDuration={1000}
          />

          {/* Campus Marker */}
          <MapLibreGL.PointAnnotation
            id="campus-marker"
            coordinate={[campus.longitude, campus.latitude]}
          >
            <View style={styles.markerPin}>
              <View style={styles.markerDot} />
            </View>
          </MapLibreGL.PointAnnotation>

          {/* User Location Marker */}
          {currentPosition && (
            <MapLibreGL.PointAnnotation
              id="user-location"
              coordinate={currentPosition}
            >
              <View style={[styles.marker, { backgroundColor: 'green' }]} />
            </MapLibreGL.PointAnnotation>
          )}
        </MapLibreGL.MapView>

        {/* Top buttons */}
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.fabCircle} onPress={() => navigation.goBack()}>
            <ChevronLeft color="#000" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fabCircle}
            onPress={() => {
              if (!isLocationLoading) {
                getCurrentLocation();
              }
            }}
          >
            {isLocationLoading ? (
              <ActivityIndicator size="small" color="#1E69DD" />
            ) : (
              <Crosshair color={currentPosition ? 'green' : '#888'} size={20} />
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom card */}
        <View style={styles.bottomCard}>
          {/* Campus Image with Tint */}
          <View style={styles.imageSection}>
            <Image source={campus.image} style={styles.campusImage} resizeMode="cover" />
            <View style={styles.blueTint} />
          </View>

          {/* Campus Info */}
          <View style={styles.infoSection}>
            {/* Title and Action Buttons Row */}
            <View style={styles.titleRow}>
              <Text style={styles.campusTitle}>{campus.name}</Text>
              <View style={styles.iconButtons}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => callPhone(campus.phone)}>
                  <Phone color="#FFFFFF" size={16} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={() => sendEmail(campus.email)}>
                  <Mail color="#FFFFFF" size={16} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Address */}
            <Text style={styles.campusAddress} numberOfLines={2}>
              {campus.address}
            </Text>

            {/* Navigate Button */}
            <TouchableOpacity style={styles.navigateBtn} onPress={() => openExternal(campus.mapsUrl)}>
              <Navigation2 color="#F0F0F0" size={16} />
              <Text style={styles.navigateText}>Arahkan</Text>
            </TouchableOpacity>
          </View>
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
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => {
                setIsMapLoading(true);
                setMapError(null);
                setTimeout(() => setIsMapLoading(false), 500);
              }}
            >
              <Text style={styles.retryText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Location Error Notification */}
        {locationError && !isLocationLoading ? (
          <View style={styles.locationErrorBar}>
            <Text style={styles.locationErrorText}>{locationError}</Text>
            <TouchableOpacity onPress={() => setLocationError(null)}>
              <Text style={styles.dismissText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },

  topRow: {
    position: 'absolute',
    top: 82,
    left: 32,
    right: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },

  fabCircle: {
    backgroundColor: '#FFFFFF',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },

  bottomCard: {
    position: 'absolute',
    bottom: 36,
    left: 47,
    right: 47,
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
    overflow: 'hidden',
  },

  imageSection: {
    width: '100%',
    height: 180,
    position: 'relative',
    overflow: 'hidden',
  },

  campusImage: {
    width: '100%',
    height: '100%',
  },

  blueTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#89D3F3',
    opacity: 0.35,
  },

  infoSection: {
    padding: 24,
    gap: 12,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  campusTitle: {
    fontSize: 19,
    fontFamily: 'Montserrat',
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },

  iconButtons: {
    flexDirection: 'row',
    gap: 4,
  },

  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E69DD',
    alignItems: 'center',
    justifyContent: 'center',
  },

  campusAddress: {
    fontSize: 10,
    fontFamily: 'Montserrat',
    fontWeight: '500',
    color: '#000000',
    lineHeight: 12,
  },

  navigateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E69DD',
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 8,
  },

  navigateText: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    fontWeight: '500',
    color: '#F0F0F0',
  },

  markerPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2728D1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },

  marker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },

  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
  },

  loadingText: {
    color: '#666',
    fontFamily: 'Montserrat',
    fontWeight: '500',
  },

  errorOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: height * 0.25,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
  },

  errorTitle: {
    color: '#000',
    fontFamily: 'Montserrat',
    fontWeight: '600',
  },

  errorText: {
    color: '#333',
    fontFamily: 'Montserrat',
    fontWeight: '400',
    textAlign: 'center',
  },

  retryBtn: {
    backgroundColor: '#1E69DD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  retryText: {
    color: '#fff',
    fontFamily: 'Montserrat',
    fontWeight: '600',
  },

  locationErrorBar: {
    position: 'absolute',
    top: 140,
    left: 16,
    right: 16,
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  locationErrorText: {
    color: '#fff',
    fontFamily: 'Montserrat',
    fontWeight: '500',
    fontSize: 12,
    flex: 1,
    marginRight: 8,
  },

  dismissText: {
    color: '#fff',
    fontFamily: 'Montserrat',
    fontWeight: '700',
    fontSize: 12,
  },
});
