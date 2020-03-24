<template>
  <div class="node-cache-item" :class="isRemoved ? 'removed' : '' ">
    <table>
      <thead>
        <tr>
          <th>Node</th>
          <th>
            <span class="major">{{meta.name}}</span>
            <span class="minor">{{cacheItem.node}}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Round</td>
          <td>{{cacheItem.round}}</td>
        </tr>
        <tr>
          <td>Timestamp</td>
          <td :class="CacheLevel(cacheItem.timestamp)">{{cacheItem.timestamp}} ({{FormatTs(cacheItem.timestamp)}})</td>
        </tr>
        <tr>
          <td>References</td>
          <td>
            External: <a>{{cacheItem.references.external}}</a><br/>
            Self: <a>{{cacheItem.references.self}}</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import UtilsFn from '@/utils/fn'

export default {
  props: ['cacheItem', 'meta', 'isRemoved'],
  data () {
    return {
    }
  },
  methods: {
    CacheLevel: UtilsFn.CacheLevel,
    FormatTs: UtilsFn.FormatTs
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/scss/colors.scss";

.node-cache-item.removed {
  box-shadow: 0 2px 0 0 #e8e8e8, 0 3px 10px 0 rgba(123, 123, 123, 0.2), 0 0px 1px 0 rgba(166, 166, 166, 0.4);
  tr {
    td:last-child {
      color: #aaa !important;
      a {
        color: #aaa !important;
      }
    }
  }
}
.node-cache-item {
  margin: 10px 15px;
  box-shadow: 0 2px 0 0 rgb(92, 198, 255), 0 3px 10px 0 rgba(92, 198, 255, 0.2), 0 0px 1px 0 rgba(92, 198, 255, 0.4);
  border-radius: 10px;

  tr:first-child {
    td {
      border-top: none;
    }
  }
  tr {
    td {
      &.level-0 {
        color: #00b435;
      }
      &.level-1 {
        color: rgb(255, 136, 0);
      }
      &.level-2 {
        color: rgb(136, 0, 7);
      }
    }
  }
}
</style>

