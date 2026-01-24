import { CONFIG } from '@/constants/config'
import { useCallback, useRef, useState } from 'react'

interface UseTimerReturn {
  time: number
  isRunning: boolean
  start: () => void
  stop: () => number
  reset: () => void
}

export function useTimer(): UseTimerReturn {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const startTimeRef = useRef<number>(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    if (isRunning) return

    setIsRunning(true)
    startTimeRef.current = Date.now()

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      setTime(elapsed)
    }, CONFIG.TIMER_INTERVAL)
  }, [isRunning])

  const stop = useCallback((): number => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    const finalTime = (Date.now() - startTimeRef.current) / 1000
    setTime(finalTime)
    setIsRunning(false)

    return finalTime
  }, [])

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setTime(0)
    setIsRunning(false)
  }, [])

  return { time, isRunning, start, stop, reset }
}
