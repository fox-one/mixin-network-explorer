<template>
  <div id="app" style="height: 100%">
    <div class="header" style="width: 100%">
      <van-tabs v-if="isMainPage" v-model="active" color="rgb(92, 198, 255)" swipeable sticky @change="change">
        <van-tab title="Nodes"></van-tab>
        <van-tab title="Tools"></van-tab>
        <van-tab title="Info"></van-tab>
      </van-tabs>
    </div>
    <div style="padding: 0px">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Loading from '@/components/Loading'

export default {
  name: 'app',
  components: {
  },
  data() {
    return {
      active: 0,
    }
  },
  computed: {
    isMainPage() {
      return ['/', '/tools', '/about'].indexOf(this.$route.path) !== -1
    }
  },
  methods: {
    change(ix, title) {
      if (ix === 0) {
        this.$router.push('/')
      } else if (ix === 1) {
        this.$router.push('/tools')
      } else {
        this.$router.push('/about')
      }
    }
  }
}
</script>

<style>
html {
  font-family: Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background: rgba(242, 243, 244, 1);
}
html, body {
  height: 100%;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

a {
  color: rgb(92, 198, 255);
  text-decoration: none;
}

.panel {
  width: 100%;
}

.page-top {
  margin: 20px 0;
  padding: 10px;
}

.page-title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 24px;
  letter-spacing: 1px;
}

.section-title {
  margin: 30px 0 10px 10px;
  opacity: 0.6;
  text-align: left;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: bold;
}

.nodelist-legends {
  margin: 0px 0 16px 14px;
  text-align: left;
  border-bottom: 1px solid rgba(0,0,0, 0.06);
  padding-bottom: 10px;
  font-size: 14px;
}
.nodelist-legends  .legend-label {
  opacity: 0.6;
  display: flex;
}

.pane-like {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 3px;
  box-shadow: 0 0 40px rgba(0,0,0, 0.06);
  margin-bottom: 40px;
}

.hint {
  padding: 4px 10px 8px 10px;
  opacity: 0.4;
  font-size: 14px;
  line-height: 1.4;
  display: block;
}

@media (max-width: 500px) {
  .panel {
    width: 100%;
  }
}

</style>
