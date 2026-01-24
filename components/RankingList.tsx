import { COLORS } from '@/constants/colors'
import { RankedPlayer, getRankEmoji } from '@/src/utils/calculateScore'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface RankingListProps {
  players: RankedPlayer[]
  targetTime: number
  gameMode?: 'timeStop' | 'quickTap'
}

export default function RankingList({
  players,
  targetTime,
  gameMode = 'timeStop',
}: RankingListProps) {
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

  return (
    <View style={styles.container}>
      {players.map((player, index) => (
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
            <Text style={styles.playerScore}>
              {gameMode === 'timeStop' ? (
                <>오차: {player.score?.toFixed(2)}초</>
              ) : (
                <>{player.score?.toFixed(3)}초</>
              )}
            </Text>
          </View>

          {gameMode === 'timeStop' && (
            <View style={styles.timeInfo}>
              <Text style={styles.actualTime}>
                {(targetTime + (player.score ?? 0)).toFixed(2)}초
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
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
  playerScore: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  actualTime: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
})
