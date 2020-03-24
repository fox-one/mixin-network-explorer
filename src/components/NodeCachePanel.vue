<template>
  <van-panel title="Cache Items" :desc="myCacheItemDisplay">
    <div class="panel-header" slot="header">
      <div class="panel-header-left">
        <div class="panel-title">
          Cache Items
        </div>
        <div class="panel-desc">
          Cache rounds: {{ myCacheItemDisplay }}
          <br/>
          Queue caches: {{ myQueueCacheItemDisplay }}
        </div>
      </div>
      <div class="panel-header-right">
        <span style="margin-right: 10px;">Hide normal nodes</span>
        <van-switch v-model="onlySlowNodesCheck" size="20px" title="Only slow nodes" />
      </div>
    </div>
    <div class="panel-body">
      <node-cache-item
        v-for="cacheItem in filteredNodeCacheItems"
        v-bind:key="cacheItem.node"
        :meta="getNodeMeta(cacheItem)"
        :cacheItem="cacheItem"
        :is-removed="isRemoved(cacheItem.node)"
      />
    </div>
  </van-panel>
</template>

<script>
import { Switch } from 'vant'
import NodeCacheItem from '@/components/NodeCacheItem'
import UtilsFn from '@/utils/fn'
export default {
  props: ['node', 'metaMap'],
  components: {
    'node-cache-item': NodeCacheItem,
    'van-switch': Switch
  },
  data () {
    return {
      onlySlowNodesCheck: false
    }
  },
  computed: {
    myCacheItemDisplay () {
      let cache = this.node.graph.cache
      let myNodeHash = this.node.node
      if (cache) {
        for (const key in cache) {
          if (cache.hasOwnProperty(key) && key === myNodeHash) {
            return `${cache[key].round} (${UtilsFn.FormatTs(cache[key].timestamp)})`
          }
        }
      }
      return '0 (0ms)'
    },
    myQueueCacheItemDisplay () {
      return this.node.queue.caches
    },
    filteredNodeCacheItems () {
      const items = []
      const removed = []
      for (const key in this.node.graph.cache) {
        const item = this.node.graph.cache[key]
        if (this.isRemoved(item.node)) {
          removed.push(item)
        } else {
          items.push(item)
        }
      }
      if (this.onlySlowNodesCheck) {
        return items.filter(x => {
          return UtilsFn.CacheLevel(x.timestamp) !== 'level-0'
        })
      }
      return items.concat(removed)
    }
  },
  methods: {
    isRemoved (id) {
      return (id in this.metaMap)
    },
    getNodeMeta(node) {
      if (this.metaMap && node) {
        if (this.metaMap.hasOwnProperty(node.node)) {
          return this.metaMap[node.node]
        }
      }
      return {}
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-body {
  padding: 10px 0px;
}
</style>

