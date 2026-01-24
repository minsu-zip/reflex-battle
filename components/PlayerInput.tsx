import { COLORS } from '@/constants/colors'
import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

interface PlayerInputProps {
  value: string
  onChangeText: (text: string) => void
  playerNumber: number
}

export default function PlayerInput({ value, onChangeText, playerNumber }: PlayerInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={`Player ${playerNumber}`}
        placeholderTextColor={COLORS.textSecondary}
        maxLength={12}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
})
