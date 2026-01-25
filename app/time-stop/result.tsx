import AdBanner from '@/components/AdBanner'
import Button from '@/components/Button'
import RankingList from '@/components/RankingList'
import { COLORS } from '@/constants/colors'
import { useAdContext } from '@/src/contexts/AdContext'
import { Player } from '@/src/types/game'
import { generateShareText, rankPlayers } from '@/src/utils/calculateScore'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useMemo } from 'react'
import { Alert, ScrollView, Share, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function TimeStopResultScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ players: string; targetTime: string }>()

  const players: Player[] = params.players ? JSON.parse(params.players) : []
  const targetTime = params.targetTime ? parseFloat(params.targetTime) : 3.0

  const {
    gameCount,
    incrementGameCount,
    shouldShowInterstitial,
    isInterstitialLoaded,
    showInterstitialAd,
    preloadInterstitialAd,
  } = useAdContext()

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
      Alert.alert('공유 실패', '공유하는 중 오류가 발생했습니다.')
    }
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
          <Text style={styles.trophy}>🏆</Text>
          <Text style={styles.title}>게임 결과</Text>
          <Text style={styles.targetTime}>목표 시간: {targetTime.toFixed(1)}초</Text>
        </View>

        {/* 우승자 하이라이트 */}
        <View style={styles.winnerSection}>
          <Text style={styles.winnerLabel}>🎉 우승 🎉</Text>
          <Text style={styles.winnerName}>{winner.name}</Text>
          <Text style={styles.winnerScore}>오차 {winner.score?.toFixed(2)}초</Text>
        </View>

        {/* 전체 순위 */}
        <View style={styles.rankingSection}>
          <Text style={styles.sectionTitle}>전체 순위</Text>
          <RankingList players={rankedPlayers} targetTime={targetTime} gameMode="timeStop" />
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
