import { Player } from '../types/game'

export interface RankedPlayer extends Player {
  rank: number
  actualTime: number
}

/**
 * 플레이어들을 오차 기준으로 정렬하고 순위 부여
 */
export function rankPlayers(players: Player[], targetTime: number): RankedPlayer[] {
  // 오차(score)가 적은 순으로 정렬
  const sorted = [...players].sort((a, b) => {
    const scoreA = a.score ?? 999
    const scoreB = b.score ?? 999
    return scoreA - scoreB
  })

  // 순위 부여 (동점 처리 포함)
  let currentRank = 1
  return sorted.map((player, index) => {
    if (index > 0 && player.score !== sorted[index - 1].score) {
      currentRank = index + 1
    }

    const actualTime = targetTime + (player.score ?? 0)

    return {
      ...player,
      rank: currentRank,
      actualTime: Math.round(actualTime * 100) / 100,
    }
  })
}

/**
 * 순위에 따른 메달 이모지 반환
 */
export function getRankEmoji(rank: number): string {
  switch (rank) {
    case 1:
      return '🥇'
    case 2:
      return '🥈'
    case 3:
      return '🥉'
    default:
      return `${rank}등`
  }
}

/**
 * 순위에 따른 메달 텍스트 반환
 */
export function getRankText(rank: number): string {
  switch (rank) {
    case 1:
      return '1등'
    case 2:
      return '2등'
    case 3:
      return '3등'
    default:
      return `${rank}등`
  }
}

/**
 * 결과 공유용 텍스트 생성
 */
export function generateShareText(
  rankedPlayers: RankedPlayer[],
  targetTime: number,
  gameMode: 'timeStop' | 'quickTap',
): string {
  const modeText = gameMode === 'timeStop' ? '⏱️ TIME STOP' : '⚡ QUICK TAP'
  const targetText = gameMode === 'timeStop' ? `목표: ${targetTime.toFixed(1)}초` : ''

  let text = `🎮 Reflex Battle 결과\n${modeText}\n${targetText}\n\n`

  rankedPlayers.forEach((player) => {
    const emoji = getRankEmoji(player.rank)
    const scoreText =
      gameMode === 'timeStop'
        ? `오차 ${player.score?.toFixed(2)}초`
        : `${player.score?.toFixed(3)}초`
    text += `${emoji} ${player.name}: ${scoreText}\n`
  })

  text += '\n🔥 나도 도전하기!\n#ReflexBattle #반응속도'

  return text
}
