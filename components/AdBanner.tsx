import { AD_UNIT_IDS } from '@/src/constants/adUnitIds'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads'

interface AdBannerProps {
  size?: BannerAdSize
}

export default function AdBanner({ size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER }: AdBannerProps) {
  const [adLoaded, setAdLoaded] = useState(false)
  const [adError, setAdError] = useState(false)

  if (adError) {
    return null // 광고 로드 실패 시 빈 공간 없이 처리
  }

  return (
    <View style={[styles.container, !adLoaded && styles.loading]}>
      <BannerAd
        unitId={AD_UNIT_IDS.BANNER}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded')
          setAdLoaded(true)
        }}
        onAdFailedToLoad={(error) => {
          console.error('Banner ad failed to load:', error)
          setAdError(true)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  loading: {
    minHeight: 50, // 로딩 중 최소 높이
  },
})
