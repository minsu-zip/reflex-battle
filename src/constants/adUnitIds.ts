import { Platform } from 'react-native'

// 테스트 모드 설정 (개발 중에는 true, 출시 시 false)
const TEST_MODE = __DEV__

// Google 제공 테스트 광고 ID
const TEST_IDS = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  NATIVE: 'ca-app-pub-3940256099942544/2247696110',
}

// 실제 광고 ID
const PRODUCTION_IDS = {
  ANDROID: {
    BANNER: 'ca-app-pub-1115538294872595/1874125263',
    INTERSTITIAL: 'ca-app-pub-1115538294872595/3535612130',
    NATIVE: 'ca-app-pub-1115538294872595/4420661850',
  },
  IOS: {
    BANNER: 'ca-app-pub-1115538294872595/5343819141',
    INTERSTITIAL: 'ca-app-pub-1115538294872595/5247793837',
    NATIVE: 'ca-app-pub-1115538294872595/4952936905',
  },
}

// 플랫폼별 ID 선택
const getAdUnitId = (type: 'BANNER' | 'INTERSTITIAL' | 'NATIVE'): string => {
  if (TEST_MODE) {
    return TEST_IDS[type]
  }

  return (
    Platform.select({
      ios: PRODUCTION_IDS.IOS[type],
      android: PRODUCTION_IDS.ANDROID[type],
    }) || TEST_IDS[type]
  )
}

export const AD_UNIT_IDS = {
  BANNER: getAdUnitId('BANNER'),
  INTERSTITIAL: getAdUnitId('INTERSTITIAL'),
  NATIVE: getAdUnitId('NATIVE'),
}

// 광고 빈도 설정
export const AD_CONFIG = {
  // 전면 광고: N회 게임마다 1번
  INTERSTITIAL_FREQUENCY: 3,
  // 스플래시 후 전면 광고 표시 여부
  SHOW_SPLASH_INTERSTITIAL: true,
}
