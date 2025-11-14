import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';

interface WarningAnimationProps {
  show: boolean;
  message: string;
  onClose?: () => void;
}

export default function WarningAnimation({ show, message, onClose }: WarningAnimationProps) {
  const [isVisible, setIsVisible] = useState(show);
  const [scaleAnim] = useState(new Animated.Value(0));
  const [shakeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(shakeAnim, {
              toValue: 10,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
              toValue: -10,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.delay(2000),
          ])
        ),
      ]).start();

      if (onClose) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onClose();
        }, 5000);
        return () => clearTimeout(timer);
      }
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsVisible(false));
    }
  }, [show, onClose]);

  if (!isVisible) return null;

  const translateX = shakeAnim.interpolate({
    inputRange: [-10, 10],
    outputRange: [-10, 10],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }, { translateX }],
        },
      ]}
    >
      <View style={styles.warningBox}>
        <Text style={styles.emoji}>⚠️</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Warning!</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={() => setIsVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 16,
    left: 16,
    zIndex: 1000,
  },
  warningBox: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    color: '#fff',
    fontSize: 14,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

