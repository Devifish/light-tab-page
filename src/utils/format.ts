export const SECOND = 1000,
  MIN = 60 * SECOND,
  HOUR = 60 * MIN,
  DAY = 24 * HOUR,
  MONTH = 30 * DAY,
  YEAR = 365 * DAY

export const toPixel = (px: string | number | undefined) => `${px ?? 0}px`
export const toPercent = (percent: number | undefined) => `${Math.round((percent ?? 0) * 100)}%`

export function timediff(source: number, target: number = Date.now()) {
  const diff = target - source

  if (diff < SECOND) {
    return "刚刚"
  } else if (diff < MIN) {
    return `${Math.floor(diff / SECOND)}秒前`
  } else if (diff < HOUR) {
    return `${Math.floor(diff / MIN)}分钟前`
  } else if (diff < DAY) {
    return `${Math.floor(diff / HOUR)}小时前`
  } else if (diff < MONTH) {
    return `${Math.floor(diff / DAY)}天前`
  } else if (diff < YEAR) {
    return `${Math.floor(diff / MONTH)}月前`
  } else {
    return `${Math.floor(diff / YEAR)}年前`
  }
}
