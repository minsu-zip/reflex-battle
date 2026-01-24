import AdBanner from '@/components/AdBanner'
import { COLORS } from '@/constants/colors'
import { useRouter } from 'expo-router'
import React from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function HomeScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>REFLEX BATTLE</Text>
        <Text style={styles.subtitle}>친구들과 반응속도 대결!</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => router.push('/time-stop/setup')}
          >
            <Text style={styles.modeEmoji}>🎯</Text>
            <Text style={styles.modeTitle}>TIME STOP</Text>
            <Text style={styles.modeDescription}>목표 시간에 정확히 멈춰라!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => router.push('/quick-tap/setup')}
          >
            <Text style={styles.modeEmoji}>⚡</Text>
            <Text style={styles.modeTitle}>QUICK TAP</Text>
            <Text style={styles.modeDescription}>색이 바뀌면 최대한 빨리!</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 하단 배너 광고 */}
      <AdBanner />
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
