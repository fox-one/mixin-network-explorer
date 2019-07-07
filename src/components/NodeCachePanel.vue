<template>
  <van-panel title="Cache Items" :desc="myCacheItemDisplay">
    <div class="panel-body">
      <node-cache-item
        v-for="cacheItem of node.graph.cache"
        v-bind:key="cacheItem.node"
        :meta="getNodeMeta(cacheItem)"
        :cacheItem="cacheItem"
      />
    </div>
  </van-panel>
</template>

<script>
import NodeCacheItem from '@/components/NodeCacheItem'
import UtilsFn from '@/utils/fn'
export default {
  props: ['node', 'metaMap'],
  components: {
    'node-cache-item': NodeCacheItem
  },
  data () {
    return {
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
  },
  methods: {
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

