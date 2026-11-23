import type {
  WeatherId,
  WeatherProvider,
  WeatherSnapshot,
  WeatherSource,
} from '../types'

interface Coordinates {
  latitude: number
  longitude: number
  source: WeatherSource
}

interface WeatherReading {
  weather: WeatherId
  condition: string
  temperature: number
  feelsLike: number
  isDay: boolean
  provider: WeatherProvider
  fallbackLocation?: string
  nearestCoordinates?: {
    latitude: number
    longitude: number
  }
}

const WWO_CONDITIONS: Record<number, { label: string; weather: WeatherId }> = {
  113: { label: '晴', weather: 'clear' },
  116: { label: '晴间多云', weather: 'clear' },
  119: { label: '多云', weather: 'mist' },
  122: { label: '阴', weather: 'mist' },
  143: { label: '薄雾', weather: 'mist' },
  149: { label: '烟霾', weather: 'mist' },
  176: { label: '局部有雨', weather: 'rain' },
  179: { label: '局部有雪', weather: 'snow' },
  182: { label: '局部雨夹雪', weather: 'rain' },
  185: { label: '冻毛毛雨', weather: 'rain' },
  200: { label: '可能有雷暴', weather: 'rain' },
  227: { label: '吹雪', weather: 'snow' },
  230: { label: '暴风雪', weather: 'snow' },
  248: { label: '雾', weather: 'mist' },
  260: { label: '冻雾', weather: 'mist' },
  263: { label: '零星毛毛雨', weather: 'rain' },
  266: { label: '毛毛雨', weather: 'rain' },
  281: { label: '冻毛毛雨', weather: 'rain' },
  284: { label: '强冻毛毛雨', weather: 'rain' },
  293: { label: '零星小雨', weather: 'rain' },
  296: { label: '小雨', weather: 'rain' },
  299: { label: '间歇中雨', weather: 'rain' },
  302: { label: '中雨', weather: 'rain' },
  305: { label: '间歇大雨', weather: 'rain' },
  308: { label: '大雨', weather: 'rain' },
  311: { label: '冻雨', weather: 'rain' },
  314: { label: '强冻雨', weather: 'rain' },
  317: { label: '雨夹雪', weather: 'snow' },
  320: { label: '强雨夹雪', weather: 'snow' },
  323: { label: '零星小雪', weather: 'snow' },
  326: { label: '小雪', weather: 'snow' },
  329: { label: '局部中雪', weather: 'snow' },
  332: { label: '中雪', weather: 'snow' },
  335: { label: '局部大雪', weather: 'snow' },
  338: { label: '大雪', weather: 'snow' },
  350: { label: '冰粒', weather: 'snow' },
  353: { label: '小阵雨', weather: 'rain' },
  356: { label: '中到大阵雨', weather: 'rain' },
  359: { label: '暴雨', weather: 'rain' },
  362: { label: '小阵雨夹雪', weather: 'snow' },
  365: { label: '强阵雨夹雪', weather: 'snow' },
  368: { label: '小阵雪', weather: 'snow' },
  371: { label: '中到大阵雪', weather: 'snow' },
  374: { label: '小冰粒阵', weather: 'snow' },
  377: { label: '中到大冰粒阵', weather: 'snow' },
  386: { label: '局部雷阵雨', weather: 'rain' },
  389: { label: '强雷阵雨', weather: 'rain' },
  392: { label: '雷阵雪', weather: 'snow' },
  395: { label: '强雷阵雪', weather: 'snow' },
}

const WMO_CONDITIONS: Record<number, { label: string; weather: WeatherId }> = {
  0: { label: '晴', weather: 'clear' },
  1: { label: '大部晴朗', weather: 'clear' },
  2: { label: '多云', weather: 'clear' },
  3: { label: '阴', weather: 'mist' },
  45: { label: '雾', weather: 'mist' },
  48: { label: '雾凇', weather: 'mist' },
  51: { label: '小毛毛雨', weather: 'rain' },
  53: { label: '毛毛雨', weather: 'rain' },
  55: { label: '强毛毛雨', weather: 'rain' },
  56: { label: '冻毛毛雨', weather: 'rain' },
  57: { label: '强冻毛毛雨', weather: 'rain' },
  61: { label: '小雨', weather: 'rain' },
  63: { label: '中雨', weather: 'rain' },
  65: { label: '大雨', weather: 'rain' },
  66: { label: '冻雨', weather: 'rain' },
  67: { label: '强冻雨', weather: 'rain' },
  71: { label: '小雪', weather: 'snow' },
  73: { label: '中雪', weather: 'snow' },
  75: { label: '大雪', weather: 'snow' },
  77: { label: '米雪', weather: 'snow' },
  80: { label: '小阵雨', weather: 'rain' },
  81: { label: '中阵雨', weather: 'rain' },
  82: { label: '强阵雨', weather: 'rain' },
  85: { label: '小阵雪', weather: 'snow' },
  86: { label: '强阵雪', weather: 'snow' },
  95: { label: '雷暴', weather: 'rain' },
  96: { label: '雷暴伴冰雹', weather: 'rain' },
  99: { label: '强雷暴伴冰雹', weather: 'rain' },
}

interface WttrResponse {
  current_condition?: Array<{
    temp_C?: string
    FeelsLikeC?: string
    weatherCode?: string
    weatherDesc?: Array<{ value?: string }>
  }>
  weather?: Array<{
    astronomy?: Array<{ sunrise?: string; sunset?: string }>
  }>
  nearest_area?: Array<{
    areaName?: Array<{ value?: string }>
    region?: Array<{ value?: string }>
    latitude?: string
    longitude?: string
  }>
}

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number
    apparent_temperature?: number
    weather_code?: number
    is_day?: number
  }
}

interface BigDataCloudResponse {
  city?: string
  locality?: string
  principalSubdivision?: string
}

function abortError(): DOMException {
  return new DOMException('The request was aborted.', 'AbortError')
}

async function fetchJson<T>(
  url: string,
  timeoutMs: number,
  signal?: AbortSignal,
): Promise<T> {
  if (signal?.aborted) throw abortError()

  const controller = new AbortController()
  let timedOut = false
  const timer = window.setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)
  const handleAbort = () => controller.abort()

  signal?.addEventListener('abort', handleAbort, { once: true })

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) throw new Error(`Weather request failed: ${response.status}`)

    return (await response.json()) as T
  } catch (error) {
    if (timedOut) throw new Error('Weather request timed out.')
    throw error
  } finally {
    window.clearTimeout(timer)
    signal?.removeEventListener('abort', handleAbort)
  }
}

function parseClock(value: string | undefined): number | null {
  if (!value) return null
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return null

  let hour = Number(match[1]) % 12
  if (match[3].toUpperCase() === 'PM') hour += 12
  return hour * 60 + Number(match[2])
}

function isDaytime(sunrise?: string, sunset?: string): boolean {
  const now = new Date()
  const current = now.getHours() * 60 + now.getMinutes()
  const sunriseMinutes = parseClock(sunrise)
  const sunsetMinutes = parseClock(sunset)

  if (sunriseMinutes !== null && sunsetMinutes !== null) {
    return current >= sunriseMinutes && current < sunsetMinutes
  }

  return current >= 6 * 60 && current < 18 * 60
}

function applyNight(weather: WeatherId, isDay: boolean): WeatherId {
  if (!isDay && (weather === 'clear' || weather === 'mist')) return 'night'
  return weather
}

function numberFrom(value: string | number | undefined): number | null {
  const parsed = typeof value === 'number' ? value : Number.parseFloat(value ?? '')
  return Number.isFinite(parsed) ? Math.round(parsed) : null
}

function uniqueLocation(parts: Array<string | undefined>): string {
  return [...new Set(parts.filter((part): part is string => Boolean(part?.trim())))].join(' · ')
}

function browserCoordinates(signal?: AbortSignal): Promise<Coordinates | null> {
  if (!('geolocation' in navigator)) return Promise.resolve(null)

  return new Promise((resolve) => {
    let settled = false
    const finish = (value: Coordinates | null) => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      signal?.removeEventListener('abort', handleAbort)
      resolve(value)
    }
    const handleAbort = () => finish(null)
    const timer = window.setTimeout(() => finish(null), 8500)

    if (signal?.aborted) {
      finish(null)
      return
    }

    signal?.addEventListener('abort', handleAbort, { once: true })

    navigator.geolocation.getCurrentPosition(
      (position) => {
        finish({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          source: 'geo',
        })
      },
      () => finish(null),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 },
    )
  })
}

async function reverseLocation(
  coordinates: Coordinates,
  signal?: AbortSignal,
): Promise<string> {
  try {
    const data = await fetchJson<BigDataCloudResponse>(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&localityLanguage=zh-Hans`,
      4500,
      signal,
    )

    const primary = data.city || data.principalSubdivision
    return uniqueLocation([primary, data.locality])
  } catch {
    return ''
  }
}

async function fetchWttr(
  coordinates: Coordinates | null,
  signal?: AbortSignal,
): Promise<WeatherReading> {
  const query = coordinates
    ? `${coordinates.latitude.toFixed(4)},${coordinates.longitude.toFixed(4)}`
    : ''
  const data = await fetchJson<WttrResponse>(
    `https://wttr.in/${query}?format=j1&lang=zh`,
    8000,
    signal,
  )
  const current = data.current_condition?.[0]
  const code = Number.parseInt(current?.weatherCode ?? '', 10)
  const mapped = Number.isFinite(code) ? WWO_CONDITIONS[code] : undefined
  const temperature = numberFrom(current?.temp_C)

  if (!current || temperature === null) {
    throw new Error('The weather service returned an empty reading.')
  }

  const isDay = isDaytime(
    data.weather?.[0]?.astronomy?.[0]?.sunrise,
    data.weather?.[0]?.astronomy?.[0]?.sunset,
  )
  const weather = applyNight(mapped?.weather ?? 'mist', isDay)
  const fallbackLocation = [data.nearest_area?.[0]?.areaName?.[0]?.value]
    .filter(Boolean)
    .join('')
  const nearestLatitude = Number.parseFloat(data.nearest_area?.[0]?.latitude ?? '')
  const nearestLongitude = Number.parseFloat(data.nearest_area?.[0]?.longitude ?? '')
  const nearestCoordinates =
    Number.isFinite(nearestLatitude) && Number.isFinite(nearestLongitude)
      ? { latitude: nearestLatitude, longitude: nearestLongitude }
      : undefined

  return {
    weather,
    condition: mapped?.label ?? current.weatherDesc?.[0]?.value ?? '天气变化中',
    temperature,
    feelsLike: numberFrom(current.FeelsLikeC) ?? temperature,
    isDay,
    provider: 'wttr.in',
    fallbackLocation,
    nearestCoordinates,
  }
}

async function fetchOpenMeteo(
  coordinates: Coordinates,
  signal?: AbortSignal,
): Promise<WeatherReading> {
  const data = await fetchJson<OpenMeteoResponse>(
    `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current=temperature_2m,apparent_temperature,weather_code,is_day&timezone=auto`,
    5000,
    signal,
  )
  const current = data.current
  const temperature = numberFrom(current?.temperature_2m)

  if (!current || temperature === null) {
    throw new Error('The backup weather service returned an empty reading.')
  }

  const code = current.weather_code ?? -1
  const mapped = WMO_CONDITIONS[code]
  const isDay = current.is_day !== 0
  const weather = applyNight(mapped?.weather ?? 'mist', isDay)

  return {
    weather,
    condition: mapped?.label ?? '天气变化中',
    temperature,
    feelsLike: numberFrom(current.apparent_temperature) ?? temperature,
    isDay,
    provider: 'Open-Meteo',
  }
}

async function fetchReading(
  coordinates: Coordinates,
  signal?: AbortSignal,
): Promise<WeatherReading> {
  try {
    return await fetchWttr(coordinates, signal)
  } catch (primaryError) {
    if (signal?.aborted) throw primaryError
    try {
      return await fetchOpenMeteo(coordinates, signal)
    } catch {
      throw new Error('天气服务暂时没有响应，可以先手动选择天气。')
    }
  }
}

export async function fetchLiveWeather(
  signal?: AbortSignal,
): Promise<WeatherSnapshot> {
  const fromBrowser = await browserCoordinates(signal)
  if (signal?.aborted) throw abortError()

  let reading: WeatherReading
  let coordinates: Coordinates | null = fromBrowser
  let source: WeatherSource

  if (fromBrowser) {
    source = 'geo'
    reading = await fetchReading(fromBrowser, signal)
  } else {
    source = 'ip'
    try {
      // wttr.in resolves the request's network location when no coordinates are given.
      reading = await fetchWttr(null, signal)
    } catch {
      throw new Error('没能获取你所在的位置。请允许定位，或手动选择天气。')
    }

    if (reading.nearestCoordinates) {
      coordinates = { ...reading.nearestCoordinates, source: 'ip' }
    }
  }

  if (signal?.aborted) throw abortError()

  const reverseName = coordinates ? await reverseLocation(coordinates, signal) : ''
  if (signal?.aborted) throw abortError()

  const location =
    reverseName ||
    reading.fallbackLocation ||
    (source === 'ip' ? '网络位置' : '当前位置')

  return {
    weather: reading.weather,
    condition: reading.condition,
    temperature: reading.temperature,
    feelsLike: reading.feelsLike,
    isDay: reading.isDay,
    location,
    source,
    provider: reading.provider,
    updatedAt: Date.now(),
  }
}
