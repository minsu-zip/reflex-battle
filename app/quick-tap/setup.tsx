import AdBanner from '@/components/AdBanner'
import Button from '@/components/Button'
import NumberStepper from '@/components/NumberStepper'
import PlayerInput from '@/components/PlayerInput'
import { COLORS } from '@/constants/colors'
import { CONFIG } from '@/constants/config'
import { Player } from '@/src/types/game'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function QuickTapSetupScreen() {
  const router = useRouter()
  const [playerCount, setPlayerCount] = useState(2)
  const [playerNames, setPlayerNames] = useState<string[]>(Array(CONFIG.MAX_PLAYERS).fill(''))

  const handlePlayerCountIncrease = () => {
    if (playerCount < CONFIG.MAX_PLAYERS) {
      setPlayerCount(playerCount + 1)
    }
  }

  const handlePlayerCountDecrease = () => {
    if (playerCount > CONFIG.MIN_PLAYERS) {
      setPlayerCount(playerCount - 1)
    }
  }

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames]
    newNames[index] = name
    setPlayerNames(newNames)
  }

  const handleStartGame = () => {
    const players: Player[] = Array.from({ length: playerCount }, (_, i) => ({
      id: `player-${i + 1}`,
      name: playerNames[i].trim() || `Player ${i + 1}`,
      score: null,
    }))

    router.push({
      pathname: '/quick-tap/game',
      params: {
        players: JSON.stringify(players),
      },
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← 뒤로</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>⚡ QUICK TAP</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* 참가 인원 설정 */}
          <NumberStepper
            label="참가 인원"
            value={playerCount}
            onIncrease={handlePlayerCountIncrease}
            onDecrease={handlePlayerCountDecrease}
            min={CONFIG.MIN_PLAYERS}
            max={CONFIG.MAX_PLAYERS}
            unit="명"
          />

          {/* 플레이어 이름 입력 */}
          <View style={styles.playerInputs}>
            <Text style={styles.sectionLabel}>플레이어 이름</Text>
            {Array.from({ length: playerCount }, (_, i) => (
              <PlayerInput
                key={i}
                playerNumber={i + 1}
                value={playerNames[i]}
                onChangeText={(text) => handlePlayerNameChange(i, text)}
              />
            ))}
          </View>

          {/* 게임 규칙 설명 */}
          <View style={styles.rulesContainer}>
            <Text style={styles.rulesTitle}>🎮 게임 방법</Text>
            <Text style={styles.rulesText}>
              1. 화면이 빨간색일 때 기다리세요{'\n'}
              2. 초록색으로 바뀌면 최대한 빨리 탭!{'\n'}
              3. 반응 시간이 가장 빠른 사람이 승리!{'\n'}
              ⚠️ 초록색 전에 탭하면 실격!
            </Text>
          </View>
        </ScrollView>

        {/* 게임 시작 버튼 */}
        <View style={styles.footer}>
          <Button
            title="🎮 게임 시작"
            onPress={handleStartGame}
            size="large"
            style={styles.startButton}
          />
        </View>
      </KeyboardAvoidingView>

      {/* 하단 배너 광고 */}
      <AdBanner />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  sectionLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  playerInputs: {
    marginBottom: 24,
  },
  rulesContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  rulesText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
  },
  startButton: {
    width: '100%',
  },
})
