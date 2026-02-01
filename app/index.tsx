import AdBanner from '@/components/AdBanner'
import ExitModal from '@/components/ExitModal'
import { COLORS } from '@/constants/colors'
import { useExitHandler } from '@/hooks/useExitHandler'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const router = useRouter()
  const { exitModalVisible, hideExitModal, exitApp } = useExitHandler()
  const { t } = useTranslation()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('home.title')}</Text>
        <Text style={styles.subtitle}>{t('home.subtitle')}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => router.push('/time-stop/setup')}
          >
            <Text style={styles.modeEmoji}>🎯</Text>
            <Text style={styles.modeTitle}>{t('home.timeStopTitle')}</Text>
            <Text style={styles.modeDescription}>{t('home.timeStopDesc')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => router.push('/quick-tap/setup')}
          >
            <Text style={styles.modeEmoji}>⚡</Text>
            <Text style={styles.modeTitle}>{t('home.quickTapTitle')}</Text>
            <Text style={styles.modeDescription}>{t('home.quickTapDesc')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 하단 배너 광고 */}
      <AdBanner />

      {/* Android 종료 확인 모달 */}
      {Platform.OS === 'android' && (
        <ExitModal visible={exitModalVisible} onCancel={hideExitModal} onExit={exitApp} />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 48,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  modeButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  modeEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  modeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  modeDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
})
