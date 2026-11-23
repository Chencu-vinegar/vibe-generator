import type { SVGProps } from 'react'
import type { WeatherOption } from '../types'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function baseProps({ size = 18, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...props,
  }
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

export function ArrowLeft(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  )
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 3v4M12 17v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M3 12h4M17 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function HistoryIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 5v5h5" />
      <path d="M4.8 10a7.5 7.5 0 1 1 1.2 7" />
      <path d="M12 8v4.5l3 1.7" />
    </svg>
  )
}

export function ShareIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="6" cy="12" r="2.3" />
      <circle cx="18" cy="6" r="2.3" />
      <circle cx="18" cy="18" r="2.3" />
      <path d="m8.2 10.9 7.6-3.8M8.2 13.1l7.6 3.8" />
    </svg>
  )
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 3v11M8 10l4 4 4-4M5 20h14" />
    </svg>
  )
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M20 7v5h-5" />
      <path d="M4 17v-5h5" />
      <path d="M6.1 8.2A7 7 0 0 1 18.8 10M17.9 15.8A7 7 0 0 1 5.2 14" />
    </svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
    </svg>
  )
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <rect x="8" y="8" width="11" height="11" rx="1.5" />
      <path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" />
    </svg>
  )
}

export function WeatherIcon({
  kind,
  size = 22,
  ...props
}: IconProps & { kind: WeatherOption['icon'] }) {
  const shared = { ...baseProps({ ...props, size }), strokeWidth: 1.45 }

  if (kind === 'clear') {
    return (
      <svg {...shared}>
        <circle cx="12" cy="12" r="3.6" />
        <path d="M12 2.8v2.1M12 19.1v2.1M2.8 12h2.1M19.1 12h2.1M5.5 5.5l1.5 1.5M17 17l1.5 1.5M18.5 5.5 17 7M7 17l-1.5 1.5" />
      </svg>
    )
  }

  if (kind === 'rain') {
    return (
      <svg {...shared}>
        <path d="M6.3 15.2h10.5a3.4 3.4 0 0 0 .4-6.8 5.2 5.2 0 0 0-10-1.2 4.1 4.1 0 0 0-.9 8Z" />
        <path d="m8 18-1 2M12.5 18l-1 2M17 18l-1 2" />
      </svg>
    )
  }

  if (kind === 'mist') {
    return (
      <svg {...shared}>
        <path d="M4 8.5h11.5a3 3 0 1 0-2.8-4" />
        <path d="M4 12.5h16M6 16.5h12M9 20.5h9" />
      </svg>
    )
  }

  if (kind === 'snow') {
    return (
      <svg {...shared}>
        <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M9.2 5.2 12 8l2.8-2.8M9.2 18.8 12 16l2.8 2.8M4.8 10.8l3.9 1-1 3.9M19.2 13.2l-3.9-1 1-3.9" />
      </svg>
    )
  }

  return (
    <svg {...shared}>
      <path d="M20.4 14.2A8.5 8.5 0 0 1 9.8 3.6a8.5 8.5 0 1 0 10.6 10.6Z" />
      <path d="M17.2 3.5v2M21.8 8h-2" />
    </svg>
  )
}
