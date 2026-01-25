import * as Haptics from 'expo-haptics'

/**
 * 햅틱 피드백 유틸리티
 * SettingsContext의 hapticEnabled 상태와 함께 사용
 */

// 가벼운 터치 (일반 버튼 클릭)
export const lightHaptic = async (enabled: boolean) => {
  if (!enabled) return
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  } catch (error) {
    console.warn('Haptic feedback failed:', error)
  }
}

// 중간 터치 (게임 시작 버튼)
export const mediumHaptic = async (enabled: boolean) => {
  if (!enabled) return
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  } catch (error) {
    console.warn('Haptic feedback failed:', error)
  }
}

// 강한 터치 (STOP 버튼)
export const heavyHaptic = async (enabled: boolean) => {
  if (!enabled) return
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
  } catch (error) {
    console.warn('Haptic feedback failed:', error)
  }
}

// 성공 알림 (우승자 표시)
export const successHaptic = async (enabled: boolean) => {
  if (!enabled) return
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  } catch (error) {
    console.warn('Haptic feedback failed:', error)
  }
}

// 경고 알림 (너무 빨리 탭)
export const warningHaptic = async (enabled: boolean) => {
  if (!enabled) return
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
  } catch (error) {
    console.warn('Haptic feedback failed:', error)
  }
}

// 에러 알림
export const errorHaptic = async (enabled: boolean) => {
  if (!enabled) return
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
  } catch (error) {
    console.warn('Haptic feedback failed:', error)
  }
}

// 선택 피드백 (리스트 아이템 선택 등)
export const selectionHaptic = async (enabled: boolean) => {
  if (!enabled) return
  try {
    await Haptics.selectionAsync()
  } catch (error) {
    console.warn('Haptic feedback failed:', error)
  }
}
