import { COLORS } from '@/constants/colors'
import { AD_CONFIG, AD_UNIT_IDS } from '@/src/constants/adUnitIds'
import { AdProvider } from '@/src/contexts/AdContext'
import { SettingsProvider } from '@/src/contexts/SettingsContext'
import '@/src/i18n' // i18n 초기화
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import mobileAds, { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads'
import 'react-native-reanimated'

// 스플래시 화면 유지
SplashScreen.preventAutoHideAsync()

// 스플래시용 전면 광고
const splashInterstitial = InterstitialAd.createForAdRequest(AD_UNIT_IDS.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
})

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false)

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
      SplashScreen.hideAsync()
      setIsReady(true)
      return
    }

    let timeoutId: ReturnType<typeof setTimeout>
    let adLoaded = false

    const loadListener = splashInterstitial.addAdEventListener(AdEventType.LOADED, async () => {
      console.log('Splash interstitial loaded')
      adLoaded = true
      // 스플래시 숨기고 바로 광고 표시
      await SplashScreen.hideAsync()
      splashInterstitial.show()
    })

    const closeListener = splashInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Splash interstitial closed')
      setIsReady(true)
    })

    const errorListener = splashInterstitial.addAdEventListener(
      AdEventType.ERROR,
      async (error) => {
        console.error('Splash interstitial error:', error)
        await SplashScreen.hideAsync()
        setIsReady(true) // 광고 실패해도 앱 진행
      },
    )

    // 광고 로드 시작
    splashInterstitial.load()

    // 타임아웃: 5초 후에도 광고 안 뜨면 그냥 진행
    timeoutId = setTimeout(async () => {
      if (!adLoaded) {
        console.log('Ad timeout, proceeding without ad')
        await SplashScreen.hideAsync()
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

  // 스플래시가 숨겨질 때까지 아무것도 렌더링하지 않음
  if (!isReady) {
    return null
  }

  return (
    <SettingsProvider>
      <AdProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
            gestureEnabled: true,
            fullScreenGestureEnabled: true, // iOS 전체 화면 스와이프 제스처
            animation: 'slide_from_right', // 스와이프 애니메이션
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
    </SettingsProvider>
  )
}
