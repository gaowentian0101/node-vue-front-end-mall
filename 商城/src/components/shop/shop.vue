<template>
  <div>
    <div class="slide">
      <el-carousel height="500px">
        <!-- 轮播图 -->
        <el-carousel-item>
          <img src="../../assets/upload/focus1.jpg" alt />
        </el-carousel-item>
        <el-carousel-item>
          <img src="../../assets/upload/focus2.jpg" alt />
        </el-carousel-item>
        <el-carousel-item>
          <img src="../../assets/upload/focus3.jpg" alt />
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="main">
      <div class="search">
        <el-input
          placeholder="请输入内容"
          v-model="getListDataParams.query"
          clearable
          @clear="getListData"
        >
          <el-button slot="append" icon="el-icon-search" @click="getListData"></el-button>
        </el-input>
      </div>
      <el-card
        class="goodsCard"
        v-for="(item, index) in goodsData"
        :key="item.goods_id"
        @click="goToDetail(item.goods_id)"
      >
        <img :src="imgList[index]" @click="goToDetail(item.goods_id)" />
        <p>{{item.goods_name}}</p>
        <p class="price">¥{{item.goods_price}}</p>
      </el-card>
      <el-card class="lastcard"></el-card>
      <el-row></el-row>
    </div>
    <div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getListDataParams.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="getListDataParams.pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        style="text-align: center;"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import '../../assets/css/base.css'
import '../../assets/css/common.css'
import '../../assets/css/index.css'
// import { mapState } from 'vuex'
export default {
  data() {
    return {
      getListDataParams: {
        query: '',
        pagenum: 1,
        pagesize: 9
      },
      goodsData: [],
      total: 0,
      imgList: [],
      loginForm: {
        username: 'admin',
        password: '123456'
      }
    }
  },
  created() {
    this.submitValid()
    // this.getListData()
  },
  methods: {
    goToCart: function() {
      this.$router.push('/cart')
    },
    goDetail: function(row) {
      console.log(row)
      this.$router.push({
        path: `/detail/${row.goods_id}`
      })
    },
    getListData: async function() {
      const { data } = await this.$http.get('goods', {
        params: this.getListDataParams
      })
      // console.log(data)
      if (data.meta.status !== 200) {
        // return this.$message.info('get list data failed')
      }
      this.goodsData = data.data.goods
      await this.eachGoodsId()
      // console.log(this.goodsData)
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
    eachGoodsId: async function() {
      this.imgList = []
      // this.goodsData.forEach(async item => {
      //   await this.pushImgList(item.goods_id)
      // })
      console.log(this.goodsData)
      for (let i = 0; i < this.goodsData.length; i++) {
        await this.pushImgList(this.goodsData[i].goods_id)
      }
    },
    pushImgList: async function(id) {
      // console.log(this.goodsData)
      const { data } = await this.$http.get(`goods/${id}`)
      this.imgList.push(data.data.pics[0].pics_big_url || '') // 返回图片地址添加到图片数组
    },
    goToDetail: function(id) {
      console.log('ha')
      this.$router.push(`detail/${id}`)
    },
    submitValid: async function() {
      const { data } = await this.$http.post('login', this.loginForm)
      if (data.meta.status !== 200) {
      } else {
        window.sessionStorage.setItem('token', data.data.token)
        // this.$router.push('/shop')
        this.getListData()
      }
    }
  }
}
</script>

<style lang='less'>
.nav {
  height: 5px;
}
.lastcard {
  visibility: hidden;
  flex: auto;
  height: 0;
  background-color: pink;
  margin-left: 20px;
}
.goodsCard {
  margin-left: 22px;
  // flex: 1;
  position: relative;
  width: 300px;
  height: 350px;
  margin-bottom: 20px;
  img {
    &:hover {
      cursor: pointer;
    }
    width: 220px;
    height: 250px;
    margin-left: 20px;
    box-sizing: content-box;
  }
  .price {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}
.main {
  transform: translateX(-100px);
  height: 1200px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-content: flex-start;
}
.el-carousel {
  margin: 0 auto !important;
  width: 100%;
  height: 100%;
}
.el-carousel__container {
  width: 100%;
  // height: 370px !important;
  img {
    width: 100%;
    height: 100%;
  }
}
.slide {
  width: 1200px;
  // height: 900px;
  margin: 0 auto;
  // margin-top: 20px;
  margin-bottom: 20px !important;
}
.search {
  position: static!important;
  width: 800px;
  margin-bottom: 20px;
}
</style>