<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="getListDataParams.query"
            clearable
            @clear="getListData"
          >
            <el-button slot="append" icon="el-icon-search" @click="getListData"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddItemPage">Add Item</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table :data="goodsData" border style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="goods_name" label="Goods Name" width="auto"></el-table-column>
          <el-table-column prop="goods_price" label="Goods Price(¥)" width="100px"></el-table-column>
          <el-table-column prop="goods_weight" label="Goods Weight(kg)" width="100px"></el-table-column>
          <el-table-column prop="add_time" label="Created Date" width="160px">
            <template v-slot="scope">{{scope.row.add_time | dateFormat}}</template>
          </el-table-column>
          <el-table-column label="Operations" width="120px">
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteGood(scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="getListDataParams.pagenum"
          :page-sizes="[3, 5, 10, 20]"
          :page-size="getListDataParams.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      getListDataParams: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsData: [],
      total: 0
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    getListData: async function() {
      const { data } = await this.$http.get('goods', {
        params: this.getListDataParams
      })
      console.log(data)
      if (data.meta.status !== 200) {
        return this.$message.info('get list data failed')
      }
      this.goodsData = data.data.goods
      this.total = data.data.total
    },
    handleSizeChange: function(size) {
      // console.log(size)
      this.getListDataParams.pagesize = size
      this.getListData()
    },
    handleCurrentChange: function(page) {
      // console.log(page)
      this.getListDataParams.pagenum = page
      this.getListData()
    },
    goAddItemPage: function() {
      this.$router.push('goods/add')
    },
    deleteGood: async function(row) {
      const { data } = await this.$http.delete(`goods/${row.goods_id}`)
      console.log(data)
      this.getListData()
    }
  }
}
</script>
<style lang='less' scoped>
</style>