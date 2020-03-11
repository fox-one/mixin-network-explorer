<template>
  <van-panel :title="'Node: ' + nodeMeta.name">
    <div class="panel-body">
      <table>
        <tbody>
          <tr>
            <td>Topology</td>
            <td>{{node.graph.topology}}</td>
          </tr>
          <tr>
            <td>Hash</td>
            <td>{{node.node}}</td>
          </tr>
          <tr>
            <td>Host</td>
            <td>{{nodeMeta.host}}</td>
          </tr>
          <tr>
            <td>Uptime</td>
            <td>{{node.uptime}}</td>
          </tr>
          <tr>
            <td>Timestamp</td>
            <td>{{node.timestamp}}</td>
          </tr>
          <tr>
            <td>Version</td>
            <td>{{node.version}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </van-panel>
</template>

<script>
export default {
  props: ['node', 'metaMap'],
  methods: {
  },
  computed: {
    nodeMeta() {
      if (this.metaMap && this.node) {
        if (this.metaMap.hasOwnProperty(this.node.node)) {
          return this.metaMap[this.node.node]
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
  border-bottom: 1px solid #eee;
  .van-cell__label {
    word-break: break-all;
  }
}
</style>

