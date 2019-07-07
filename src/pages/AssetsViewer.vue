<template>
  <div class="container">
    <van-nav-bar
      title=""
      left-text="Back"
      left-arrow
      @click-left="back"
    />
    <section class="content">
      <div class="section-title">Total</div>
      <div class="panel">
        <van-cell title="Estimated Value">
          ${{totalAmountUsd.toLocaleString()}}
        </van-cell>
      </div>

      <div class="section-title">Assets</div>
      <div class="panel">
        <van-field placeholder="filter asset" v-model="filterQuery" @change="applyFilter"></van-field>
        <van-list
        >
          <van-cell class="asset-cell" v-for="item in filteredAssets">
            <asset-item :asset="item"></asset-item>
          </van-cell>
        </van-list>
      </div>
    </section>
  </div>
</template>

<script>
import AssetItem from '@/components/AssetItem'
import MixinService from '@/service/mixin'
export default {
  components: {
    AssetItem
  },
  data () {
    return {
      assets: [],
      filterQuery: '',
      totalAmountUsd: 0
    }
  },
  mounted () {
    if (this.$route.query.token) {
      localStorage.setItem('token', this.$route.query.token)
      MixinService.getAssets().then(res => {
        this.assets = res.map((x) => {
          x.amountUsd = x.price_usd * x.balance
          this.totalAmountUsd += x.amountUsd
          return x
        })
        this.assets.sort((a, b) => {
          return a.amountUsd < b.amountUsd ? 1 : -1;
        })
      })
    }
  },
  computed: {
    filteredAssets () {
      if (this.filterQuery) {
        return this.assets.filter((x) => {
          return x.symbol.toLowerCase().indexOf(this.filterQuery.toLowerCase()) !== -1
        })
      } else {
        return this.assets
      }
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    applyFilter () {

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
.asset-cell {
  /* border-bottom: 1px solid #eee; */
}
</style>
