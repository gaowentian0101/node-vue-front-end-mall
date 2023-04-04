<template>
  <div>
    <div class="c-container" v-if="items.length > 0">
      <div class="w">
        <div class="cart-filter-bar">
          <em>全部商品</em>
        </div>
        <!-- 购物车主要核心区域 -->
        <div class="cart-warp">
          <!-- 头部全选模块 -->
          <!-- 商品详细模块 -->
          <div class="cart-item-list">
            <el-table
              ref="multipleTable"
              :data="items"
              tooltip-effect="dark"
              style="width: 100%"
            >
              <el-table-column prop="pic" label="商品" width="120">
                <template v-slot="scope">
                  <img :src="scope.row.pic" class="itemimg" />
                </template>
              </el-table-column>
              <el-table-column prop="name" label="名称" width="500"></el-table-column>
              <el-table-column prop="price" label="单价" width="200"></el-table-column>
              <el-table-column prop="num" label="数量" width="200">
                <template v-slot="scope">
                  <el-input-number size="mini" v-model="scope.row.num"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template v-slot="scope">
                  <el-button @click="sub(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 结算模块 -->
          <div class="cart-floatbar">
            <div class="toolbar-right">
              <div class="amount-sum">
                已经选
                <em>{{this.$store.getters.totalItem}}</em>件商品
              </div>
              <div class="price-sum">
                总价：
                <em>{{this.$store.getters.sum}}</em>
              </div>
              <div class="btn-area" @click="checkout">去结算</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="notice" v-else>
      <!--<h1>您的购物车是空的</h1>-->
      <!--<h2><a href="javascript:;" style="color: red;" @click="goShop">继续购物</a></h2>-->
    </div>
  </div>
</template>

<script>
import '../../assets/css/base.css'
import '../../assets/css/common.css'
import '../../assets/css/car.css'
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      checkAll: false,
      checkedCities: ['上海', '北京']
    }
  },
  computed: {
    ...mapState(['items']),
    // 结算参数
    checkoutParams: function() {
      const checkoutParams = {
        user_id: '1',
        order_price: 0,
        goods: []
      }
      this.items.forEach(item => {
        // 订单总价
        checkoutParams.order_price += item.price
        // 订单商品
        const good = {
          goods_id: item.id,
          goods_price: item.price,
          goods_number: item.num
        }
        checkoutParams.goods.push(good)
      })
      return checkoutParams
    }
  },
  created() {
      console.log(this.items)
  },
  methods: {
    ...mapMutations(['sub']),
    goShop: function() {
      this.$router.push('shop')
    },
    // 结算提交
    checkout: async function() {
      const { data } = await this.$http.post('orders', this.checkoutParams)
      console.log(data)
      console.log(this.checkoutParams)
    }
  }
}
</script>
<style lang='less'>
.itemimg {
    height: 100px;
    width: 100px;
}
.notice {
  box-sizing: border-box;
  padding: 20px 0;
  float: left;
  width: 800px;
  height: 300px;
}
</style>
