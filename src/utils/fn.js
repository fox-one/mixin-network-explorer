const FormatTs = function (ts) {
  let now = Date.now() * 1000000
  return ((now - ts)/1000000000).toFixed(3) + 's'
}
const CacheLevel = function (ts) {
  const now = Date.now() * 1000000
  const diff = ((now - ts)/1000000000)
  if (diff > 30 * 60) {
    return 'level-2'
  } else if (diff > 10 * 60) {
    return 'level-1'
  }
  return 'level-0'
}

export default {
  FormatTs,
  CacheLevel
}
