import { COLORS } from '@/constants/colors'
import { useSettings } from '@/src/contexts/SettingsContext'
import { heavyHaptic, mediumHaptic } from '@/src/utils/haptics'
import React, { useCallback } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

interface StopButtonProps {
  onPress: () => void
  disabled?: boolean
  label?: string
}

export default function StopButton({ onPress, disabled = false, label = 'STOP' }: StopButtonProps) {
  const { settings } = useSettings()
  const isStart = label === 'START'

  const handlePress = useCallback(() => {
    if (isStart) {
      mediumHaptic(settings.hapticEnabled)
    } else {
      heavyHaptic(settings.hapticEnabled)
    }
    onPress()
  }, [isStart, onPress, settings.hapticEnabled])

  return (
    <TouchableOpacity
      style={[styles.button, isStart && styles.startButton, disabled && styles.disabled]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  startButton: {
    backgroundColor: COLORS.success,
    shadowColor: COLORS.success,
  },
  disabled: {
    backgroundColor: COLORS.surface,
    shadowOpacity: 0,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
})
