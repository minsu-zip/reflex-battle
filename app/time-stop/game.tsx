import Button from '@/components/Button'
import StopButton from '@/components/StopButton'
import Timer from '@/components/Timer'
import { COLORS } from '@/constants/colors'
import { useTimer } from '@/hooks/useTimer'
import { Player } from '@/src/types/game'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type GamePhase = 'ready' | 'playing' | 'stopped'

export default function TimeStopGameScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ players: string; targetTime: string }>()

  const initialPlayers: Player[] = params.players ? JSON.parse(params.players) : []
  const targetTime = params.targetTime ? parseFloat(params.targetTime) : 3.0

  const [players, setPlayers] = useState<Player[]>(initialPlayers)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [gamePhase, setGamePhase] = useState<GamePhase>('ready')
  const [stoppedTime, setStoppedTime] = useState<number | null>(null)

  const { time, start, stop, reset } = useTimer()

  // 뒤로가기 (세팅 화면으로)
  const handleBack = () => {
    reset()
    router.back()
  }

  const currentPlayer = players[currentPlayerIndex]
  const remainingPlayers = players.length - currentPlayerIndex
  const isLastPlayer = currentPlayerIndex === players.length - 1

  // 게임 시작
  const handleStart = useCallback(() => {
    setGamePhase('playing')
    start()
  }, [start])

  // STOP 버튼 클릭
  const handleStop = useCallback(() => {
    if (gamePhase !== 'playing') return

    const finalTime = stop()
    const roundedTime = Math.round(finalTime * 100) / 100
    setStoppedTime(roundedTime)
    setGamePhase('stopped')

    // 현재 플레이어 점수 저장 (오차값)
    const score = Math.abs(targetTime - roundedTime)
    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers]
      newPlayers[currentPlayerIndex] = {
        ...newPlayers[currentPlayerIndex],
        score: Math.round(score * 100) / 100,
      }
      return newPlayers
    })
  }, [gamePhase, stop, targetTime, currentPlayerIndex])

  // 다음 플레이어로
  const handleNext = useCallback(() => {
    if (isLastPlayer) {
      // 모든 플레이어 완료 → 결과 화면으로
      const updatedPlayers = [...players]
      updatedPlayers[currentPlayerIndex] = {
        ...updatedPlayers[currentPlayerIndex],
        score:
          stoppedTime !== null ? Math.round(Math.abs(targetTime - stoppedTime) * 100) / 100 : 999,
      }

      router.replace({
        pathname: '/time-stop/result',
        params: {
          players: JSON.stringify(updatedPlayers),
          targetTime: targetTime.toString(),
        },
      })
    } else {
      // 다음 플레이어
      setCurrentPlayerIndex((prev) => prev + 1)
      setGamePhase('ready')
      setStoppedTime(null)
      reset()
    }
  }, [isLastPlayer, players, currentPlayerIndex, stoppedTime, targetTime, router, reset])

  // 오차 계산
  const calculateDifference = (): string => {
    if (stoppedTime === null) return ''
    const diff = stoppedTime - targetTime
    const sign = diff >= 0 ? '+' : ''
    return `${sign}${diff.toFixed(2)}초`
  }

  if (!currentPlayer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
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
        <Text style={styles.headerTitle}>🎯 TIME STOP</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {/* 현재 플레이어 정보 */}
        <View style={styles.header}>
          <Text style={styles.playerTurn}>{currentPlayer.name}의 차례</Text>
          <Text style={styles.targetTime}>목표: {targetTime.toFixed(1)}초</Text>
        </View>

        {/* 타이머 */}
        <View style={styles.timerContainer}>
          <Timer time={gamePhase === 'stopped' && stoppedTime !== null ? stoppedTime : time} />

          {/* 결과 표시 (STOP 후) */}
          {gamePhase === 'stopped' && stoppedTime !== null && (
            <View style={styles.resultContainer}>
              <Text
                style={[
                  styles.difference,
                  Math.abs(stoppedTime - targetTime) < 0.1
                    ? styles.excellent
                    : Math.abs(stoppedTime - targetTime) < 0.3
                      ? styles.good
                      : styles.normal,
                ]}
              >
                {calculateDifference()}
              </Text>
              <Text style={styles.differenceLabel}>
                오차: {Math.abs(stoppedTime - targetTime).toFixed(2)}초
              </Text>
            </View>
          )}
        </View>

        {/* 버튼 영역 */}
        <View style={styles.buttonContainer}>
          {gamePhase === 'ready' && <StopButton onPress={handleStart} label="START" />}

          {gamePhase === 'playing' && <StopButton onPress={handleStop} label="STOP" />}

          {gamePhase === 'stopped' && (
            <Button
              title={isLastPlayer ? '🏆 결과 보기' : '다음 플레이어 →'}
              onPress={handleNext}
              size="large"
              style={styles.nextButton}
            />
          )}
        </View>

        {/* 하단 정보 */}
        <View style={styles.footer}>
          <Text style={styles.remainingText}>남은 플레이어: {remainingPlayers}명</Text>
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
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
  },
  playerTurn: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  targetTime: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '600',
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  difference: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  excellent: {
    color: COLORS.success,
  },
  good: {
    color: COLORS.warning,
  },
  normal: {
    color: COLORS.danger,
  },
  differenceLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  nextButton: {
    minWidth: 200,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  remainingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
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
})
