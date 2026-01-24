export interface Player {
  id: string
  name: string
  score: number | null // 오차 또는 반응시간
}

export interface GameState {
  players: Player[]
  currentPlayerIndex: number
  targetTime?: number // Mode 1용
  isGameComplete: boolean
}

export type GameMode = 'timeStop' | 'quickTap'
