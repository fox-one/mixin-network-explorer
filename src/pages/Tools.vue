<template>
  <section class="content">
    <div class="panel">
      <van-cell-group title="Calculators" class="cell-group">
        <van-cell title="XIN Mining Rewards Calculator" is-link @click="openCal('xin')">
        </van-cell>
        <van-cell title="F1 Pre-Mining Rewards Calculator" is-link @click="openCal('f1')">
        </van-cell>
        <van-cell title="Network Threaten Calculator" is-link @click="openCal('threaten')">
        </van-cell>
      </van-cell-group>
    </div>
    <div class="panel">
      <van-cell-group title="Assists" class="cell-group">
        <van-cell title="Generate Assets Public Token" is-link @click="openAssist()">
        </van-cell>
        <van-cell title="Assets Viewer" is-link @click="openAssetsViewer()">
        </van-cell>
      </van-cell-group>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    openCal(name) {
      this.$router.push({path: '/tools/cal/' + name })
    },
    openAssist(name) {
      this.$router.push({path: '/tools/assist/' })
    },
    openAssetsViewer() {
      this.$router.push({path: '/tools/assets-viewer/' })
    }
  }
}

</script>

<style scoped>
.content {
  max-width: 880px;
  margin: 0 auto;
}

.results {
  font-size: 12px;
}
.calculator {
  width: 320px;
}
</style>
