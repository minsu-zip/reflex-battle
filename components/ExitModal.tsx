import { COLORS } from '@/constants/colors'
import { AD_UNIT_IDS } from '@/src/constants/adUnitIds'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { NativeAd } from 'react-native-google-mobile-ads'
import NativeAdView from './NativeAdView'

interface ExitModalProps {
  visible: boolean
  onCancel: () => void
  onExit: () => void
}

export default function ExitModal({ visible, onCancel, onExit }: ExitModalProps) {
  const { t } = useTranslation()
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null)
  const [adLoading, setAdLoading] = useState(true)
  const adRef = useRef<NativeAd | null>(null)

  // 컴포넌트 마운트 시 바로 광고 프리로드
  useEffect(() => {
    let isMounted = true

    const loadAd = async () => {
      try {
        const ad = await NativeAd.createForAdRequest(AD_UNIT_IDS.NATIVE, {
          requestNonPersonalizedAdsOnly: true,
        })
        if (isMounted) {
          adRef.current = ad
          setNativeAd(ad)
          setAdLoading(false)
        } else {
          ad.destroy()
        }
      } catch {
        if (isMounted) {
          setAdLoading(false)
        }
      }
    }

    loadAd()

    return () => {
      isMounted = false
      if (adRef.current) {
        adRef.current.destroy()
      }
    }
  }, [])

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* 제목 */}
          <Text style={styles.title}>{t('exitModal.title')}</Text>

          {/* 네이티브 광고 영역 (프리로드됨) */}
          <View style={styles.adContainer}>
            <NativeAdView preloadedAd={nativeAd} isLoading={adLoading} />
          </View>

          {/* 버튼 영역 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.exitButton]}
              onPress={onExit}
              activeOpacity={0.7}
            >
              <Text style={styles.exitButtonText}>{t('common.exit')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  adContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  exitButton: {
    backgroundColor: COLORS.danger,
  },
  exitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
})
