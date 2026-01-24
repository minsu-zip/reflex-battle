import { AD_UNIT_IDS } from '@/src/constants/adUnitIds'
import { useCallback, useEffect, useState } from 'react'
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads'

const interstitial = InterstitialAd.createForAdRequest(AD_UNIT_IDS.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
})

export function useInterstitialAd() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isClosed, setIsClosed] = useState(false)

  useEffect(() => {
    const loadListener = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      console.log('Interstitial ad loaded')
      setIsLoaded(true)
    })

    const closeListener = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Interstitial ad closed')
      setIsClosed(true)
      setIsLoaded(false)
      // 다음 광고 미리 로드
      interstitial.load()
    })

    const errorListener = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('Interstitial ad error:', error)
      setIsLoaded(false)
    })

    // 초기 로드
    interstitial.load()

    return () => {
      loadListener()
      closeListener()
      errorListener()
    }
  }, [])

  const showAd = useCallback(async (): Promise<boolean> => {
    if (isLoaded) {
      try {
        await interstitial.show()
        return true
      } catch (error) {
        console.error('Failed to show interstitial:', error)
        return false
      }
    }
    return false
  }, [isLoaded])

  const resetClosed = useCallback(() => {
    setIsClosed(false)
  }, [])

  return {
    isLoaded,
    isClosed,
    showAd,
    resetClosed,
  }
}
