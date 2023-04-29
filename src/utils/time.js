// 获取时间
function dateFormat(date) {
  const dt = new Date(date)
  const y = dt.getFullYear()
  const m = padZone(dt.getMonth() + 1)
  const d = padZone(dt.getDate())

  const hh = padZone(dt.getHours())
  const mm = padZone(dt.getMinutes())
  const ss = padZone(dt.getSeconds())
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}
// 补零函数
function padZone(n) {
  return n > 9 ? n : '0' + n
}
export { dateFormat }
