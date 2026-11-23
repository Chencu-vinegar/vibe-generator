const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function formatToday(date = new Date()): string {
  return `${date.getMonth() + 1}月${date.getDate()}日 · ${WEEKDAYS[date.getDay()]}`
}

export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp)
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())} · ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`
}

export function formatArchiveTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`

  if (isSameDay(date, now)) return `今天 ${time}`

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (isSameDay(date, yesterday)) return `昨天 ${time}`

  return `${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${time}`
}
