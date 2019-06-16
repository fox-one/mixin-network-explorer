import http from './http/mixin'

export default {
  getAssets(params={}) {
    return http.get('/assets', params)
  },
  getAsset(id, params={}) {
    return http.get(`/assets/${id}`, params)
  },
  getAssetAddresses(id, params={}) {
    return http.get(`/assets/${id}/addresses`, { params })
  },
  getSnapshots(params={}) {
    return http.get('/snapshots', { params })
  },
  getSnapshot(id, params={}) {
    return http.get(`/network/snapshots/${id}`, { params }).then(res => {
      const snapshot = {
        amount: res.amount,
        symbol: res.asset.symbol,
        memo: res.data,
        created_at: res.created_at,
        snapshot_id: res.snapshot_id,
        source: res.source,
        opponent_id: res.opponent_id,
        user_id: res.user_id
      }
      return Object.keys(snapshot).map(k => ({ key: k, value: snapshot[k] }))
    })
  }
}