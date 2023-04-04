<template>
  <div>
    <el-card>
      <h2>订单结算</h2>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="收货人">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="所在城市">
          <el-cascader
          v-model="form.city"
          :options="cityData"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="具体地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-radio v-model="form.way" label="1">支付宝</el-radio>
          <el-radio v-model="form.way" label="2">微信</el-radio>
        </el-form-item>
      </el-form>
      <div id="pay-area">
        <h2>订单金额{{$route.query.price}}元</h2>
        <el-button type="danger" @click="dialogVisible = true">支付</el-button>
      </div>
    </el-card>
    <el-dialog
      title="扫描二维码完成支付"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <span><img src="../../assets/images/QD.png" id="QD"></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkout">完成支付</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import cityData from '../orders/citydata.js'

export default {
  data() {
    return {
      cityData,
      form: {
        name: '',
        mobile: '',
        city: '',
        address: '',
        way: ''
      },
      dialogVisible: false
    }
  },
  computed: {
    ...mapState(['items', 'userInfo']),
    checkoutParams: function () {
      const checkoutParams = {
        user_id: this.userInfo.id,
        order_price: 0,
        goods: []
      }
      this.items.forEach((item) => {
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
  methods: {
    ...mapMutations(['sub', 'suball']),
    checkout: async function () {
      const { data } = await this.$http.post('orders', this.checkoutParams)
      console.log(data)
      console.log(this.checkoutParams)
      this.dialogVisible = false
      this.$message.success('订单提交成功！')
      this.suball()
      this.$router.push('cart')
    }
  }
}

</script>

<style scoped>
#pay-area {
  display: flex;
  justify-content: flex-end;
}
#QD {
  width: 100%;
  height: 100%;
}
</style>