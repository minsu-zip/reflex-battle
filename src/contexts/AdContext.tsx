import { AD_CONFIG } from '@/src/constants/adUnitIds'
import React, { ReactNode, createContext, useCallback, useContext, useState } from 'react'

interface AdContextType {
  gameCount: number
  incrementGameCount: () => void
  shouldShowInterstitial: () => boolean
  resetGameCount: () => void
}

const AdContext = createContext<AdContextType | undefined>(undefined)

export function AdProvider({ children }: { children: ReactNode }) {
  const [gameCount, setGameCount] = useState(0)

  const incrementGameCount = useCallback(() => {
    setGameCount((prev) => prev + 1)
  }, [])

  const shouldShowInterstitial = useCallback(() => {
    // N회마다 1번 광고 표시
    return gameCount > 0 && gameCount % AD_CONFIG.INTERSTITIAL_FREQUENCY === 0
  }, [gameCount])

  const resetGameCount = useCallback(() => {
    setGameCount(0)
  }, [])

  return (
    <AdContext.Provider
      value={{
        gameCount,
        incrementGameCount,
        shouldShowInterstitial,
        resetGameCount,
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
