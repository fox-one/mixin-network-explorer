const FormatTs = function (ts) {
  let now = Date.now() * 1000000
  return ((now - ts)/1000000000).toFixed(0) + 'ms'
}
export default {
  FormatTs
}
