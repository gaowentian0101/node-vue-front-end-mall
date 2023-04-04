<template>
  <div>
    <div class="de_container w">
      <!-- 产品介绍模块 -->
      <div class="product_intro clearfix">
        <!-- 预览区域 -->
        <div class="preview_wrap fl">
          <div class="preview_img">
            <img :src="goodData.pics[0].pics_mid_url" alt />
          </div>
        </div>
        <!-- 产品详细信息 -->
        <div class="itemInfo_wrap fr">
          <div class="sku_name">
            <h2>{{goodData.goods_name}}</h2>
          </div>
          <div class="summary">
            <dl class="summary_price">
              <dt>价格</dt>
              <dd>
                <i class="price">￥{{goodData.goods_price}}</i>
              </dd>
            </dl>
            <div class="choose_btns">
              <el-input-number v-model="num" :min="1" :max="10" label="描述文字"></el-input-number>
              <a href="javascript:;" class="addcar" @click="addItem">加入购物车</a>
            </div>
          </div>
        </div>
      </div>
      <div class="product_detail clearfix">
        <!-- aside -->
        <div class="aside fl">

        </div>
        <!-- detail -->
        <div class="detail fr">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="商品详情" name="first">
              <h1 v-html="this.goodData.goods_introduce">
              </h1>
              <ul class="item_info">
                <li v-for="(item, index) in goodData.pics" :key="index">
                    <img :src="item.pics_big_url" alt="">
                </li>
              </ul>
            </el-tab-pane>

          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '../../assets/css/base.css'
import '../../assets/css/common.css'
import '../../assets/css/detail.css'
import { mapMutations, mapState } from 'vuex'

export default {
  data() {
    return {
      goodData: [],
      activeName: 'first',
      num: 0
    }
  },
  computed: {
    ...mapState(['userInfo'])
    // ...mapState(['sum'])
  },
  created() {
    // const p = this.$route.params.id
    // console.log(p)
    this.getGoodsData()
    console.log(this.goodData)
  },
  methods: {
    ...mapMutations(['add']),
    handleClick: function() {
      console.log(this.activeName)
    },
    getGoodsData: async function() {
      const p = this.$route.params.id
      const { data } = await this.$http.get(`goods/${p}`)
      this.goodData = data.data
      console.log(this.goodData)
    },
    goToCart: function() {
      this.$router.push('/cart')
    },
    addItem: function() {
        if (!this.userInfo.isLogin) {
          this.$message.info('请先登陆')
          return
        }
        const newItem = {
            id: this.goodData.goods_id,
            name: this.goodData.goods_name,
            price: this.goodData.goods_price,
            num: this.num,
            pic: this.goodData.pics[0].pics_big_url
        }
        this.add(newItem)
        console.log(this.$store.state.items)
    },
    goShop: function() {
      this.$router.push('/shop')
    }
  }
}
</script>
<style lang='less'>
.choose_btns {
    display: flex;
    justify-content: start;
    align-items: center;
}
.product_intro {
  height: 450px;
  .preview_wrap {
    height: 450px;
  }
}
.comment {
    li {
        div {
            border: 1px gray solid;
            height: 100px;
            width: 800px;
            .content {
                margin-left: 50px;
                font-size: 14px;
            }
            img {
                border: 1px black solid;
                height: 50px;
                width: 50px;
                margin-top: 20px;
                margin-left: 20px;
            }
        }
    }
}
.preview_img {
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
