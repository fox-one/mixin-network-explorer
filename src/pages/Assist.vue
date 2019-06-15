<template>
  <div class="container">
    <van-nav-bar
      title=""
      left-text="Back"
      left-arrow
      @click-left="back"
    />
    <section class="content">
      <div class="section-title">Generate Token</div>
      <div class="hint">Generate Public Access Tokens for your account.</div>
      <div class="panel">
        <van-row style="padding: 10px;">
          <van-button type="info" style="width: 100%" @click="generate">Generate Token for Messenger</van-button>        
        </van-row>
      </div>
      <div class="panel">
        <van-row style="padding: 10px;">
          <pre class="public-access-token"><code v-show="tokenGenerated" ref="token">{{tokenGenerated}}</code><span v-show="tokenGenerated.length === 0" class="hint">Tap "Generate" to generate token</span></pre>
        </van-row>
        <van-row style="padding: 10px;">
          <van-button type="info" plain style="width: 100%" @click="copyToken">Copy Public Access Token</van-button>        
        </van-row>
        <van-row style="padding: 10px;">
          <van-button type="info" plain style="width: 100%" @click="viewAssets">View Assets</van-button>        
        </van-row>
      </div>
      <div class="section-title">Revoke Token</div>
      <div class="hint">Revoke Public Access Token for your account.</div>
      <div class="panel">
        <van-row style="padding: 10px;">
          <van-field placeholder="Your token here." v-model="tokenToRevoke"></van-field>
        </van-row>
        <van-row style="padding: 10px;">
          <van-button type="danger" style="width: 100%" @click="revoke">Revoke Token</van-button>        
        </van-row>
      </div>
    </section>
  </div>
</template>

<script>
import OAuth from '@/utils/oauth_pkce'
import MixinService from '@/service/mixin'
import consts from '@/constants'
import utils from '@/utils'
import { Toast } from 'vant'

export default {
  data () {
    return {
      tokenGenerated: '',
      tokenToRevoke: ''
    }
  },
  components: {
  },
  mounted() {
  },
  methods: {
    back () {
      this.$router.back()
    },
    copyToken () {
      utils.copyEl(this.$refs.token)
    },
    viewAssets () {
      this.$router.push('/tools/assets-viewer?token=' + encodeURIComponent(this.tokenGenerated))
    },
    generate () {
      MixinService.getAssets().then(res => {
        this.tokenGenerated = localStorage.getItem('token')
      })
    },
    revoke () {

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
.public-access-token {
  background: #fafafa;
  padding: 10px;
  font-size: 14px;
  white-space: pre-line;
  word-break: break-all;
}
</style>
