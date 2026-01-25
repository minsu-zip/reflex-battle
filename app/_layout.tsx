import { COLORS } from '@/constants/colors'
import { AD_CONFIG, AD_UNIT_IDS } from '@/src/constants/adUnitIds'
import { AdProvider } from '@/src/contexts/AdContext'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import mobileAds, { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads'
import 'react-native-reanimated'

// 스플래시용 전면 광고
const splashInterstitial = InterstitialAd.createForAdRequest(AD_UNIT_IDS.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
})

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false)
  const [adShown, setAdShown] = useState(false)

  useEffect(() => {
    // AdMob 초기화
    mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        console.log('AdMob initialized:', adapterStatuses)
      })
      .catch((error) => {
        console.error('AdMob initialization failed:', error)
      })
  }, [])

  useEffect(() => {
    if (!AD_CONFIG.SHOW_SPLASH_INTERSTITIAL) {
      setIsReady(true)
      return
    }

    let timeoutId: ReturnType<typeof setTimeout>

    const loadListener = splashInterstitial.addAdEventListener(AdEventType.LOADED, () => {
      console.log('Splash interstitial loaded')
      splashInterstitial.show()
    })

    const closeListener = splashInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Splash interstitial closed')
      setAdShown(true)
      setIsReady(true)
    })

    const errorListener = splashInterstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('Splash interstitial error:', error)
      setIsReady(true) // 광고 실패해도 앱 진행
    })

    // 광고 로드 시작
    splashInterstitial.load()

    // 타임아웃: 5초 후에도 광고 안 뜨면 그냥 진행
    timeoutId = setTimeout(() => {
      if (!adShown) {
        console.log('Ad timeout, proceeding without ad')
        setIsReady(true)
      }
    }, 5000)

    return () => {
      loadListener()
      closeListener()
      errorListener()
      clearTimeout(timeoutId)
    }
  }, [])

  // 로딩 화면 (스플래시 대용)
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  return (
    <AdProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          gestureEnabled: true, // iOS 스와이프 제스처 활성화
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="time-stop/setup" />
        <Stack.Screen name="time-stop/game" />
        <Stack.Screen name="time-stop/result" />
        <Stack.Screen name="quick-tap/setup" />
        <Stack.Screen name="quick-tap/game" />
        <Stack.Screen name="quick-tap/result" />
      </Stack>
      <StatusBar style="light" />
    </AdProvider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
})
