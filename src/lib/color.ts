interface Rgb {
  r: number
  g: number
  b: number
}

function parseHex(hex: string): Rgb {
  const value = hex.replace('#', '')
  const normalized =
    value.length === 3
      ? value
          .split('')
          .map((char) => char + char)
          .join('')
      : value.padEnd(6, '0').slice(0, 6)

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

function toHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b]
    .map((channel) => Math.round(Math.min(255, Math.max(0, channel))).toString(16).padStart(2, '0'))
    .join('')}`
}

function rgbToHsl({ r, g, b }: Rgb): { h: number; s: number; l: number } {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const lightness = (max + min) / 2
  const delta = max - min

  if (delta === 0) {
    return { h: 0, s: 0, l: lightness }
  }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1))
  let hue = 0

  if (max === red) {
    hue = ((green - blue) / delta) % 6
  } else if (max === green) {
    hue = (blue - red) / delta + 2
  } else {
    hue = (red - green) / delta + 4
  }

  hue *= 60
  if (hue < 0) hue += 360

  return { h: hue, s: saturation, l: lightness }
}

function hslToRgb({ h, s, l }: { h: number; s: number; l: number }): Rgb {
  const chroma = (1 - Math.abs(2 * l - 1)) * s
  const section = ((h % 360) + 360) % 360 / 60
  const x = chroma * (1 - Math.abs((section % 2) - 1))
  let red = 0
  let green = 0
  let blue = 0

  if (section >= 0 && section < 1) {
    red = chroma
    green = x
  } else if (section < 2) {
    red = x
    green = chroma
  } else if (section < 3) {
    green = chroma
    blue = x
  } else if (section < 4) {
    green = x
    blue = chroma
  } else if (section < 5) {
    red = x
    blue = chroma
  } else {
    red = chroma
    blue = x
  }

  const match = l - chroma / 2
  return {
    r: (red + match) * 255,
    g: (green + match) * 255,
    b: (blue + match) * 255,
  }
}

export function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = parseHex(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHex(hex)
  const channels = [r, g, b].map((channel) => {
    const normalized = channel / 255
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

export function textOn(hex: string): string {
  return relativeLuminance(hex) > 0.45 ? '#171717' : '#f8f4ea'
}

/** Adjust a hex color in HSL space while keeping it inside a usable range. */
export function adjustHex(
  hex: string,
  options: { hue?: number; saturation?: number; lightness?: number } = {},
): string {
  const hsl = rgbToHsl(parseHex(hex))
  return toHex(
    hslToRgb({
      h: (hsl.h + (options.hue ?? 0) + 360) % 360,
      s: Math.min(1, Math.max(0, hsl.s + (options.saturation ?? 0))),
      l: Math.min(0.94, Math.max(0.06, hsl.l + (options.lightness ?? 0))),
    }),
  )
}
