import { COLORS } from '@/constants/colors'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface NumberStepperProps {
  value: number
  onIncrease: () => void
  onDecrease: () => void
  min: number
  max: number
  label: string
  unit?: string
  step?: number
  formatValue?: (value: number) => string
}

export default function NumberStepper({
  value,
  onIncrease,
  onDecrease,
  min,
  max,
  label,
  unit = '',
  formatValue,
}: NumberStepperProps) {
  const displayValue = formatValue ? formatValue(value) : `${value}`

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.stepperContainer}>
        <TouchableOpacity
          style={[styles.button, value <= min && styles.buttonDisabled]}
          onPress={onDecrease}
          disabled={value <= min}
        >
          <Text style={[styles.buttonText, value <= min && styles.buttonTextDisabled]}>−</Text>
        </TouchableOpacity>

        <View style={styles.valueContainer}>
          <Text style={styles.value}>
            {displayValue}
            {unit}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, value >= max && styles.buttonDisabled]}
          onPress={onIncrease}
          disabled={value >= max}
        >
          <Text style={[styles.buttonText, value >= max && styles.buttonTextDisabled]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: COLORS.surface,
  },
  buttonText: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: COLORS.textSecondary,
  },
  valueContainer: {
    minWidth: 100,
    alignItems: 'center',
  },
  value: {
    fontSize: 28,
    color: COLORS.text,
    fontWeight: 'bold',
  },
})
