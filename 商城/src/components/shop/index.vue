<template>
  <div>
    <!-- 顶部快捷导航start -->
    <div class="shortcut">
      <div class="w">
        <div class="fl">
          <ul>
            <li>天天滑板商城欢迎您！</li>
            <li v-if="!userInfo.isLogin">
                <a href="javascript:;" @click.prevent="goLog">请登录</a>
                <a href="javascript:;" class="style-red" @click.prevent="goReg">免费注册</a>
            </li>
            <li v-else>
                <span class="style-red">尊敬的{{userInfo.username}}，欢迎回来</span>
                <a href="javascript:;" @click.prevent="logout">注销</a>
            </li>
          </ul>
        </div>
        <div class="fr">
          <ul>
            <li>
              <a href="javascript:;" @click="goMy" v-if="userInfo.isLogin">我的信息|</a>
              <a href="javascript:;" @click="goAdmin">后台管理系统</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 顶部快捷导航end  -->
    <!-- header制作 -->
    <div class="header w">
      <!-- logo -->
      <div class="logo">
        <img src="../../assets/img/logo.png" class="logo1" @click="goShop" />
      </div>
      <!-- search -->
      <!-- <div class="search">
        <el-input
          placeholder="请输入内容"
          v-model="getListDataParams.query"
          clearable
          @clear="getListData"
        >
          <el-button slot="append" icon="el-icon-search" @click="getListData"></el-button>
        </el-input>
      </div> -->
      <!-- hotwrods -->
      <div class="shopcar" @click="goToCart">
        <i class="car"></i>我的购物车
        <i class="arrow"></i>
        <i class="count">{{this.$store.getters.totalItem}}</i>
      </div>
    </div>
    <!-- header 结束 -->
    <!-- nav start -->
    <div class="nav">
      <div class="w">
        <!--左侧轮播图-->
        <div class="dropdown fl"></div>
        <!-- 右侧轮播图 -->
        <div class="navitems fl"></div>
      </div>
    </div>
    <div class="main">
        <router-view></router-view>
    </div>
    <div class="footer">
      <div class="w">
        <!-- mod_help -->
        <div class="mod_help">
          <dl class="mod_help_item">
            <dt>购物指南</dt>
            <dd>
              <a href="#">购物流程</a>
            </dd>
            <dd>
              <a href="#">会员介绍</a>
            </dd>
            <dd>
              <a href="#">生活旅行/团购</a>
            </dd>
            <dd>
              <a href="#">常见问题</a>
            </dd>

            <dd>
              <a href="#">联系客服</a>
            </dd>
          </dl>
          <dl class="mod_help_item">
            <dt>购物指南</dt>
            <dd>
              <a href="#">购物流程</a>
            </dd>
            <dd>
              <a href="#">会员介绍</a>
            </dd>
            <dd>
              <a href="#">团购</a>
            </dd>
            <dd>
              <a href="#">常见问题</a>
            </dd>

            <dd>
              <a href="#">联系客服</a>
            </dd>
          </dl>
          <dl class="mod_help_item">
            <dt>购物指南</dt>
            <dd>
              <a href="#">购物流程</a>
            </dd>
            <dd>
              <a href="#">会员介绍</a>
            </dd>
            <dd>
              <a href="#">生活旅行/团购</a>
            </dd>
            <dd>
              <a href="#">常见问题</a>
            </dd>
            <dd>
              <a href="#">滑板分类</a>
            </dd>

          </dl>
          <dl class="mod_help_item">
            <dt>购物指南</dt>
            <dd>
              <a href="#">购物流程</a>
            </dd>
            <dd>
              <a href="#">会员介绍</a>
            </dd>
            <dd>
              <a href="#">生活旅行/团购</a>
            </dd>
            <dd>
              <a href="#">常见问题</a>
            </dd>

            <dd>
              <a href="#">联系客服</a>
            </dd>
          </dl>
          <dl class="mod_help_item">
            <dt>购物指南</dt>
            <dd>
              <a href="#">购物流程</a>
            </dd>
            <dd>
              <a href="#">会员介绍</a>
            </dd>
            <dd>
              <a href="#">生活旅行/团购</a>
            </dd>
            <dd>
              <a href="#">常见问题</a>
            </dd>

            <dd>
              <a href="#">联系客服</a>
            </dd>
          </dl>
          <dl class="mod_help_item mod_help_app">
            <dt>帮助中心</dt>
            <dd>
              <img src="upload/erweima.png" alt />
              <p>滑板商城客户端</p>
            </dd>
          </dl>
        </div>

        <!-- mod_copyright  -->
        <div class="mod_copyright">
          <p
            class="mod_copyright_links"
          >关于我们 | 联系我们 | 联系客服 | 商家入驻 | 营销中心 | 滑板商城 | 友情链接 | 销售联盟 | 滑板社区 | 滑板公益 | English Site | Contact U</p>
          <p class="mod_copyright_info">
            地址：新乡学院 邮编：453000 电话：15617972915 传真：0371-123456 邮箱: 2568036095@qq.com

          </p>
        </div>
      </div>
    </div>
    <!-- footer end -->
  </div>
</template>

<script>
import '../../assets/css/base.css'
import '../../assets/css/common.css'
import '../../assets/css/index.css'
// import { mapState, mapMutations } from 'vuex'
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      getListDataParams: {
      }
    }
  },
  methods: {
    ...mapMutations(['logoutMutation', 'clearCart']),
    goToCart: function() {
      this.$router.push('/cart')
    },
    goShop: function() {
      this.$router.push('/shop')
    },
    goReg: function() {
      this.$router.push('/register')
    },
    goLog: function() {
      this.$router.push('/userlogin')
    },
    goAdmin: function() {
      this.$router.push('/Login')
    },
    goMy: function() {
      this.$router.push('/my')
    },
    logout: function() {
      this.logoutMutation()
      this.clearCart()
      window.sessionStorage.clear()
      this.$router.push('/')
    }
  },
  computed: {
    ...mapState(['userInfo'])
  }
}
</script>

<style lang='less'>
.nav {
  height: 5px;
}
.goodsCard {
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
  height: auto;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
body {
  // background: url(../../assets/img/shopback.jpg);
  background-size: 100% 100%;
}
</style>
