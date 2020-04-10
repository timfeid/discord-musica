export function randomNum(low: number, high: number) {
  return Math.floor(Math.random() * (high - low + 1) + low)
}