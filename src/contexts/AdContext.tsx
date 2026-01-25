import { AD_CONFIG, AD_UNIT_IDS } from '@/src/constants/adUnitIds'
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads'

interface AdContextType {
  gameCount: number
  incrementGameCount: () => void
  shouldShowInterstitial: () => boolean
  resetGameCount: () => void
  isInterstitialLoaded: boolean
  showInterstitialAd: () => Promise<boolean>
  preloadInterstitialAd: () => void
}

const AdContext = createContext<AdContextType | undefined>(undefined)

let interstitialAd: InterstitialAd | null = null

export function AdProvider({ children }: { children: ReactNode }) {
  const [gameCount, setGameCount] = useState(0)
  const gameCountRef = useRef(0)

  const [isInterstitialLoaded, setIsInterstitialLoaded] = useState(false)
  const isLoadingRef = useRef(false)

  useEffect(() => {
    const createAndLoadAd = () => {
      interstitialAd = InterstitialAd.createForAdRequest(AD_UNIT_IDS.INTERSTITIAL, {
        requestNonPersonalizedAdsOnly: true,
      })

      const loadListener = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        setIsInterstitialLoaded(true)
        isLoadingRef.current = false
      })

      const closeListener = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        setIsInterstitialLoaded(false)
        setTimeout(() => {
          createAndLoadAd()
        }, 500)
      })

      const errorListener = interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('Interstitial ad error:', error)
        setIsInterstitialLoaded(false)
        isLoadingRef.current = false
        setTimeout(() => {
          createAndLoadAd()
        }, 3000)
      })

      isLoadingRef.current = true
      interstitialAd.load()

      return () => {
        loadListener()
        closeListener()
        errorListener()
      }
    }

    const cleanup = createAndLoadAd()
    return cleanup
  }, [])

  const incrementGameCount = useCallback(() => {
    gameCountRef.current += 1
    setGameCount(gameCountRef.current)
  }, [])

  const shouldShowInterstitial = useCallback(() => {
    return gameCountRef.current > 0 && gameCountRef.current % AD_CONFIG.INTERSTITIAL_FREQUENCY === 0
  }, [])

  const resetGameCount = useCallback(() => {
    gameCountRef.current = 0
    setGameCount(0)
  }, [])

  const showInterstitialAd = useCallback(async (): Promise<boolean> => {
    if (interstitialAd && isInterstitialLoaded) {
      try {
        await interstitialAd.show()
        return true
      } catch (error) {
        console.error('Failed to show interstitial:', error)
        return false
      }
    }
    return false
  }, [isInterstitialLoaded])

  const preloadInterstitialAd = useCallback(() => {
    if (isInterstitialLoaded || isLoadingRef.current || !interstitialAd) {
      return
    }
    isLoadingRef.current = true
    interstitialAd.load()
  }, [isInterstitialLoaded])

  return (
    <AdContext.Provider
      value={{
        gameCount,
        incrementGameCount,
        shouldShowInterstitial,
        resetGameCount,
        isInterstitialLoaded,
        showInterstitialAd,
        preloadInterstitialAd,
      }}
    >
      {children}
    </AdContext.Provider>
  )
}

export function useAdContext() {
  const context = useContext(AdContext)
  if (context === undefined) {
    throw new Error('useAdContext must be used within an AdProvider')
  }
  return context
}
