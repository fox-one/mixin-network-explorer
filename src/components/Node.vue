<template>
  <div v-if="data" class="node" :class="nodeCls" @click="clickItem">
    <div class="node-info">
      <div class="node-info-top">
        <a v-if="StatData" class="version" :href="'//github.com/MixinNetwork/mixin/commit/' + StatData.version">{{StatData.version.slice(0, 6)}}</a>
        <div class="name">{{data.name}}</div>
      </div>
      <div class="key-metrics">
        <div class="key-metric topology" :class="'level-' + data.level">
          <div class="key-metric-label">
            Topology
          </div>
          <div class="key-metric-value">
            {{StatData ? StatData.graph.topology : '??'}}
          </div>
        </div>
        <div class="key-metric cache">
          <div class="key-metric-label">
            Round
          </div>
          <div class="key-metric-value">
            {{myCache ? `${myCache.round}(${formatTs(myCache.timestamp)})` : '??'}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UtilsFn from '@/utils/fn'

export default {
  props: {
    data: {
      name: '',
      host: '',
      test: '',
      stat: {},
    },
    shape: {
      type: String,
      default: 'list-item'
    },
  },
  data () {
    return {
      toggleTechieDetails: false,
      lastSnapshots: []
    }
  },
  computed: {
    nodeCls () {
      let cls = []
      cls.push(this.isActive ? 'active' : '')
      cls.push(this.shape)
      return cls.join(' ')
    },
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
    myCache () {
      return this.data.myCache
    }
  },
  methods: {
    async toggle () {
      if (this.StatData === null) {
        return
      }
      this.toggleTechieDetails = !this.toggleTechieDetails
      if (this.toggleTechieDetails) {
        const result = await axios.post('https://1r7l1xqqj5.execute-api.ap-northeast-1.amazonaws.com/prod/MixinNetworkMonitor', {
          "op":"get-topsnapshots",
          "params": [this.data.host]
        })
        this.lastSnapshots = result.map((x) => {
          x.meta = this.getTransObject(x)
          return x
        })
        this.lastSnapshots.reverse()
      }
    },
    clickItem () {
      this.$emit('click-item', this.data)
    },
    formatTs: UtilsFn.FormatTs
  }
}
</script>


<style scoped lang="scss">
.node {
  text-align: left;
  background: #fff;
  box-shadow: 0 1px 0 0 rgba(0,0,0,0.3), 0 0px 3px 0 rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  width: 110px;
  height: 126px;
  border-radius: 10px;
  position: relative;
  &.active {
    box-shadow: 0 2px 0 0 rgb(92, 198, 255);
    transition: all 0.2s ease;
  }
  &.active:hover {
    box-shadow: 0 2px 0 0 rgb(92, 198, 255), 0 3px 10px 0 rgba(92, 198, 255, 0.2);
  }
}
.node-info {
  flex-direction: column;
  display: flex;
}
.node.list-item {
  width: 220px;
  height: 60px;
  box-shadow: 0 0 0 1px rgba(92, 198, 255, 0.1) !important;
  .node-info {
    .node-info-top {
      flex-direction: row-reverse;
    }
  }
  .key-metrics {
    .key-metric {
      flex: 0;
      display: flex;
    }
  }
}

.key-metrics {
  font-size: 10px;
  color: rgba(0,0,0,0.3);
  .key-metric {
    &:last-child {
      border-bottom: none;
    }
    .key-metric-label {
      padding: 0px 6px 0px 6px;
      margin: 0 0 2px 0px;
      display: inline-block;
      color: rgba(0,0,0,0.4);
    }
    .key-metric-value {
      padding: 0px 6px 0px 6px;
      margin: 0 0 2px 0;
    }
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
}
.node-info {
  display: flex;
  .node-info-top {
    display: flex;
    flex-direction: column
  }
}
.name {
  flex: 1;
  color: rgb(59, 186, 222);
  margin-bottom: 6px;
  font-size: 12px;
  padding: 4px 6px;
}
.version {
  padding: 4px 6px;
  text-align: left;
  font-size: 10px;
  display: block;
  color: rgba(0,0,0,0.3);
  font-family: 'Roboto Mono', 'Operator Mono', 'SF Mono', 'Menlo', 'Courier', Courier, monospace;
}
.text {
  font-size: 13px;
  opacity: 0.6;
}
.addr, .topology {
  flex: 1;
}
@keyframes breathe {
  from { opacity: 0.2; } to { opacity: 1; }
}
</style>
