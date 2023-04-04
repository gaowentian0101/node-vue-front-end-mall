<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="ordersDataParams.query">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersData"
              clearable
              @clear="getOrdersData"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">search order</el-button>
        </el-col>
      </el-row>
      <el-table :data="ordersData" border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="order_number" width="280px"></el-table-column>
        <el-table-column prop="order_price" label="order_price"></el-table-column>
        <el-table-column prop="pay_status" label="pay status" width="100px">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status === 1">paid</el-tag>
            <el-tag type="danger" v-else>unpaid</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="send status" width="100px"></el-table-column>
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
    <!-- address dialog -->
    <el-dialog title="提示" :visible.sync="addressVisible" width="50%" @close="closeAddressDialog">
      <el-cascader v-model="selectedCity" :options="cityOptions" @change="cityChange"></el-cascader>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- logistics dialog -->
    <el-dialog title="logistics dialog" :visible.sync="logisticVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in logiInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityOptions from './citydata.js'
export default {
  data() {
    return {
      ordersDataParams: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      ordersData: [],
      addressVisible: false,
      cityOptions,
      selectedCity: [],
      logisticVisible: false,
      logiInfo: []
    }
  },
  computed: {},
  created() {
    this.getOrdersData()
  },
  methods: {
    //   get orders data from DB
    getOrdersData: async function() {
      const { data } = await this.$http.get('orders', {
        params: this.ordersDataParams
      })
      if (data.meta.status !== 200) {
        return this.$message.info('data get failed')
      }
      console.log(data)
      this.ordersData = data.data.goods
    },
    editAddress: function() {
      this.addressVisible = true
    },
    cityChange: function() {
      console.log(this.selectedCity)
    },
    closeAddressDialog: function() {
      this.selectedCity = []
    },
    checkLogiInfo: async function() {
      const { data } = await this.$http.get('/kuaidi/804909574412544580')
      console.log(data)
      this.logiInfo = data.data
      this.logisticVisible = true
    }
  }
}
</script>
<style lang='less' scoped>
</style>