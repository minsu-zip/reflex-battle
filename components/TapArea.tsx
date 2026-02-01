import { COLORS } from '@/constants/colors'
import { useSettings } from '@/src/contexts/SettingsContext'
import { lightHaptic, successHaptic, warningHaptic } from '@/src/utils/haptics'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

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
        return { main: t('tapArea.ready'), sub: t('tapArea.tapToStart') }
      case 'ready':
        return { main: t('tapArea.wait'), sub: t('tapArea.waitForGreen') }
      case 'go':
        return { main: t('tapArea.tap'), sub: t('tapArea.now') }
      case 'tooEarly':
        return { main: `${t('tapArea.tooEarly')} 😅`, sub: t('tapArea.waitForGreenLong') }
      case 'result':
        return {
          main: `${reactionTime?.toFixed(3)}${t('common.seconds')}`,
          sub: t('quickTap.reactionTime'),
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
