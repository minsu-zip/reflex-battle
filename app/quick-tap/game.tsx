import Button from '@/components/Button'
import TapArea from '@/components/TapArea'
import { COLORS } from '@/constants/colors'
import { CONFIG } from '@/constants/config'
import { Player } from '@/src/types/game'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type GamePhase = 'waiting' | 'ready' | 'go' | 'tooEarly' | 'result'

export default function QuickTapGameScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ players: string }>()

  const initialPlayers: Player[] = params.players ? JSON.parse(params.players) : []

  const [players, setPlayers] = useState<Player[]>(initialPlayers)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [gamePhase, setGamePhase] = useState<GamePhase>('waiting')
  const [reactionTime, setReactionTime] = useState<number | null>(null)

  const goTimeRef = useRef<number>(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentPlayer = players[currentPlayerIndex]
  const remainingPlayers = players.length - currentPlayerIndex
  const isLastPlayer = currentPlayerIndex === players.length - 1

  // 클린업
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // 뒤로가기 (세팅 화면으로)
  const handleBack = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    router.back()
  }

  // 게임 시작 (대기 → 준비)
  const startRound = useCallback(() => {
    setGamePhase('ready')
    setReactionTime(null)

    // 랜덤 대기 시간 후 GO!
    const delay =
      Math.random() * (CONFIG.QUICK_TAP_MAX_DELAY - CONFIG.QUICK_TAP_MIN_DELAY) +
      CONFIG.QUICK_TAP_MIN_DELAY

    timeoutRef.current = setTimeout(() => {
      setGamePhase('go')
      goTimeRef.current = Date.now()
    }, delay)
  }, [])

  // 탭 핸들러
  const handleTap = useCallback(() => {
    switch (gamePhase) {
      case 'waiting':
        // 게임 시작
        startRound()
        break

      case 'ready':
        // 너무 빨리 탭함!
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        setGamePhase('tooEarly')
        break

      case 'go':
        // 정상 탭! 반응시간 측정
        const reaction = (Date.now() - goTimeRef.current) / 1000
        setReactionTime(reaction)
        setGamePhase('result')

        // 현재 플레이어 점수 저장
        setPlayers((prevPlayers) => {
          const newPlayers = [...prevPlayers]
          newPlayers[currentPlayerIndex] = {
            ...newPlayers[currentPlayerIndex],
            score: Math.round(reaction * 1000) / 1000,
          }
          return newPlayers
        })
        break

      case 'tooEarly':
        // 다시 시도
        setGamePhase('waiting')
        break

      default:
        break
    }
  }, [gamePhase, startRound, currentPlayerIndex])

  // 다음 플레이어로
  const handleNext = useCallback(() => {
    if (isLastPlayer) {
      // 모든 플레이어 완료 → 결과 화면으로
      router.replace({
        pathname: '/quick-tap/result',
        params: {
          players: JSON.stringify(players),
        },
      })
    } else {
      // 다음 플레이어
      setCurrentPlayerIndex((prev) => prev + 1)
      setGamePhase('waiting')
      setReactionTime(null)
    }
  }, [isLastPlayer, players, router])

  // 반응 시간 평가
  const getReactionFeedback = () => {
    if (reactionTime === null) return ''
    if (reactionTime < 0.2) return '⚡ 번개 반응!'
    if (reactionTime < 0.25) return '🔥 매우 빠름!'
    if (reactionTime < 0.3) return '👍 좋아요!'
    if (reactionTime < 0.4) return '😊 평균'
    return '🐢 조금 느려요'
  }

  if (!currentPlayer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.playerTurn}>플레이어 정보를 불러올 수 없습니다</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⚡ QUICK TAP</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* 플레이어 정보 */}
      <View style={styles.header}>
        <Text style={styles.playerTurn}>{currentPlayer.name}의 차례</Text>
        <View style={styles.progressDots}>
          {players.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index < currentPlayerIndex && styles.dotComplete,
                index === currentPlayerIndex && styles.dotCurrent,
              ]}
            />
          ))}
        </View>
      </View>

      {/* 탭 영역 */}
      <TapArea
        state={gamePhase}
        onTap={handleTap}
        reactionTime={reactionTime ?? undefined}
        disabled={gamePhase === 'result'}
      />

      {/* 결과 표시 및 다음 버튼 */}
      {gamePhase === 'result' && (
        <View style={styles.resultSection}>
          <Text style={styles.feedback}>{getReactionFeedback()}</Text>
          <Button
            title={isLastPlayer ? '🏆 결과 보기' : '다음 플레이어 →'}
            onPress={handleNext}
            size="large"
            style={styles.nextButton}
          />
        </View>
      )}

      {/* 하단 정보 */}
      <View style={styles.footer}>
        <Text style={styles.remainingText}>남은 플레이어: {remainingPlayers}명</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topHeader: {
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
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  playerTurn: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.surface,
  },
  dotComplete: {
    backgroundColor: COLORS.success,
  },
  dotCurrent: {
    backgroundColor: COLORS.primary,
  },
  resultSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  feedback: {
    fontSize: 20,
    color: COLORS.text,
    marginBottom: 16,
  },
  nextButton: {
    minWidth: 200,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  remainingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
})
