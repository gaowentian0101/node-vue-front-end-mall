<template>
  <div>
    <h2>我的信息</h2>
    <h3>
      用户名：{{userInfo.username}}
    </h3>
    <h3>
      电话：{{  userInfo.mobile}}
    </h3>
    <h3>
      e-mail: {{userInfo.email}}
    </h3>
    <el-card>
      <h2>我的订单</h2>
      <el-table :data="ordersData" border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单号" width="280px"></el-table-column>
        <el-table-column prop="order_price" label="订单金额"></el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100px"></el-table-column>
        <!-- <el-table-column label="create_time">
          <template v-slot="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column> -->
        <!-- <el-table-column label="options">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editAddress(scope.row)"></el-button>
            <el-button
              type="success"
              icon="el-icon-location-outline"
              @click="checkLogiInfo(scope.row)"
            ></el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      ordersData: []
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    getOrdersData: async function() {
      const { data } = await this.$http.get('orders', {
        params: {
          user_id: this.userInfo.id,
          pagenum: 1,
          pagesize: 10
        }
      })
      if (data.meta.status !== 200) {
        return this.$message.info('data get failed')
      }
      console.log('orderData in my.vue:', data)
      this.ordersData = data.data.goods
    }
  },
  created() {
    this.getOrdersData()
  }
}

</script>

<style lang='scss' scoped>

</style>