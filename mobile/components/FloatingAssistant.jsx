import React, { useState, useRef } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Animated, 
  PanResponder, 
  Dimensions,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUBBLE_SIZE = 60;

export default function FloatingAssistant({ onPress }) {
  const pan = useRef(new Animated.ValueXY({ 
    x: SCREEN_WIDTH - BUBBLE_SIZE - 20, 
    y: SCREEN_HEIGHT / 2 
  })).current;
  
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: () => {
        setIsDragging(true);
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
        pan.setValue({ x: 0, y: 0 });
      },
      
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      
      onPanResponderRelease: (e, gesture) => {
        pan.flattenOffset();
        setIsDragging(false);
        
        // Snap to edge if dragged only slightly
        if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
          onPress && onPress();
          return;
        }
        
        // Snap to nearest edge (left or right)
        const currentX = pan.x._value;
        const currentY = pan.y._value;
        
        // Determine which edge is closer
        const snapToRight = currentX > SCREEN_WIDTH / 2;
        const targetX = snapToRight 
          ? SCREEN_WIDTH - BUBBLE_SIZE - 10 
          : 10;
        
        // Keep Y within bounds
        const boundedY = Math.max(
          50, 
          Math.min(currentY, SCREEN_HEIGHT - BUBBLE_SIZE - 100)
        );
        
        Animated.spring(pan, {
          toValue: { x: targetX, y: boundedY },
          useNativeDriver: false,
          friction: 7
        }).start();
      }
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y }
          ]
        }
      ]}
      {...panResponder.panHandlers}
    >
      <View style={[
        styles.bubble,
        isDragging && styles.bubbleDragging
      ]}>
        <Ionicons 
          name="headset" 
          size={32} 
          color="white" 
        />
        <View style={styles.badge}>
          <Ionicons name="sparkles" size={10} color="#FFD700" />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    zIndex: 9999,
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    backgroundColor: COLORS.primary || '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  bubbleDragging: {
    opacity: 0.8,
    elevation: 12,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary || '#FF6B6B',
    elevation: 4,
  },
});
