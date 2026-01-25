import { COLORS } from '@/constants/colors'
import React from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import NativeAdView from './NativeAdView'

interface ExitModalProps {
  visible: boolean
  onCancel: () => void
  onExit: () => void
}

export default function ExitModal({ visible, onCancel, onExit }: ExitModalProps) {
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
          <Text style={styles.title}>정말 나가시겠습니까?</Text>

          {/* 네이티브 광고 영역 */}
          <View style={styles.adContainer}>
            <NativeAdView />
          </View>

          {/* 버튼 영역 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.exitButton]}
              onPress={onExit}
              activeOpacity={0.7}
            >
              <Text style={styles.exitButtonText}>종료</Text>
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
