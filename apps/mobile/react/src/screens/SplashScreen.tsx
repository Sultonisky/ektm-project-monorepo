import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text,
  StyleSheet, 
  StatusBar,
  Animated
} from 'react-native';
 

type Props = { onFinished?: () => void };

export default function SplashScreen({ onFinished }: Props) {
  return <AnimatedSplash onFinished={onFinished} />;
}

// Fallback animated component
function AnimatedSplash({ onFinished }: { onFinished?: () => void }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (onFinished) {
        onFinished();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinished]);

  return (
    <View style={styles.container}>
      <StatusBar hidden animated />
      <View style={styles.backgroundGradient} />
      
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>EKTM</Text>
        </View>
      </Animated.View>
      
      <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
        <View style={styles.loadingBar}>
          <Animated.View 
            style={[
              styles.loadingProgress,
              { transform: [{ scaleX: scaleAnim }] },
            ]} 
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    // unused in dummy splash
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#75ABFF', // Your brand color as fallback
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    letterSpacing: 2,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    left: 50,
    right: 50,
  },
  loadingBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
});


