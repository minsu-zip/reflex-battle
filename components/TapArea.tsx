import { COLORS } from '@/constants/colors'
import { useSettings } from '@/src/contexts/SettingsContext'
import { lightHaptic, successHaptic, warningHaptic } from '@/src/utils/haptics'
import React, { useCallback } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type TapAreaState = 'waiting' | 'ready' | 'go' | 'tooEarly' | 'result'

interface TapAreaProps {
  state: TapAreaState
  onTap: () => void
  reactionTime?: number
  disabled?: boolean
}

export default function TapArea({ state, onTap, reactionTime, disabled = false }: TapAreaProps) {
  const { settings } = useSettings()

  const handleTap = useCallback(() => {
    switch (state) {
      case 'waiting':
        lightHaptic(settings.hapticEnabled)
        break
      case 'ready':
        warningHaptic(settings.hapticEnabled)
        break
      case 'go':
        successHaptic(settings.hapticEnabled)
        break
      case 'tooEarly':
        lightHaptic(settings.hapticEnabled)
        break
    }
    onTap()
  }, [state, onTap, settings.hapticEnabled])
  const getBackgroundColor = () => {
    switch (state) {
      case 'waiting':
        return COLORS.surface
      case 'ready':
        return COLORS.danger
      case 'go':
        return COLORS.success
      case 'tooEarly':
        return COLORS.warning
      case 'result':
        return COLORS.primary
      default:
        return COLORS.surface
    }
  }

  const getMessage = () => {
    switch (state) {
      case 'waiting':
        return { main: '준비', sub: '화면을 탭해서 시작' }
      case 'ready':
        return { main: '기다려...', sub: '초록색이 될 때까지' }
      case 'go':
        return { main: '탭!', sub: '지금!' }
      case 'tooEarly':
        return { main: '너무 빨랐어요! 😅', sub: '초록색이 될 때까지 기다리세요' }
      case 'result':
        return {
          main: `${reactionTime?.toFixed(3)}초`,
          sub: '반응 시간',
        }
      default:
        return { main: '', sub: '' }
    }
  }

  const message = getMessage()

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: getBackgroundColor() }]}
      onPress={handleTap}
      disabled={disabled}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <Text style={styles.mainText}>{message.main}</Text>
        <Text style={styles.subText}>{message.sub}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
  },
  content: {
    alignItems: 'center',
  },
  mainText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subText: {
    fontSize: 18,
    color: COLORS.text,
    opacity: 0.8,
  },
})
