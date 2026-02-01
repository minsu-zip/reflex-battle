import AdBanner from '@/components/AdBanner'
import Button from '@/components/Button'
import { COLORS } from '@/constants/colors'
import { useAdContext } from '@/src/contexts/AdContext'
import { useSettings } from '@/src/contexts/SettingsContext'
import { Player } from '@/src/types/game'
import { getRankEmoji } from '@/src/utils/calculateScore'
import { successHaptic } from '@/src/utils/haptics'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, ScrollView, Share, StyleSheet, Text, View } from 'react-native'
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

interface RankedPlayer extends Player {
  rank: number
}

export default function QuickTapResultScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const params = useLocalSearchParams<{ players: string }>()
  const { settings } = useSettings()

  const players: Player[] = params.players ? JSON.parse(params.players) : []

  // 우승자 섹션 펄스 애니메이션
  const winnerScale = useSharedValue(1)

  const winnerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: winnerScale.value }],
  }))

  const {
    gameCount,
    incrementGameCount,
    shouldShowInterstitial,
    isInterstitialLoaded,
    showInterstitialAd,
    preloadInterstitialAd,
  } = useAdContext()

  // 화면 진입 시 햅틱 + 애니메이션
  useEffect(() => {
    successHaptic(settings.hapticEnabled)

    // 우승자 섹션 펄스 애니메이션
    winnerScale.value = withSequence(
      withSpring(1.05, { damping: 3 }),
      withSpring(1, { damping: 5 }),
      withRepeat(
        withSequence(withTiming(1.02, { duration: 1000 }), withTiming(1, { duration: 1000 })),
        -1,
        true,
      ),
    )
  }, [settings.hapticEnabled, winnerScale])

  // 다음 게임에서 광고가 필요한지 미리 확인하고 로드
  useEffect(() => {
    const nextCount = gameCount + 1
    const willNeedAdNext = nextCount > 0 && nextCount % 3 === 0

    if (willNeedAdNext && !isInterstitialLoaded) {
      preloadInterstitialAd()
    }
  }, [gameCount, isInterstitialLoaded, preloadInterstitialAd])

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
    incrementGameCount()

    if (shouldShowInterstitial() && isInterstitialLoaded) {
      await showInterstitialAd()
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
    incrementGameCount()

    if (shouldShowInterstitial() && isInterstitialLoaded) {
      await showInterstitialAd()
    }

    router.dismissAll()
    router.replace('/')
  }

  // 공유하기
  const handleShare = async () => {
    try {
      let text = `🎮 ${t('share.result')}\n⚡ QUICK TAP\n\n`

      rankedPlayers.forEach((player) => {
        const emoji = getRankEmoji(player.rank)
        text += `${emoji} ${player.name}: ${player.score?.toFixed(3)}${t('common.seconds')}\n`
      })

      text += `\n🔥 ${t('share.challenge')}\n#ReflexBattle`

      await Share.share({ message: text })
    } catch (error) {
      Alert.alert(t('common.shareFailed'), t('common.shareError'))
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
    if (time === null) return t('feedback.notMeasured')
    if (time < 0.2) return `⚡ ${t('feedback.lightning')}`
    if (time < 0.25) return `🔥 ${t('feedback.veryFast')}`
    if (time < 0.3) return `👍 ${t('feedback.fast')}`
    if (time < 0.4) return `😊 ${t('feedback.average')}`
    return `🐢 ${t('feedback.slow')}`
  }

  if (!winner) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{t('common.noResult')}</Text>
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
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <Text style={styles.trophy}>⚡</Text>
          <Text style={styles.title}>{t('common.gameResult')}</Text>
          <Text style={styles.subtitle}>QUICK TAP</Text>
        </Animated.View>

        {/* 우승자 하이라이트 */}
        <Animated.View entering={FadeInUp.delay(300).springify()}>
          <Animated.View style={[styles.winnerSection, winnerAnimatedStyle]}>
            <Text style={styles.winnerLabel}>🎉 {t('common.winner')} 🎉</Text>
            <Text style={styles.winnerName}>{winner.name}</Text>
            <Text style={styles.winnerScore}>
              {winner.score?.toFixed(3)}
              {t('common.seconds')}
            </Text>
            <Text style={styles.winnerFeedback}>{getReactionLabel(winner.score)}</Text>
          </Animated.View>
        </Animated.View>

        {/* 전체 순위 */}
        <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.rankingSection}>
          <Text style={styles.sectionTitle}>{t('common.ranking')}</Text>

          {rankedPlayers.map((player, index) => (
            <Animated.View
              entering={FadeInUp.delay(600 + index * 100).duration(300)}
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
                <Text style={styles.reactionTime}>
                  {player.score?.toFixed(3)}
                  {t('common.seconds')}
                </Text>
              </View>
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        <Button
          title={`🔄 ${t('common.playAgain')}`}
          onPress={handlePlayAgain}
          variant="primary"
          style={styles.button}
        />
        <View style={styles.buttonRow}>
          <Button
            title={`🏠 ${t('common.home')}`}
            onPress={handleGoHome}
            variant="outline"
            style={styles.halfButton}
          />
          <Button
            title={`📤 ${t('common.share')}`}
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
