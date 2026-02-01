import * as Localization from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import ru from './locales/ru.json'
import zh from './locales/zh.json'

const resources = {
  ko: { translation: ko },
  en: { translation: en },
  ja: { translation: ja },
  zh: { translation: zh },
  ru: { translation: ru },
}

// 지원하는 언어 목록
const supportedLanguages = ['ko', 'en', 'ja', 'zh', 'ru']

// 기기 언어에서 지원 언어 찾기
const getDeviceLanguage = (): string => {
  const locales = Localization.getLocales()
  if (locales.length === 0) return 'en'

  const deviceLanguage = locales[0].languageCode

  // 정확히 일치하는 언어 찾기
  if (deviceLanguage && supportedLanguages.includes(deviceLanguage)) {
    return deviceLanguage
  }

  // 중국어 변형 처리 (zh-CN, zh-TW, zh-Hans, zh-Hant 등)
  if (deviceLanguage?.startsWith('zh')) {
    return 'zh'
  }

  // 기본값은 영어
  return 'en'
}

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

export default i18n

// 언어 변경 함수 (테스트용)
export const changeLanguage = (lang: string) => {
  if (supportedLanguages.includes(lang)) {
    i18n.changeLanguage(lang)
  }
}

// 현재 언어 가져오기
export const getCurrentLanguage = () => i18n.language

// 지원 언어 목록
export const getSupportedLanguages = () => supportedLanguages
