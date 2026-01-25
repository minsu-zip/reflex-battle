import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = '@reflex_battle_settings'

interface Settings {
  soundEnabled: boolean
  hapticEnabled: boolean
}

interface SettingsContextType {
  settings: Settings
  setSoundEnabled: (enabled: boolean) => void
  setHapticEnabled: (enabled: boolean) => void
  toggleSound: () => void
  toggleHaptic: () => void
}

const defaultSettings: Settings = {
  soundEnabled: true,
  hapticEnabled: true,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  // 설정 불러오기
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<Settings>
          setSettings({ ...defaultSettings, ...parsed })
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadSettings()
  }, [])

  // 설정 저장
  const saveSettings = useCallback(async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }, [])

  const setSoundEnabled = useCallback(
    (enabled: boolean) => {
      const newSettings = { ...settings, soundEnabled: enabled }
      setSettings(newSettings)
      saveSettings(newSettings)
    },
    [settings, saveSettings],
  )

  const setHapticEnabled = useCallback(
    (enabled: boolean) => {
      const newSettings = { ...settings, hapticEnabled: enabled }
      setSettings(newSettings)
      saveSettings(newSettings)
    },
    [settings, saveSettings],
  )

  const toggleSound = useCallback(() => {
    setSoundEnabled(!settings.soundEnabled)
  }, [settings.soundEnabled, setSoundEnabled])

  const toggleHaptic = useCallback(() => {
    setHapticEnabled(!settings.hapticEnabled)
  }, [settings.hapticEnabled, setHapticEnabled])

  if (!isLoaded) {
    return null
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSoundEnabled,
        setHapticEnabled,
        toggleSound,
        toggleHaptic,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
