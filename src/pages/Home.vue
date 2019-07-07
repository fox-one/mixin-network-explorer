<template>
  <section class="content">
    <van-popup v-model="popupNodeState" position="top">
      <van-picker
        show-toolbar
        :columns="popupNodeList"
        @cancel="popupNodeState = false"
        @confirm="onPopupNodeSelectConfirm"
      />
    </van-popup>
    <loading :loading="pageLoading">
    <div class="page-content">
      <van-cell-group v-if="curNode" class="node-dropdown">
        <van-cell title="Select Nodes" is-link arrow-direction="down" @click="popupNodes">
          <span class="major">{{curNodeMeta.name}}</span>
          <span class="minor">{{curNode.node}}</span>
        </van-cell>
      </van-cell-group>

      <div class="side" ref="side">
        <van-search
          class="side-search"
          placeholder="name, host"
          shape="round"
          v-model="filterNodeValue" >
        </van-search>
        <div class="nodelist">
          <template v-if="onlineMixinNodes.length !== 0">
            <div class="node-wrapper"
              v-bind:key="node.id"
              :ref="'node-' + node.id"
              :class="nodeSelectedState[node.id] ? 'selected' : ''" v-for="node in onlineMixinNodes">
              <node :data="node" shape="list-item" @click-item="openNodeDetail(node)"></node>
            </div>
          </template>
          <template v-else>
              <div class="hint" >
              None.
              </div>
          </template>
        </div>
      </div>

      <div class="node-detail-wrapper">
          <div v-if="curNode" class="node-detail">
            <van-search
              placeholder="Snapshot id, Account token"
              shape="round"
              @search="doSearch"
              v-model="searchValue" >
            </van-search>
            <div class="node-info">
              <node-info-panel :node="curNode" :metaMap="nodeMetaMap"/>
              <br/>
              <node-cache-panel :node="curNode" :metaMap="nodeMetaMap"/>
            </div>
          </div>
      </div>
    </div>
    </loading>
  </section>
</template>

<script>
import { Search, Popup } from 'vant'
import Node from '@/components/Node'
import Loading from '@/components/Loading'
import NodeInfoPanel from '@/components/NodeInfoPanel'
import NodeCachePanel from '@/components/NodeCachePanel'
import Store from '@/service/store'
import NetworkService from '@/service/network'
import axios from 'axios'
import VueScrollTo from 'vue-scrollto'

export default {
  components: {
    Node,
    Loading,
    'van-search': Search,
    'node-info-panel': NodeInfoPanel,
    'node-cache-panel': NodeCachePanel,
  },
  async mounted () {
    this.pageLoading = true
    let result = await axios.get('https://node.f1ex.io/mixin-nodes-stat.json?id=' + (Date.now() + Math.random()))
    result = result.data
    // let result = require('../../public/mocking.json')
    let nodes = []
    let max = 0
    let min = Number.MAX_SAFE_INTEGER
    for (let ix = 0; ix < result.nodes.length; ix++) {
      const node = result.nodes[ix]
      let statData = node.stat.data
      if (statData && statData.graph) {
        if (statData.graph.topology < min) {
          min = statData.graph.topology
        }
        if (statData.graph.topology > max) {
          max = statData.graph.topology
        }
      }
    }

    for (let ix = 0; ix < result.nodes.length; ix++) {
      const node = result.nodes[ix]
      if (node.stat.data && node.stat.data.graph) {
        let val = max - node.stat.data.graph.topology
        if (val < 10) {
          node.level = 0
        } else if (val < 30) {
          node.level = 1
        } else {
          node.level = 2
        }
        node.myCache = this.getMyCacheItem(node)
        node.id = node.stat.data.node
        this.nodeSelectedState[node.id] = false
        this.nodeMetaMap[node.id] = {
          id: node.id,
          host: node.host,
          name: node.name,
          signer: node.signer,
        }
        nodes.push(node)
      }
    }
    Store.setNodes(nodes)
    this.nodes = nodes
    this.updatedAt = new Date(result.updatedAt).toLocaleString()
    setTimeout(() => {
      this.selectARandomNode()
      this.pageLoading = false
    }, 500)
  },
  data () {
    return {
      nodes: [],
      nodeSelectedState: {},
      nodeMetaMap: {},
      updatedAt: new Date(),
      searchValue: '',
      filterNodeValue: '',
      curNode: null,
      pageLoading: false,
      popupNodeState: false,
    }
  },
  computed: {
    onlineMixinNodes () {
      var nodes = this.nodes.filter((x) => x.stat.code === 0 && x.stat.data.version)
      nodes.sort((a, b) => {
        return (a.name > b.name ? 1 : -1)
      })
      if (this.filterNodeValue) {
        nodes = nodes.filter(x => {
          return x.name.toLowerCase().indexOf(this.filterNodeValue.toLowerCase()) !== -1 ||
            x.host.toLowerCase().indexOf(this.filterNodeValue.toLowerCase()) !== -1
        })
      }
      return nodes
    },
    curNodeMeta () {
      if (this.nodeMetaMap && this.curNode) {
        if (this.nodeMetaMap.hasOwnProperty(this.curNode.node)) {
          return this.nodeMetaMap[this.curNode.node]
        }
      }
      return {}
    },
    popupNodeList () {
      return this.onlineMixinNodes.map(x => {
        x.text = x.name
        return x
      })
    }
  },
  methods: {
    doSearch () {
      let searchValue = this.searchValue.trim()
      if (/^.{8}-.{4}-.{4}-.{4}-.{12}$/.test(searchValue)) {
        // snapshot id
        window.location.href = `https://mixin.one/snapshots/${searchValue}`
      } else if (/^[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9\-_]+$/.test(searchValue)) {
        // token
        this.$router.push('/tools/assets-viewer?token=' + encodeURIComponent(this.searchValue))
      } else {
        alert('unsupported query')
      }
    },
    popupNodes () {
      this.popupNodeState = true
    },
    getMyCacheItem(node) {
      let cache = node.stat.data.graph.cache
      let myNodeHash = node.stat.data.node
      if (cache) {
        for (const key in cache) {
          if (cache.hasOwnProperty(key) && key === myNodeHash) {
            return cache[key]
          }
        }
      }
      return null
    },
    async openNodeDetail(node) {
      this.pageLoading = true
      try {
        this.curNode = await NetworkService.info(node.host, {})
      } catch (err) {
        this.pageLoading = false
      }
      this.pageLoading = false
      this.selectNode(node)
    },
    selectARandomNode() {
      let pos = Math.round(Math.random() * this.nodes.length % this.nodes.length)
      this.openNodeDetail(this.nodes[pos])
      if (this.$refs[`node-${this.nodes[pos].id}`]) {
        this.$refs[`node-${this.nodes[pos].id}`][0].scrollIntoView()
      }
    },
    selectNode(node) {
      for (const key in this.nodeSelectedState) {
        this.nodeSelectedState[key] = false
      }
      this.nodeSelectedState[node.id] = true
    },
    onPopupNodeSelectConfirm (selected, ix) {
      this.popupNodeState = false
      this.openNodeDetail(selected)
    }
  }
}
</script>

<style lang="scss" scoped>
.entry-wrapper {
  margin-top: 20px;
  display: flex;
  padding: 4px;
  background: #fff;
}
.content {
  margin: 0 auto;
  height: 100%;
}
.page-content {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  .node-dropdown {
    display: none;
    width: 100%; margin: 10px 0;
    border-bottom: 1px solid #f2f2f2;
    .major, .minor {
      display: block;
      line-height: 1.2;
    }
    .major {
      color: #000;
      word-break: normal;
    }
    .minor {
      font-size: 12px;
    }
  }
  .side {
    height: 100%;
    flex-basis: 240px;
    overflow: auto;
    border-right: 1px solid #eee;
    .nodelist {
      border-top: 1px solid #f2f2f2;
    }
  }
  .node-detail-wrapper {
    padding: 0px;
    flex: 1;
    // background: white;
    height: 100%;
    overflow: auto;
  }
}
.node-wrapper {
  padding: 8px 10px;
  &.selected {
    background: rgb(180, 229, 255);
  }
}
@media (max-width: 500px) {
  .page-content  {
    flex-direction: column;
    .node-dropdown {
      display: block;
    }
    .side {
      display: none;
    }
    .node-detail-wrapper {
      border-top: 1px solid #f2f2f2;
    }
  }
}

</style>
