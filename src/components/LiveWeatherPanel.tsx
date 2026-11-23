import { useEffect, useState } from 'react'
import { WEATHERS, WEATHER_MAP } from '../data/vibes'
import { useLiveWeather } from '../hooks/useLiveWeather'
import type { WeatherId } from '../types'
import { formatClock } from '../lib/format'
import { RefreshIcon, WeatherIcon } from './Icons'

interface LiveWeatherPanelProps {
  selectedWeather: WeatherId
  onWeatherChange: (weather: WeatherId) => void
}

export function LiveWeatherPanel({
  selectedWeather,
  onWeatherChange,
}: LiveWeatherPanelProps) {
  const { state, refresh } = useLiveWeather()
  const [mode, setMode] = useState<'auto' | 'manual'>('auto')
  const [manualOpen, setManualOpen] = useState(false)
  const snapshot = state.data
  const loading = state.status === 'loading'
  const iconKind = snapshot?.weather ?? selectedWeather
  const sourceLabel = snapshot?.source === 'ip' ? '网络位置' : '已定位'

  useEffect(() => {
    if (mode !== 'auto' || !snapshot) return
    if (selectedWeather !== snapshot.weather) {
      onWeatherChange(snapshot.weather)
    }
  }, [mode, onWeatherChange, selectedWeather, snapshot])

  useEffect(() => {
    if (state.status === 'error' && !state.data) {
      setManualOpen(true)
    }
  }, [state.data, state.status])

  const handleManualToggle = () => {
    if (manualOpen) {
      setManualOpen(false)
      return
    }
    if (mode === 'auto') setMode('manual')
    setManualOpen(true)
  }

  const handleUseLive = () => {
    setMode('auto')
    setManualOpen(false)
    if (snapshot) {
      onWeatherChange(snapshot.weather)
    } else {
      refresh()
    }
  }

  const handleWeatherChange = (weather: WeatherId) => {
    setMode('manual')
    onWeatherChange(weather)
  }

  const providerUrl =
    snapshot?.provider === 'Open-Meteo' ? 'https://open-meteo.com/' : 'https://wttr.in/'
  const providerLabel = snapshot?.provider === 'Open-Meteo' ? 'Open-Meteo' : 'wttr.in'

  return (
    <div className="live-weather" aria-live="polite">
      <div className="live-weather__main">
        <span className="live-weather__icon" aria-hidden="true">
          <WeatherIcon kind={iconKind} size={25} />
        </span>

        <div className="live-weather__reading">
          <div className="live-weather__temperature">
            <strong>{snapshot ? `${snapshot.temperature}°` : '—'}</strong>
            <span>
              {snapshot
                ? snapshot.condition
                : loading
                  ? '正在读取天气'
                  : '实时天气不可用'}
            </span>
          </div>
          <p className="live-weather__meta">
            {snapshot ? (
              <>
                <span className="live-weather__pulse" />
                {snapshot.location} · 体感 {snapshot.feelsLike}° · {sourceLabel}
                <span className="live-weather__time">{formatClock(snapshot.updatedAt)}</span>
              </>
            ) : loading ? (
              '正在获取你所在位置的天气…'
            ) : (
              state.message
            )}
          </p>
        </div>

        <button
          className="live-weather__refresh"
          type="button"
          onClick={refresh}
          disabled={loading}
          aria-label="刷新实时天气"
          title="刷新实时天气"
        >
          <RefreshIcon size={14} />
          {loading ? '定位中' : '刷新'}
        </button>
      </div>

      {state.status === 'error' && snapshot && (
        <p className="live-weather__warning">更新失败，暂时显示上一次的天气。</p>
      )}

      {mode === 'manual' && (
        <div className="live-weather__manual-tag">
          <span>手动天气 · {WEATHER_MAP[selectedWeather].label}</span>
          <button type="button" onClick={handleUseLive}>
            恢复实时
          </button>
        </div>
      )}

      {manualOpen && (
        <div className="live-weather__manual">
          <div className="weather-grid">
            {WEATHERS.map((weather) => {
              const selected = selectedWeather === weather.id
              return (
                <button
                  className={`weather-option ${selected ? 'is-selected' : ''}`}
                  type="button"
                  key={weather.id}
                  aria-pressed={selected}
                  onClick={() => handleWeatherChange(weather.id)}
                >
                  <WeatherIcon kind={weather.icon} size={19} />
                  <span>{weather.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="live-weather__foot">
        <span className="live-weather__privacy">定位只用于本次天气查询，坐标不会保存</span>
        <div className="live-weather__links">
          {snapshot && (
            <a href={providerUrl} target="_blank" rel="noreferrer">
              {providerLabel}
            </a>
          )}
          <button type="button" onClick={handleManualToggle}>
            {manualOpen ? '收起手动选择' : '手动调整'}
          </button>
        </div>
      </div>
    </div>
  )
}
