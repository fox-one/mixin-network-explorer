<template>
  <div class="node" :class="isActive ? 'active' : ''">
    <div class="node-top">
      <div class="node-info">
        <div class="node-info-top">
          <a v-if="StatData" class="version" :href="'//github.com/MixinNetwork/mixin/commit/' + StatData.version">{{StatData.version.slice(0, 6)}}</a>
          <div class="name">{{data.name}}</div>
          <div class="value"></div>
        </div>
        <!-- <div class="text">{{data.text}}</div> -->
      </div>
      <div class="node-stat">
        <div class="stat-spot" :class="isActive ? 'active' : ''" >
          <div class="stat-base"></div>
          <div class="stat-icon"></div>
          <div class="stat-hlight-base"></div>
          <div class="stat-hlight">
            <svg width="16px" height="10px" viewBox="0 0 16 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs>
                    <linearGradient x1="49.9999882%" y1="-13.7086219%" x2="50%" y2="100%" id="linearGradient-1">
                        <stop stop-color="#A2EFFF" stop-opacity="0.234346694" offset="0%"></stop>
                        <stop stop-color="#A8E9FF" stop-opacity="0.0197860054" offset="100%"></stop>
                    </linearGradient>
                    <radialGradient cx="50%" cy="96.988131%" fx="50%" fy="96.988131%" r="102.880891%" gradientTransform="translate(0.500000,0.969881),scale(0.564583,1.000000),rotate(90.000000),translate(-0.500000,-0.969881)" id="radialGradient-2">
                        <stop stop-color="#B4F0FF" stop-opacity="0" offset="0%"></stop>
                        <stop stop-color="#B4F0FF" stop-opacity="0" offset="90.8620845%"></stop>
                        <stop stop-color="#75C9FF" stop-opacity="0.440274004" offset="100%"></stop>
                    </radialGradient>
                    <path d="M4617.01249,456.528949 C4617.0042,456.353675 4617,456.177328 4617,456 C4617,449.924868 4621.92487,445 4628,445 C4634.07513,445 4639,449.924868 4639,456 C4639,456.177328 4638.9958,456.353675 4638.98751,456.528949 C4635.6539,457.101009 4631.92952,457.420833 4628,457.420833 C4624.07048,457.420833 4620.3461,457.101009 4617.01249,456.528949 Z" id="path-3"></path>
                </defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Artboard" transform="translate(-4617.000000, -445.000000)">
                        <g id="light">
                            <use fill="url(#linearGradient-1)" xlink:href="#path-3"></use>
                            <use fill="url(#radialGradient-2)" xlink:href="#path-3"></use>
                        </g>
                    </g>
                </g>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="techie-details"  :class="toggleTechieDetails? 'open': ''">
      <div class="row">
        <div class="label">Node:</div>
        <div class="value">{{StatData ? StatData.node : '??'}}</div>
      </div>
      <div class="row">
        <div class="label">Network:</div>
        <div class="value">{{StatData ? StatData.network : '??'}}</div>
      </div>
      <div class="row">
        <div class="label">Cached:</div>
        <div class="value">{{CachedItems}}</div>
      </div>
      <div class="row">
        <div class="label">Topology:</div>
        <div class="value">{{StatData ? StatData.graph.topology : '??'}}</div>
      </div>
      <div class="row">
        <div class="label">Latest Snapshots</div>
        <div class="value">
        </div>
      </div>
      <template v-for="snapshot, idx in lastSnapshots">
        <div class="row lvl-1 first">
          <img v-if="snapshot.meta.assetIcon" class="icon-bg" :src="snapshot.meta.assetIcon"/>
          <div class="label">Transaction #{{idx}}:</div>
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

    <div class="techie" @click="toggle">
      <div class="addr">{{data.host}}</div>
    </div>

    <div class="key-metrics">
      <div class="key-metric topology" :class="'level-' + data.level">T:{{StatData ? StatData.graph.topology : '??'}}</div>
      <!-- <div class="key-metric cached">C:{{CachedItems}}</div> -->
    </div>

  </div>
</template>

<script>
const assetsMapping = require('@/assets/assets.json')
export default {
  props: {
    data: {
      name: '',
      host: '',
      test: '',
      stat: {},
    }
  },
  data () {
    return {
      toggleTechieDetails: false,
      lastSnapshots: []
    }
  },
  computed: {
    isActive() {
      if (this.StatData) {
        return true
      }
      return false
    },
    StatData() {
      if (this.data.stat && this.data.stat.code === 0 && this.data.stat.data.version) {
        return this.data.stat.data
      }
      return null
    },
    CachedItems () {
      if (this.StatData) {
        let obj = this.StatData.graph.cache
        let arr = Object.keys(obj).map(function(key) {
          return obj[key].round
        })
        return arr.reduce((a, b) => a + b)
      }
      return 0;
    }
  },
  methods: {
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
    },
    async toggle () {
      if (this.StatData === null) {
        return 
      }
      this.toggleTechieDetails = !this.toggleTechieDetails 
      if (this.toggleTechieDetails) {
        const result = await this.$axios.$post('https://1r7l1xqqj5.execute-api.ap-northeast-1.amazonaws.com/prod/MixinNetworkMonitor', {
          "op":"get-topsnapshots",
          "params": [this.data.host]
        })
        this.lastSnapshots = result.map((x) => {
          x.meta = this.getTransObject(x)
          return x
        })
        this.lastSnapshots.reverse()
      }
    }
  }
}
</script>


<style scoped>
.node {
  text-align: left;
  background: #fff;
  box-shadow: 0 1px 0 0 rgba(0,0,0,0.3), 0 0px 3px 0 rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  width: 84px;
  height: 84px;
  position: relative;
}
.node.active {
  box-shadow: 0 1px 0 0 rgb(92, 198, 255), 0 0px 3px 0 rgba(92, 198, 255, 0.2);
}
.node-info {
  flex: 1;
}
.key-metrics {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 10px;
  color: rgba(0,0,0,0.3);
  font-family: 'Roboto Mono', 'Menlo', Courier, monospace;
  border-top: 1px solid rgba(0,0,0,0.05);
}
.key-metric {
  padding: 2px 0 2px 4px;
  background: white;
  box-shadow: 0 1px 0 0 rgb(92, 198, 255);
}
.key-metric.level-0 {
  color: #00b435;
}
.key-metric.level-1 {
  color: rgb(255, 136, 0);
}
.key-metric.level-2 {
  color: rgb(136, 0, 7);
}
.node-stat {
  flex: 0;
  padding: 0 0px 0 20px;
  border-left: 1px solid rgba(0,0,0,0.1);
  /* display: flex; */
  display: none;
  justify-content: center;
  align-items: center;
}
.stat-spot {
  border-radius: 99em;
  /* box-shadow: inset 0 0 20px rgba(0,0,0,0.2); */
  height: 20px;
  width: 20px;
  /* display: block; */
  display: none;
  /* border: 1px solid #979797; */
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.50);
  position: relative;
}

.stat-spot .stat-base {
  position: absolute;
  width: 18px;
  height: 18px;
  top: 1px;
  left: 1px;
  border-radius: 99em;
  z-index: 2;
  background-image: linear-gradient(-180deg, #003963 0%, #002840 100%);
}
.stat-spot .stat-hlight-base {
  position: absolute;
  width: 14px;
  height: 14px;
  top: 3px;
  left: 3px;
  border-radius: 99em;
  z-index: 3;
  background-image: linear-gradient(-180deg, rgba(0,18,29,0.30) 0%, rgba(0,4,7,0.60) 100%);
}
.stat-spot .stat-hlight {
  position: absolute;
  width: 14px;
  height: 14px;
  top: 0px;
  left: 3px;
  z-index: 4;
}
.stat-spot.active {
  box-shadow: 0 1px 6px 0 rgb(92, 198, 255);
}
.stat-spot.active .stat-base {
  animation: breathe 4s ease 0s infinite alternate;
  background-image: linear-gradient(-180deg, #0080C4 0%, #00EBF8 100%);
}
.stat-spot.active .stat-hlight-base {
  animation: breathe 4s ease 0s infinite alternate;
  background-image: linear-gradient(-180deg, #0080C4 0%, #00EBF8 100%);
}
.stat-spot.active .stat-hlight-base::before {
  width: 4px;
  height: 4px;
  border-radius: 99em;
  display: block;
  left: 3px;
  bottom: 1px;
  position: absolute;
  background-image: radial-gradient(50% 100%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.3)  100%);
  content: ' ';
  z-index: 5;
  /* box-shadow: 0 0 6px #fff; */
}
.node-top {
  display: flex;
}
.node-info-top {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.name {
  flex: 1;
  color: rgb(59, 186, 222);
  margin-bottom: 6px;
  font-size: 12px;
  padding: 4px;
}
.version {
  padding: 4px;
  text-align: right;
  background: rgba(196, 148, 148, 0.08);
  font-size: 10px;
  display: block;
  color: rgba(0,0,0,0.3);
  font-family: 'Roboto Mono', 'Operator Mono', 'SF Mono', 'Menlo', 'Courier', Courier, monospace
}
.techie, .techie-details {
  display: none;
  background: rgba(196, 148, 148, 0.08);
  padding: 8px 20px;
  color: rgba(183, 184, 186, 1);
  font-size: 12px;
  font-family: 'Roboto Mono', 'Operator Mono', 'SF Mono', 'Menlo', 'Courier', Courier, monospace
}
.techie-details {
  flex-direction: column;
  background: rgba(48, 44, 50, 1);
  color: rgb(110, 209, 255);
  box-shadow: inset 0 1px 0 0 rgba(0,0,0,0.06);
  transform: rotateX(90deg);
  padding: 0 20px;
  height: 0;
  opacity: 0;
  transition: all 0.2s ease;
  overflow: scroll;
}
.techie-details.open {
  height: auto;
  padding: 8px 20px;
  opacity: 1;
  transform: rotateX(0);
}
.text {
  font-size: 13px;
  opacity: 0.6;
}
.addr, .topology {
  flex: 1;
}
.row {
  display: flex;
}
.row > .label {
  color: rgba(196, 151, 107, 1);
  flex-basis: 80px;
  white-space: nowrap;
}
.row > .value {
  flex: 1;
}
.row .icon-bg {
  position: absolute;
  width: 32px;
  height: 32px;
  right: 10px;
  z-index: -1;
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
  flex-basis: 120px;
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
  flex-basis: 104px;
}
@keyframes breathe { 
  from { opacity: 0.2; } to { opacity: 1; }
}
</style>
