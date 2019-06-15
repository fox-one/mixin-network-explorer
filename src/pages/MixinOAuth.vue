<template>
  <div></div>
</template>

<script>
import OAuth from '@/utils/oauth_pkce'
import { Toast } from 'vant'

export default {
  mounted() {
    const code = this.$route.query.code
    Toast('Loading')
    OAuth.getAccessToken(code).then((res) => {
      window.location.href = '/#/tools/assist?access_token=' + res.access_token
    }).catch((err) => {
      console.log(err)
      Toast('验证失败')
    })
  },
}
</script>
