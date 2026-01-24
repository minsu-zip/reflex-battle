import { COLORS } from '@/constants/colors'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface TimerProps {
  time: number
  size?: 'medium' | 'large'
}

export default function Timer({ time, size = 'large' }: TimerProps) {
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
      <Text style={[styles.time, size === 'large' ? styles.large : styles.medium]}>
        {formatTime(time)}
      </Text>
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
