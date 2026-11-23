import { useCallback, useEffect, useState } from 'react'
import type { WeatherSnapshot } from '../types'
import { fetchLiveWeather } from '../lib/weather'

export interface LiveWeatherState {
  status: 'loading' | 'ready' | 'error'
  data: WeatherSnapshot | null
  message?: string
}

const REFRESH_INTERVAL = 15 * 60 * 1000

export function useLiveWeather() {
  const [state, setState] = useState<LiveWeatherState>({
    status: 'loading',
    data: null,
  })
  const [requestKey, setRequestKey] = useState(0)

  const refresh = useCallback(() => {
    setRequestKey((key) => key + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    setState((previous) => ({
      status: 'loading',
      data: previous.data,
      message: undefined,
    }))

    fetchLiveWeather(controller.signal)
      .then((data) => {
        if (active) setState({ status: 'ready', data })
      })
      .catch((error: unknown) => {
        if (!active || controller.signal.aborted) return
        setState((previous) => ({
          status: 'error',
          data: previous.data,
          message:
            error instanceof Error
              ? error.message
              : '实时天气暂时不可用，可以先手动选择。',
        }))
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [requestKey])

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!document.hidden) {
        setRequestKey((key) => key + 1)
      }
    }, REFRESH_INTERVAL)

    return () => window.clearInterval(timer)
  }, [])

  return { state, refresh }
}
