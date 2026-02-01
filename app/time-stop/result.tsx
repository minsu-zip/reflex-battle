import AdBanner from '@/components/AdBanner'
import Button from '@/components/Button'
import RankingList from '@/components/RankingList'
import { COLORS } from '@/constants/colors'
import { useAdContext } from '@/src/contexts/AdContext'
import { useSettings } from '@/src/contexts/SettingsContext'
import { Player } from '@/src/types/game'
import { generateShareText, rankPlayers } from '@/src/utils/calculateScore'
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

export default function TimeStopResultScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const params = useLocalSearchParams<{ players: string; targetTime: string }>()
  const { settings } = useSettings()

  const players: Player[] = params.players ? JSON.parse(params.players) : []
  const targetTime = params.targetTime ? parseFloat(params.targetTime) : 3.0

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

  // 플레이어 순위 계산
  const rankedPlayers = useMemo(() => {
    return rankPlayers(players, targetTime)
  }, [players, targetTime])

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
      pathname: '/time-stop/game',
      params: {
        players: JSON.stringify(resetPlayers),
        targetTime: targetTime.toString(),
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
      const shareText = generateShareText(rankedPlayers, targetTime, 'timeStop')

      await Share.share({
        message: shareText,
      })
    } catch (error) {
      Alert.alert(t('common.shareFailed'), t('common.shareError'))
    }
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
          <Text style={styles.trophy}>🏆</Text>
          <Text style={styles.title}>{t('common.gameResult')}</Text>
          <Text style={styles.targetTime}>
            {t('setup.targetTime')}: {targetTime.toFixed(1)}
            {t('common.seconds')}
          </Text>
        </Animated.View>

        {/* 우승자 하이라이트 */}
        <Animated.View entering={FadeInUp.delay(300).springify()}>
          <Animated.View style={[styles.winnerSection, winnerAnimatedStyle]}>
            <Text style={styles.winnerLabel}>🎉 {t('common.winner')} 🎉</Text>
            <Text style={styles.winnerName}>{winner.name}</Text>
            <Text style={styles.winnerScore}>
              {t('common.error')} {winner.score?.toFixed(2)}
              {t('common.seconds')}
            </Text>
          </Animated.View>
        </Animated.View>

        {/* 전체 순위 */}
        <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.rankingSection}>
          <Text style={styles.sectionTitle}>{t('common.ranking')}</Text>
          <RankingList players={rankedPlayers} targetTime={targetTime} gameMode="timeStop" />
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
    marginBottom: 8,
  },
  targetTime: {
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
    fontSize: 18,
    color: COLORS.text,
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
