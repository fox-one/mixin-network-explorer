<template>
  <div class="container">
    <van-nav-bar
      title="Node Detail"
      left-text="Back"
      left-arrow
      @click-left="back"
    />
    <section class="content">
      <node :data="node" @click-item="openNodeDetail(node)"></node>

      <div class="console">
        <div v-if="StatData" class="techie-details">
          <div class="row">
            <div class="label">Node:</div>
            <div class="value">{{StatData ? StatData.node : '??'}}</div>
          </div>
          <div class="row">
            <div class="label">Network:</div>
            <div class="value">{{StatData ? StatData.network : '??'}}</div>
          </div>
          <div class="row">
            <div class="label">Topology:</div>
            <div class="value">{{StatData ? StatData.graph.topology : '??'}}</div>
          </div>
          <div class="row">
            <div class="label">Cache Items</div>
            <div class="value">
            </div>
          </div>
          <template v-for="item, idx in cacheItems">
            <div class="row lvl-1 first">
              <div class="label">Node Hash:</div>
              <div class="value">{{item.node}} {{item.isMe ? '(Current)' : ''}}</div>
            </div>
            <div class="row lvl-1">
              <div class="label">Node Round:</div>
              <div class="value">{{item.round}}</div>
            </div>
            <div class="row lvl-1 last">
              <div class="label">Node Timestamp:</div>
              <div class="value">{{item.timestamp}}</div>
            </div>
          </template>
          <div class="row">
            <div class="label">Latest Snapshots</div>
            <div class="value">
            </div>
          </div>
          <template v-for="snapshot, idx in lastSnapshots">
            <div class="row lvl-1 first">
              <img v-if="snapshot.meta.assetIcon" class="icon-bg" :src="snapshot.meta.assetIcon"/>
              <div class="label">#{{idx}}:</div>
              <div class="value">{{snapshot.hash}}</div>
            </div>
            <div class="row lvl-1">
              <div class="label">Time:</div>
              <div class="value">{{(new Date(snapshot.timestamp/1000000)).toLocaleString()}}</div>
            </div>
            <div class="row lvl-1">
              <div class="label">Assets:</div>
              <div class="value">{{snapshot.meta.assetName.toUpperCase()}}</div>
            </div>
            <div class="row lvl-1">
              <div class="label">Amount:</div>
              <div class="value">{{snapshot.meta.amount.toFixed(16)}}</div>
            </div>
            <div class="row lvl-1 last">
              <div class="label">Type:</div>
              <div class="value">{{snapshot.meta.type}}</div>
            </div>
          </template>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import axios from 'axios'
import Store from '@/service/store'
import Node from '@/components/Node'
const assetsMapping = require('@/assets/assets.json')

export default {
  data () {
    return {
      node: null,
      lastSnapshots: [],
      cacheItems: []
    }
  },
  components: {
    Node
  },
  async mounted () {
    let id = this.$route.params.id
    let node = Store.getNode(id)
    this.node = node
    // get node info
    let resp = await axios.post('https://1r7l1xqqj5.execute-api.ap-northeast-1.amazonaws.com/prod/MixinNetworkMonitor', {
      'op': 'get-info',
      'params': [ node.host ]
    })
    this.node.stat.data = resp.data
    console.log(this.node.stat.data.graph)
    this.cacheItems = this.getCacheItems(this.node)
    // get topsnapshots
    resp = await axios.post('https://1r7l1xqqj5.execute-api.ap-northeast-1.amazonaws.com/prod/MixinNetworkMonitor', {
      'op':'get-topsnapshots',
      'params': [ node.host ]
    })
    // console.log(resp.data)
    this.lastSnapshots = resp.data.map((x) => {
      x.meta = this.getTransObject(x)
      return x
    })
    this.lastSnapshots.reverse()
  },
  computed: {
    StatData() {
      if (this.node && this.node.stat && this.node.stat.code === 0 && this.node.stat.data.version) {
        return this.node.stat.data
      }
      return null
    },
  },
  methods: {
    back () {
      this.$router.back()
    },
    getCacheItems (node) {
      let cache = node.stat.data.graph.cache
      let myNodeHash = node.stat.data.node
      let ret = []
      let meItem = null
      if (cache) {
        for (const key in cache) {
          if (cache.hasOwnProperty(key) && key === myNodeHash) {
            cache[key].isMe = true
            meItem = cache[key]
          } else {
            ret.push(cache[key])
          }
        }
      }
      ret.unshift(meItem)
      return ret
    },
    getTransObject (snapshot) {
      let transaction = snapshot.transaction
      let inputs = transaction.inputs
      let obj = {}
      if (inputs.length) {
        if (inputs[0].deposit) {
          obj.type = '💰 Deposit'
        } else if (inputs[0].mint) {
          obj.type = '🏦 Mint'
        } else if (inputs[0].genesis) {
          obj.type = '🥚 Genesis'
        } else {
          obj.type = '💵 Transaction'
        }
      }
      if (transaction.outputs) {
        obj.amount = transaction.outputs.map((x) => parseFloat(x.amount)).reduce((a, b) => {
          return a + b
        })
      }
      if (assetsMapping.hasOwnProperty(transaction.asset.toUpperCase())) {
        obj.assetName = assetsMapping[transaction.asset.toUpperCase()]
        obj.assetIcon = require('@/assets/images/coins/' + obj.assetName + '.png')
      } else {
        obj.assetName = `Unknown (${transaction.asset})`
        obj.assetIcon = null
      }
      obj.asset = transaction.asset
      return obj
    }
  }
}

</script>

<style scoped lang="scss">
.content {
  max-width: 880px;
  margin: 0 auto;
  padding: 20px;
}
.console {
  margin-top: 20px;
  border-radius: 10px;
  padding: 10px;
  background: rgba(48, 44, 50, 1);
  color: #fff;
  // background: #fff;
  font-size: 12px;
  // overflow: auto;
}
.techie-details {
  opacity: 1;
  padding: 8px;
  color: rgba(183, 184, 186, 1);
  font-size: 12px;
  font-family: 'Roboto Mono', 'Operator Mono', 'SF Mono', 'Menlo', 'Courier', Courier, monospace;
  flex-direction: column;
  color: rgb(110, 209, 255);
  box-shadow: inset 0 1px 0 0 rgba(0,0,0,0.06);
  transition: all 0.2s ease;
  overflow: scroll;
  .row {
    display: flex;
  }
  .row > .label {
    color: rgba(196, 151, 107, 1);
    // flex-basis: 80px;
    margin-right: 10px;
    white-space: nowrap;
  }
  .row > .value {
    flex: 1;
  }
  .row .icon-bg {
    position: absolute;
    width: 32px;
    height: 32px;
    left: 40px;
    z-index: 9;
    opacity: 0.3;
    border-radius: 99em;
  }
  .row::before {
    color: rgba(88,88,88,1);
  }
  .row.lvl-1 {
    margin-left: 8px;
  }
  .row.lvl-1::before {
    content: "├";
    margin-right: 4px;
  }
  .row.lvl-1.last::before {
    content: "└";
  }
  .row.lvl-1.first::before {
    content: "┌";
  }
  .row.lvl-1 > .label {
    // flex-basis: 120px;
  }
  .row.lvl-2 {
    margin-left: 24px;
  }
  .row.lvl-2::before {
    content: "├";
    margin-right: 4px;
  }
  .row.lvl-2.first::before {
    content: "┌";
  }
  .row.lvl-2.last::before {
    content: "└";
  }
  .row.lvl-2 > .label {
    // flex-basis: 104px;
  }
}
</style>


