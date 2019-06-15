<template>
  <div class="container">
    <van-nav-bar
      title=""
      left-text="Back"
      left-arrow
      @click-left="back"
    />
    <section class="content">
      <div class="panel" v-show="showXinPanel">
        <van-cell-group title="XIN Mining Rewards Calculator" class="cell-group">
          <van-cell title="Rewards Vol(XIN)">
            <van-field v-model="miningRewardsForm.rewardVolume"></van-field>
          </van-cell>
          <van-cell title="Rewards %">
            <van-field v-model="miningRewardsForm.yearlyPercent"></van-field>
          </van-cell>
          <van-cell title="Total Nodes">
            <van-field v-model="miningRewardsForm.nodeCount"></van-field>
          </van-cell>
          <van-cell-group title="Result">
            <van-cell v-for="item in miningRewardsResult" :title="item.key">{{item.value}}</van-cell>  
          </van-cell-group>
          <van-row style="padding: 10px;">
            <van-button type="info" style="width: 100%" @click="calMiningRewardForm">Calculate</van-button>        
          </van-row>
        </van-cell-group>
      </div>

      <div class="panel" v-show="showF1Panel">
        <van-cell-group title="F1 Pre-Mining Rewards Calculator" class="cell-group">
          <van-cell title="Daily Rewards">
            <van-field v-model="preMiningRewardsForm.rewardPerDay"></van-field>
          </van-cell>
          <van-cell title="Rewards %">
            <van-field v-model="preMiningRewardsForm.percent"></van-field>
          </van-cell>
          <van-cell title="Total shares(FMC1)">
            <van-field v-model="preMiningRewardsForm.totalParticipates"></van-field>
          </van-cell>
          <van-cell title="Your shares(FMC1)">
            <van-field v-model="preMiningRewardsForm.participates"></van-field>
          </van-cell>
          <van-cell-group title="Result">
            <van-cell v-for="item in preMiningRewardsResult" :title="item.key">{{item.value}}</van-cell>  
          </van-cell-group>
          <van-row style="padding: 10px;">
            <van-button type="info" style="width: 100%" @click="calPreMiningRewardForm">Calculate</van-button>        
          </van-row>
        </van-cell-group>
      </div>

      <div class="panel"  v-show="showThreatenPanel">
        <van-cell-group title="Network Threaten Calculator" class="cell-group">
          <van-cell title="Total Nodes">
            <van-field v-model="threatenForm.totalNode"></van-field>
          </van-cell>
          <van-cell-group title="Result">
            <van-row style="font-size: 12px; padding: 4px 16px;" v-for="item in threatenResult" :title="item.key">{{item.key}}: {{item.value}}</van-row>  
          </van-cell-group>
          <van-row style="padding: 10px;">
            <van-button type="info" style="width: 100%" @click="calThreatenForm">Calculate</van-button>        
          </van-row>
        </van-cell-group>
      </div>
      
    </section>
  </div>
</template>

<script>
import axios from 'axios'

const FULLNODE_CAP = 10000
export default {
  data () {
    return {
      miningRewardsForm: {
        rewardVolume: 450000,
        yearlyPercent: 10,
        nodeCount: 24,
      },
      miningRewardsResult: [],
      preMiningRewardsForm: {
        rewardPerDay: 0.6,
        percent: 50,
        totalParticipates: 500,
        participates: 1
      },
      preMiningRewardsResult: [],
      threatenForm: {
        totalNode: 24,
      },
      threatenResult: [],
      xinPrice: 0,
      xinCap: 0,
      networkCap: 0
    }
  },
  async mounted () {
    const result = await axios.get('https://api.mixin.one/network/assets/top')
    const assets = result.data.data
    assets.forEach((x, index) => {
      // console.log(x.symbol, x.price_usd)
      this.networkCap += parseFloat(x.capitalization)
      if (x.symbol === 'XIN') {
        this.xinPrice = x.price_usd
        this.xinCap = parseFloat(x.capitalization)
      }
    })
  },
  computed: {
    showXinPanel () {
      return this.showPanel('xin')
    },
    showThreatenPanel () {
      return this.showPanel('threaten')
    },
    showF1Panel () {
      return this.showPanel('f1')
    },
  },
  methods: {
    back () {
      this.$router.back()
    },
    showPanel(name) {
      return name === this.$route.params.name
    },
    calMiningRewardForm () {
      let result = {
        dailyRewardsPerNode: 0,
        yearlyRewardsPerNode: 0,
        annualizedRateOfReturn: 0
      }
      let form = this.miningRewardsForm
      result.yearlyRewardsPerNode = (form.rewardVolume * (form.yearlyPercent/100) / form.nodeCount)
      result.dailyRewardsPerNode = result.yearlyRewardsPerNode / 365
      result.annualizedRateOfReturn = (result.yearlyRewardsPerNode/FULLNODE_CAP) * 100
      this.miningRewardsResult = [{
        key: 'Yearly rewards/node',
        value: result.yearlyRewardsPerNode.toFixed(2) + ' XIN'
      }, {
        key: 'Daily rewards/node',
        value: result.dailyRewardsPerNode.toFixed(4) + ' XIN'
      }, {
        key: 'Annualized ROR',
        value: result.annualizedRateOfReturn.toFixed(2) + '%'
      }]
    },
    calPreMiningRewardForm () {
      let result = {
        dailyRewards: 0,
        yearlyRewards: 0,
        annualizedRateOfReturn: 0
      }
      let form = this.preMiningRewardsForm
      result.dailyRewards = (form.rewardPerDay * (form.percent/100) / form.totalParticipates)
      result.yearlyRewards = result.dailyRewards * 365
      result.annualizedRateOfReturn = (result.yearlyRewards/1) * 100
      this.preMiningRewardsResult = [{
        key: 'Yearly rewards/share',
        value: result.yearlyRewards.toFixed(8) + ' XIN'
      }, {
        key: 'Daily rewards/share',
        value: result.dailyRewards.toFixed(8) + ' XIN'
      }, {
        key: 'Annualized ROR',
        value: result.annualizedRateOfReturn.toFixed(2) + '%'
      }, {
        key: 'Annualized return',
        value: (result.yearlyRewards * form.participates).toFixed(6) + 'XIN'
      }]
    },
    calThreatenForm () {
      const nodeCap = 10000
      const totalNode = this.threatenForm.totalNode
      const find_f_in_pbft = () => {
        for (let f = 0; f < totalNode; f++) {
          if (((3*f+1) <= totalNode) && ((3 * f + 4) > totalNode)) {
            return f
          }
        }
        return 0
      }
      const minimum_nodes_attack_mixin = () => {
        return find_f_in_pbft() + 1
      }
      const minimum_nodes_control_mixin = () => {
        return find_f_in_pbft() * 2 + 1
      }
      const node2Token = (nodeCount) => nodeCount * nodeCap

      const miniXin2StopMixin = node2Token(minimum_nodes_attack_mixin())
      const miniXin2CtrlMixin = node2Token(minimum_nodes_control_mixin())
      this.threatenResult = [{
        key: '🚫',
        value: 'Need ' + miniXin2StopMixin + ' XIN ($' + (miniXin2StopMixin * this.xinPrice).toLocaleString() + ') to stop Mixin',
      }, {
        key: '㊙️',
        value: 'Need ' + miniXin2CtrlMixin + ' XIN ($' + (miniXin2CtrlMixin * this.xinPrice).toLocaleString() + ') to control Mixin',
      }, {
        key: '💰',
        value: 'Assets in Mixin: $' + (this.networkCap - this.xinCap).toLocaleString() + '',
      }]
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
