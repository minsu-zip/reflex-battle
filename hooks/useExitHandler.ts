import { useCallback, useEffect, useState } from 'react'
import { BackHandler, Platform } from 'react-native'

/**
 * Android 뒤로가기 버튼 핸들러 훅
 * Home 화면에서 뒤로가기 시 종료 모달 표시
 */
export function useExitHandler() {
  const [exitModalVisible, setExitModalVisible] = useState(false)

  const showExitModal = useCallback(() => {
    setExitModalVisible(true)
  }, [])

  const hideExitModal = useCallback(() => {
    setExitModalVisible(false)
  }, [])

  const exitApp = useCallback(() => {
    BackHandler.exitApp()
  }, [])

  useEffect(() => {
    // Android에서만 동작
    if (Platform.OS !== 'android') {
      return
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // 모달이 이미 열려있으면 닫기
      if (exitModalVisible) {
        hideExitModal()
        return true
      }

      // 모달 표시
      showExitModal()
      return true // 기본 뒤로가기 동작 막기
    })

    return () => backHandler.remove()
  }, [exitModalVisible, hideExitModal, showExitModal])

  return {
    exitModalVisible,
    showExitModal,
    hideExitModal,
    exitApp,
    isAndroid: Platform.OS === 'android',
  }
}
