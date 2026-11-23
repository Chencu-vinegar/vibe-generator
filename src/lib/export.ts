import type { Vibe } from '../types'
import { withAlpha } from './color'
import { mulberry32 } from './random'

const WIDTH = 1080
const HEIGHT = 1440
const MARGIN = 84

const SANS = '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif'
const SERIF = '"Noto Serif SC", "STSong", "Songti SC", "SimSun", serif'
const MONO = '"SFMono-Regular", Consolas, "Liberation Mono", monospace'

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2)
  context.beginPath()
  context.moveTo(x + r, y)
  context.arcTo(x + width, y, x + width, y + height, r)
  context.arcTo(x + width, y + height, x, y + height, r)
  context.arcTo(x, y + height, x, y, r)
  context.arcTo(x, y, x + width, y, r)
  context.closePath()
}

function trackedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
) {
  let cursor = x
  for (const character of Array.from(text)) {
    context.fillText(character, cursor, y)
    cursor += context.measureText(character).width + tracking
  }
}

function wrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3,
): number {
  const characters = Array.from(text)
  const lines: string[] = []
  let line = ''

  for (const character of characters) {
    const next = line + character
    if (context.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = character
    } else {
      line = next
    }
  }
  if (line) lines.push(line)

  const visible = lines.slice(0, maxLines)
  if (lines.length > maxLines) {
    const last = visible[maxLines - 1]
    visible[maxLines - 1] = `${last.slice(0, Math.max(0, last.length - 1))}…`
  }

  visible.forEach((visibleLine, index) => {
    context.fillText(visibleLine, x, y + index * lineHeight)
  })

  return y + visible.length * lineHeight
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} / ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`
}

export async function downloadVibePoster(vibe: Vibe): Promise<void> {
  await document.fonts?.ready.catch(() => undefined)

  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is not available in this browser.')

  const ink = vibe.palette.colors[4].hex
  const background = vibe.palette.colors[0].hex
  const mid = vibe.palette.colors[1].hex
  const accent = vibe.palette.accent
  const isDark = vibe.palette.mode === 'dark'

  context.textBaseline = 'top'
  context.textAlign = 'left'

  const gradient = context.createLinearGradient(0, 0, WIDTH, HEIGHT)
  gradient.addColorStop(0, background)
  gradient.addColorStop(1, mid)
  context.fillStyle = gradient
  context.fillRect(0, 0, WIDTH, HEIGHT)

  const glowOne = context.createRadialGradient(
    (vibe.gradient.x1 / 100) * WIDTH,
    (vibe.gradient.y1 / 100) * HEIGHT,
    0,
    (vibe.gradient.x1 / 100) * WIDTH,
    (vibe.gradient.y1 / 100) * HEIGHT,
    600,
  )
  glowOne.addColorStop(0, withAlpha(accent, isDark ? 0.42 : 0.24))
  glowOne.addColorStop(0.55, withAlpha(accent, isDark ? 0.12 : 0.06))
  glowOne.addColorStop(1, withAlpha(accent, 0))
  context.fillStyle = glowOne
  context.fillRect(0, 0, WIDTH, HEIGHT)

  const glowTwo = context.createRadialGradient(
    (vibe.gradient.x2 / 100) * WIDTH,
    (vibe.gradient.y2 / 100) * HEIGHT,
    0,
    (vibe.gradient.x2 / 100) * WIDTH,
    (vibe.gradient.y2 / 100) * HEIGHT,
    520,
  )
  glowTwo.addColorStop(0, withAlpha(vibe.palette.colors[2].hex, isDark ? 0.36 : 0.18))
  glowTwo.addColorStop(1, withAlpha(vibe.palette.colors[2].hex, 0))
  context.fillStyle = glowTwo
  context.fillRect(0, 0, WIDTH, HEIGHT)

  const grain = mulberry32(vibe.seed * 97)
  context.fillStyle = withAlpha(ink, 0.035)
  for (let index = 0; index < 5200; index += 1) {
    const size = grain() > 0.94 ? 2 : 1
    context.fillRect(grain() * WIDTH, grain() * HEIGHT, size, size)
  }

  context.strokeStyle = withAlpha(ink, 0.2)
  context.lineWidth = 1
  context.strokeRect(48.5, 48.5, WIDTH - 97, HEIGHT - 97)

  context.fillStyle = withAlpha(ink, 0.8)
  context.font = `500 17px ${SANS}`
  trackedText(context, 'VIBE / 今日氛围', MARGIN, 90, 4)
  const topRight = `NO. ${vibe.number}`
  context.font = `500 17px ${MONO}`
  context.textAlign = 'right'
  context.fillText(topRight, WIDTH - MARGIN, 90)
  context.textAlign = 'left'

  context.strokeStyle = withAlpha(ink, 0.22)
  context.beginPath()
  context.moveTo(MARGIN, 132)
  context.lineTo(WIDTH - MARGIN, 132)
  context.stroke()

  context.strokeStyle = withAlpha(accent, 0.35)
  context.lineWidth = 1.5
  context.beginPath()
  context.arc(WIDTH - 208, 320, 112, 0, Math.PI * 1.45)
  context.stroke()

  context.fillStyle = accent
  context.font = `600 18px ${SANS}`
  trackedText(context, vibe.kicker, MARGIN, 196, 5)

  context.fillStyle = ink
  context.font = `400 92px ${SERIF}`
  const titleLines = vibe.title.split('\n')
  titleLines.forEach((line, index) => {
    context.fillText(line, MARGIN, 286 + index * 118)
  })

  const titleBottom = 286 + titleLines.length * 118
  context.fillStyle = withAlpha(ink, 0.82)
  context.font = `400 30px ${SANS}`
  const lineBottom = wrappedText(
    context,
    vibe.line,
    MARGIN,
    titleBottom + 38,
    WIDTH - MARGIN * 2 - 36,
    48,
    3,
  )

  context.fillStyle = withAlpha(ink, 0.55)
  context.font = `400 19px ${SANS}`
  context.fillText(vibe.signature, MARGIN, lineBottom + 24)

  let keywordX = MARGIN
  const keywordY = 804
  context.font = `500 16px ${SANS}`
  vibe.keywords.forEach((keyword) => {
    const labelWidth = context.measureText(keyword.label).width
    context.fillStyle = withAlpha(keyword.color, 0.9)
    context.beginPath()
    context.arc(keywordX + 5, keywordY + 9, 4, 0, Math.PI * 2)
    context.fill()
    context.fillStyle = withAlpha(ink, 0.7)
    context.fillText(keyword.label, keywordX + 18, keywordY)
    keywordX += labelWidth + 48
  })

  context.strokeStyle = withAlpha(ink, 0.18)
  context.beginPath()
  context.moveTo(MARGIN, 884)
  context.lineTo(WIDTH - MARGIN, 884)
  context.stroke()

  context.fillStyle = withAlpha(ink, 0.5)
  context.font = `500 15px ${SANS}`
  trackedText(context, 'COLOR ARCHIVE / 今日色板', MARGIN, 916, 2)

  const gap = 10
  const swatchWidth = (WIDTH - MARGIN * 2 - gap * 4) / 5
  vibe.palette.colors.forEach((color, index) => {
    const x = MARGIN + index * (swatchWidth + gap)
    roundedRect(context, x, 958, swatchWidth, 124, 4)
    context.fillStyle = color.hex
    context.fill()

    context.fillStyle = withAlpha(ink, 0.8)
    context.font = `500 17px ${SANS}`
    context.fillText(color.name, x, 1101)

    context.fillStyle = withAlpha(ink, 0.42)
    context.font = `400 13px ${MONO}`
    context.fillText(color.hex.toUpperCase(), x, 1130)
  })

  context.strokeStyle = withAlpha(ink, 0.18)
  context.beginPath()
  context.moveTo(MARGIN, 1182)
  context.lineTo(WIDTH - MARGIN, 1182)
  context.stroke()

  context.fillStyle = withAlpha(ink, 0.48)
  context.font = `500 14px ${SANS}`
  trackedText(context, 'LISTENING NOTE', MARGIN, 1214, 2)

  context.fillStyle = ink
  context.font = `500 29px ${SANS}`
  context.fillText(vibe.listening.genre, MARGIN, 1244)

  context.fillStyle = withAlpha(ink, 0.62)
  context.font = `400 18px ${SANS}`
  context.fillText(vibe.listening.bpm, MARGIN, 1288)

  context.textAlign = 'right'
  context.fillStyle = withAlpha(ink, 0.58)
  context.font = `400 16px ${SANS}`
  context.fillText(vibe.listening.textures.join('  ·  '), WIDTH - MARGIN, 1252)
  context.fillText(vibe.listening.note, WIDTH - MARGIN, 1282)
  context.textAlign = 'left'

  context.fillStyle = withAlpha(ink, 0.5)
  context.font = `400 16px ${SANS}`
  context.fillText(vibe.listening.scene, MARGIN, 1318)

  context.strokeStyle = withAlpha(ink, 0.18)
  context.beginPath()
  context.moveTo(MARGIN, 1350)
  context.lineTo(WIDTH - MARGIN, 1350)
  context.stroke()

  context.fillStyle = withAlpha(ink, 0.42)
  context.font = `400 13px ${MONO}`
  context.fillText(formatDate(vibe.createdAt), MARGIN, 1366)
  context.textAlign = 'right'
  context.fillText(`SEED ${vibe.seed} / LOCAL ARCHIVE`, WIDTH - MARGIN, 1366)
  context.textAlign = 'left'

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), 'image/png')
  })
  if (!blob) throw new Error('Could not create the poster image.')

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const date = new Date(vibe.createdAt)
  const pad = (value: number) => String(value).padStart(2, '0')
  anchor.href = url
  anchor.download = `vibe-${vibe.number}-${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(
    date.getDate(),
  )}.png`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1500)
}
