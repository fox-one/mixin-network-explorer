<template>
  <section class="content">
    <div class="nodelist-title section-title">{{'Online Nodes: ' + onlineMixinNodes.length}}</div>
    <div class="nodelist">
      <template v-if="onlineMixinNodes.length !== 0">
        <div class="node-wrapper" v-for="node in onlineMixinNodes">
          <node :data="node" shape="default" @click-item="openNodeDetail(node)"></node>
        </div>
      </template>
      <template v-else>
        <div class="hint">None.</div>
      </template>
    </div>
    <div class="nodelist-title section-title">{{"Can't be reached: " + offlineMixinNodes.length}}</div>
    <div class="nodelist">
      <template v-if="offlineMixinNodes.length !== 0">
        <div class="node-wrapper" v-for="node in offlineMixinNodes">
          <node :data="node" shape="default" @click-item="openNodeDetail(node)"></node>
        </div>
      </template>
      <template v-else>
        <div class="hint">None.</div>
      </template>
    </div>
    <div class="footer">
      <div class="datetime">Last updated: {{updatedAt}}</div>
    </div>
  </section>
</template>

<script>
import { Tabbar, TabbarItem } from "vant";
import Node from "@/components/Node";
import Store from "@/service/store";
import axios from "axios";

export default {
  components: {
    Node
  },
  async mounted() {
    let result = await axios.get(
      "https://mixin.network/mixin-nodes-stat.json?id=" +
        (Date.now() + Math.random())
    );
    result = result.data;
    // let result = require('../../public/mocking.json')
    let nodes = [];
    let max = 0;
    let min = Number.MAX_SAFE_INTEGER;
    for (let ix = 0; ix < result.nodes.length; ix++) {
      const node = result.nodes[ix];
      let statData = node.stat.data;
      if (statData && statData.graph) {
        if (statData.graph.topology < min) {
          min = statData.graph.topology;
        }
        if (statData.graph.topology > max) {
          max = statData.graph.topology;
        }
      }
    }

    for (let ix = 0; ix < result.nodes.length; ix++) {
      let node = result.nodes[ix];
      if (node.stat.data && node.stat.data.graph) {
        let val = max - node.stat.data.graph.topology;
        if (val < 10) {
          node.level = 0;
        } else if (val < 30) {
          node.level = 1;
        } else {
          node.level = 2;
        }
        node.myCache = this.getMyCacheItem(node);
        node.id = node.stat.data.node;
        nodes.push(node);
      } else {
        nodes.push(node);
      }
    }
    Store.setNodes(nodes);
    this.nodes = nodes;
    this.updatedAt = new Date(result.updatedAt).toLocaleString();
  },
  data() {
    return {
      nodes: [],
      managers: [
        {
          name: "F1EX",
          icon: require("@/assets/images/f1ex.png"),
          link: "7000101948",
          class: "flicker"
        },
        {
          name: "B1",
          icon: require("@/assets/images/b1.png"),
          link: "https://b1.run/mixin"
        },
        {
          name: "ExinPool",
          icon: require("@/assets/images/exinpool.png"),
          mixinId: "7000101761"
        },
        {
          name: "SS",
          icon: require("@/assets/images/ss.png"),
          mixinId: "7000101762"
        }
      ],
      updatedAt: new Date(),
      searchValue: "",
      offlineNodes: []
    };
  },
  computed: {
    onlineMixinNodes() {
      var nodes = this.nodes.filter(
        x => x.stat.code === 0 && x.stat.data.version
      );
      nodes.sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });
      return nodes;
    },
    offlineMixinNodes() {
      var nodes = this.nodes.filter(
        x => x.stat.code !== 0 || !x.stat.data.hasOwnProperty("version")
      );
      return nodes;
    }
  },
  methods: {
    viewMgr(mgr, evt) {
      evt.preventDefault();
      if (mgr.link) {
        window.location.href = mgr.link;
      } else {
        alert('Search "' + mgr.mixinId + '" in Mixin Messenger.');
      }
    },
    doSearch() {
      let searchValue = this.searchValue.trim();
      if (/^.{8}-.{4}-.{4}-.{4}-.{12}$/.test(searchValue)) {
        // snapshot id
        window.location.href = `https://mixin.one/snapshots/${searchValue}`;
      } else if (
        /^[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9\-_]+$/.test(searchValue)
      ) {
        // token
        this.$router.push(
          "/tools/assets-viewer?token=" + encodeURIComponent(this.searchValue)
        );
      } else {
        alert("unsupported query");
      }
    },
    getMyCacheItem(node) {
      let cache = node.stat.data.graph.cache;
      let myNodeHash = node.stat.data.node;
      if (cache) {
        for (const key in cache) {
          if (cache.hasOwnProperty(key) && key === myNodeHash) {
            return cache[key];
          }
        }
      }
      return null;
    },
    openNodeDetail(node) {
      // this.$router.push(`/nodes/${node.id}`)
    }
  }
};
</script>

<style lang="scss" scoped>
.entry-wrapper {
  margin-top: 20px;
  display: flex;
  padding: 4px;
  background: #fff;
}
.content {
  max-width: 1000px;
  margin: 0 auto;
}
.nodelist {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 0 10px;
  margin: 0 auto;
}
.node-wrapper {
  float: left;
  margin: 4px;
}

.empty-node {
  display: flex;
  cursor: pointer;
}
.empty-node .node-mgr {
  background: white;
  flex: 1;
  border-radius: 10px;
  box-shadow: 0 2px 0 0 rgb(92, 198, 255), 0 0px 3px 0 rgba(92, 198, 255, 0.2);
  position: relative;
  width: 80px;
}
.empty-node .node-mgr:last-child {
  margin-right: 0px;
}
.empty-node .node-mgr-icon {
  height: 64px;
  width: 64px;
  display: block;
  padding: 10px;
  margin: 0 auto;
  border-radius: 99em;
  position: relative;
  z-index: 9;
}
.empty-node .node-mgr-name {
  width: 100%;
  display: block;
  padding: 8px 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
}

.footer {
  margin: 40px 0 40px 0;
  font-size: 12px;
  text-align: center;
}
.footer > .datetime {
  opacity: 0.6;
}
.footer > .meta {
  color: #999;
}

@keyframes spinPulse {
  0% {
    transform: rotate(160deg);
    opacity: 0;
    box-shadow: 0 0 1px rgb(0, 187, 255);
  }
  50% {
    transform: rotate(145deg);
    opacity: 1;
  }
  100% {
    transform: rotate(-320deg);
    opacity: 0;
  }
}
@keyframes spinoffPulse {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes rotatecircle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>
