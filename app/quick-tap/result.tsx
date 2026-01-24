import AdBanner from '@/components/AdBanner'
import Button from '@/components/Button'
import { COLORS } from '@/constants/colors'
import { useInterstitialAd } from '@/hooks/useInterstitialAd'
import { useAdContext } from '@/src/contexts/AdContext'
import { Player } from '@/src/types/game'
import { getRankEmoji } from '@/src/utils/calculateScore'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo } from 'react'
import { Alert, SafeAreaView, ScrollView, Share, StyleSheet, Text, View } from 'react-native'

interface RankedPlayer extends Player {
  rank: number
}

export default function QuickTapResultScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ players: string }>()

  const players: Player[] = params.players ? JSON.parse(params.players) : []

  const { showAd, isLoaded } = useInterstitialAd()
  const { incrementGameCount, shouldShowInterstitial } = useAdContext()

  // 게임 완료 시 카운트 증가
  useEffect(() => {
    incrementGameCount()
  }, [incrementGameCount])

  // 플레이어 순위 계산 (빠른 시간순)
  const rankedPlayers: RankedPlayer[] = useMemo(() => {
    const sorted = [...players].sort((a, b) => {
      const scoreA = a.score ?? 999
      const scoreB = b.score ?? 999
      return scoreA - scoreB
    })

    let currentRank = 1
    return sorted.map((player, index) => {
      if (index > 0 && player.score !== sorted[index - 1].score) {
        currentRank = index + 1
      }
      return { ...player, rank: currentRank }
    })
  }, [players])

  // 우승자
  const winner = rankedPlayers[0]

  // 다시하기 (전면 광고 포함)
  const handlePlayAgain = async () => {
    if (shouldShowInterstitial() && isLoaded) {
      await showAd()
    }

    const resetPlayers = players.map((p) => ({ ...p, score: null }))
    router.replace({
      pathname: '/quick-tap/game',
      params: {
        players: JSON.stringify(resetPlayers),
      },
    })
  }

  // 홈으로 (전면 광고 포함)
  const handleGoHome = async () => {
    if (shouldShowInterstitial() && isLoaded) {
      await showAd()
    }
    router.dismissAll()
    router.replace('/')
  }

  // 공유하기
  const handleShare = async () => {
    try {
      let text = `🎮 Reflex Battle 결과\n⚡ QUICK TAP\n\n`

      rankedPlayers.forEach((player) => {
        const emoji = getRankEmoji(player.rank)
        text += `${emoji} ${player.name}: ${player.score?.toFixed(3)}초\n`
      })

      text += '\n🔥 나도 도전하기!\n#ReflexBattle #반응속도'

      await Share.share({ message: text })
    } catch (error) {
      Alert.alert('공유 실패', '공유하는 중 오류가 발생했습니다.')
    }
  }

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return styles.gold
      case 2:
        return styles.silver
      case 3:
        return styles.bronze
      default:
        return styles.default
    }
  }

  const getRankBorderStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return styles.goldBorder
      case 2:
        return styles.silverBorder
      case 3:
        return styles.bronzeBorder
      default:
        return styles.defaultBorder
    }
  }

  // 반응 시간 평가
  const getReactionLabel = (time: number | null) => {
    if (time === null) return '측정 안됨'
    if (time < 0.2) return '⚡ 번개'
    if (time < 0.25) return '🔥 매우 빠름'
    if (time < 0.3) return '👍 빠름'
    if (time < 0.4) return '😊 평균'
    return '🐢 느림'
  }

  if (!winner) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>결과를 불러올 수 없습니다</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.trophy}>⚡</Text>
          <Text style={styles.title}>게임 결과</Text>
          <Text style={styles.subtitle}>QUICK TAP</Text>
        </View>

        {/* 우승자 하이라이트 */}
        <View style={styles.winnerSection}>
          <Text style={styles.winnerLabel}>🎉 우승 🎉</Text>
          <Text style={styles.winnerName}>{winner.name}</Text>
          <Text style={styles.winnerScore}>{winner.score?.toFixed(3)}초</Text>
          <Text style={styles.winnerFeedback}>{getReactionLabel(winner.score)}</Text>
        </View>

        {/* 전체 순위 */}
        <View style={styles.rankingSection}>
          <Text style={styles.sectionTitle}>전체 순위</Text>

          {rankedPlayers.map((player, index) => (
            <View
              key={player.id}
              style={[
                styles.playerCard,
                getRankBorderStyle(player.rank),
                index === 0 && styles.firstPlace,
              ]}
            >
              <View style={styles.rankContainer}>
                <Text style={[styles.rankEmoji, player.rank <= 3 && styles.rankEmojiLarge]}>
                  {getRankEmoji(player.rank)}
                </Text>
              </View>

              <View style={styles.playerInfo}>
                <Text style={[styles.playerName, getRankStyle(player.rank)]}>{player.name}</Text>
                <Text style={styles.reactionLabel}>{getReactionLabel(player.score)}</Text>
              </View>

              <View style={styles.timeInfo}>
                <Text style={styles.reactionTime}>{player.score?.toFixed(3)}초</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        <Button
          title="🔄 다시하기"
          onPress={handlePlayAgain}
          variant="primary"
          style={styles.button}
        />
        <View style={styles.buttonRow}>
          <Button
            title="🏠 홈으로"
            onPress={handleGoHome}
            variant="outline"
            style={styles.halfButton}
          />
          <Button
            title="📤 공유"
            onPress={handleShare}
            variant="secondary"
            style={styles.halfButton}
          />
        </View>
      </View>

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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  trophy: {
    fontSize: 64,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  winnerSection: {
    backgroundColor: COLORS.gold + '20',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  winnerLabel: {
    fontSize: 18,
    color: COLORS.gold,
    marginBottom: 8,
  },
  winnerName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 8,
  },
  winnerScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  winnerFeedback: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  rankingSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  firstPlace: {
    paddingVertical: 20,
  },
  goldBorder: {
    borderColor: COLORS.gold,
    backgroundColor: COLORS.gold + '15',
  },
  silverBorder: {
    borderColor: COLORS.silver,
    backgroundColor: COLORS.silver + '10',
  },
  bronzeBorder: {
    borderColor: COLORS.bronze,
    backgroundColor: COLORS.bronze + '10',
  },
  defaultBorder: {
    borderColor: COLORS.surface,
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  rankEmoji: {
    fontSize: 24,
  },
  rankEmojiLarge: {
    fontSize: 32,
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  gold: {
    color: COLORS.gold,
  },
  silver: {
    color: COLORS.silver,
  },
  bronze: {
    color: COLORS.bronze,
  },
  default: {
    color: COLORS.text,
  },
  reactionLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  reactionTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  button: {
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfButton: {
    flex: 1,
  },
})
