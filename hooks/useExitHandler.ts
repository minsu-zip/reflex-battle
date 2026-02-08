import { useIsFocused } from '@react-navigation/native'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState, BackHandler, Platform } from 'react-native'

/**
 * Android 뒤로가기 버튼 핸들러 훅
 * Home 화면에서 뒤로가기 시 종료 모달 표시
 */
export function useExitHandler() {
  const [exitModalVisible, setExitModalVisible] = useState(false)
  const isFocused = useIsFocused()
  const appState = useRef(AppState.currentState)

  const showExitModal = useCallback(() => {
    setExitModalVisible(true)
  }, [])

  const hideExitModal = useCallback(() => {
    setExitModalVisible(false)
  }, [])

  const exitApp = useCallback(() => {
    setExitModalVisible(false)
    setTimeout(() => {
      BackHandler.exitApp()
    }, 100)
  }, [])

  // 앱이 백그라운드에서 포그라운드로 돌아올 때 모달 초기화
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        setExitModalVisible(false)
      }
      appState.current = nextAppState
    })

    return () => subscription.remove()
  }, [])

  useEffect(() => {
    // Android에서만, 홈 화면이 포커스된 경우에만 동작
    if (Platform.OS !== 'android' || !isFocused) {
      return
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (exitModalVisible) {
        hideExitModal()
        return true
      }

      showExitModal()
      return true
    })

    return () => backHandler.remove()
  }, [exitModalVisible, isFocused, hideExitModal, showExitModal])

  return {
    exitModalVisible,
    showExitModal,
    hideExitModal,
    exitApp,
    isAndroid: Platform.OS === 'android',
  }
}
