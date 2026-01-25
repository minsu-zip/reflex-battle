import { COLORS } from '@/constants/colors'
import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

interface TimerProps {
  time: number
  size?: 'medium' | 'large'
}

export default function Timer({ time, size = 'large' }: TimerProps) {
  const scale = useSharedValue(1)

  // 시간이 변경될 때마다 미세한 스케일 애니메이션
  useEffect(() => {
    scale.value = withSequence(withTiming(1.03, { duration: 50 }), withTiming(1, { duration: 100 }))
  }, [Math.floor(time * 10), scale]) // 0.1초 단위로 애니메이션

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    if (mins > 0) {
      return `${mins}:${secs.toFixed(2).padStart(5, '0')}`
    }
    return secs.toFixed(2)
  }

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[styles.time, size === 'large' ? styles.large : styles.medium, animatedStyle]}
      >
        {formatTime(time)}
      </Animated.Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  time: {
    fontWeight: 'bold',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
  },
  large: {
    fontSize: 72,
  },
  medium: {
    fontSize: 48,
  },
})
