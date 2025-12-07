import React, { useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  StatusBar,
  Animated,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import { Fonts } from '../constants/fonts';

const { width, height } = Dimensions.get('window');

type Props = { onFinished?: () => void };

export default function SplashScreen({ onFinished }: Props) {
  // Animation values
  const logoTranslateY = useRef(new Animated.Value(-height)).current;
  const logoTranslateX = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateX = useRef(new Animated.Value(-100)).current; // Start from far left
  const poweredByOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Step 1: Logo drops from top to CENTER (1000ms)
    // Step 2: Delay (300ms) - logo stays at center
    // Step 3: Logo slides to left (500ms)
    // Step 4: Text "BSI.ID" appears from LEFT to RIGHT (500ms)
    // Step 5: Powered by appears (500ms)
    // Total: 2800ms + 500ms = 3300ms

    Animated.sequence([
      // Step 1: Drop from top to CENTER
      Animated.timing(logoTranslateY, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Step 2: Stay at center for a moment
      Animated.delay(300),
      // Step 3: Slide to left
      Animated.timing(logoTranslateX, {
        toValue: -65,
        duration: 500,
        useNativeDriver: true,
      }),
      // Step 4: Text appears from LEFT to RIGHT
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateX, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Step 5: Powered by appears
      Animated.timing(poweredByOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Call onFinished after all animations complete + 500ms delay
    const timer = setTimeout(() => {
      if (onFinished) {
        onFinished();
      }
    }, 3300);

    return () => clearTimeout(timer);
  }, [logoTranslateY, logoTranslateX, textOpacity, textTranslateX, poweredByOpacity, onFinished]);

  return (
    <View style={styles.container}>
      <StatusBar hidden animated />
      
      <View style={styles.contentContainer}>
        {/* Logo - positioned absolutely to be perfectly centered */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              transform: [
                { translateY: logoTranslateY },
                { translateX: logoTranslateX },
              ],
            },
          ]}
        >
          <Image 
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        
        {/* Text - positioned absolutely, offset to the right of logo */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateX: textTranslateX }],
            },
          ]}
        >
          <Text style={styles.bsiText}>BSI.ID</Text>
        </Animated.View>
      </View>

      <Animated.View 
        style={[
          styles.poweredByContainer,
          { opacity: poweredByOpacity },
        ]}
      >
        <Text style={styles.poweredByText}>Powered By :</Text>
        <Text style={styles.pembangunText}>Pembangun Negeri</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    left: width / 2 - 50, // Center of screen minus half of logo width
  },
  logo: {
    width: 100,
    height: 100,
  },
  textContainer: {
    position: 'absolute',
    left: width / 2 - 50 - 65 + 100 + 15, // Logo final position + logo width + margin
    // Calculation: (width/2 - 50) is logo center, -65 is shift left, +100 is logo width, +15 is margin
  },
  bsiText: {
    fontSize: 48,
    fontFamily: Fonts.bold,
    color: '#020E60',
    letterSpacing: 2,
  },
  poweredByContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  poweredByText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
    marginBottom: 4,
  },
  pembangunText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: '#020E60',
  },
});


