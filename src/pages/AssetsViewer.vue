<template>
  <div class="container">
    <van-nav-bar
      title=""
      left-text="Back"
      left-arrow
      @click-left="back"
    />
    <section class="content">
      <van-search
        placeholder="Paste Account Token Here"
        shape="round"
        @search="doSearch"
        v-model="searchValue"
      ></van-search>

      <div class="section-title">Total</div>
      <div class="panel">
        <van-cell title="Estimated Value">
          ${{totalAmountUsd.toLocaleString()}}
        </van-cell>
      </div>

      <div class="section-title">Assets</div>
      <div class="panel">
        <van-field placeholder="filter asset" v-model="filterQuery"></van-field>
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
import { Search } from "vant";
import AssetItem from '@/components/AssetItem'
import MixinService from '@/service/mixin'
export default {
  components: {
    "van-search": Search,
    AssetItem
  },
  data () {
    return {
      assets: [],
      filterQuery: '',
      totalAmountUsd: 0,
      searchValue: ""
    }
  },
  mounted () {
    if (this.$route.query.token) {
      this.loadAssets(this.$route.query.token)
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

    },
    loadAssets(token) {
      localStorage.setItem('token', token)
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
    },
    doSearch() {
      let searchValue = this.searchValue.trim();
      if (
        /^[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9\-_]+$/.test(searchValue)
      ) {
        this.loadAssets(searchValue)
      } else {
        alert("unsupported query");
      }
    },
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
