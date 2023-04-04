<!--  -->
<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/img/logo.png" style="width: 100px;"/>
        <span>后台管理系统</span>
      </div>
      <div>
        <el-button type="info" @click="logout">注销</el-button>
      <el-button type="primary" @click="goShop">返回商城</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '65px' : '200px'">
        <el-menu
          background-color="F0F0F0"
          text-color="#000000"
          active-text-color="#000000"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activeItem"
        >
          <div class="foldControl" @click="toggleCollapse">|||</div>
          <!-- main menu -->
          <el-submenu :index="item.id+''" v-for="(item, index) in menuList" :key="item.id">
            <template slot="title">
              <i :class="menuIcon[index]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- meue items -->
            <el-menu-item v-for="subitem in item.children" :key="subitem.id" :index="'/' + subitem.path" @click="saveActive('/' + subitem.path)">
              <i class="el-icon-setting"></i>
              <span>{{subitem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      menuIcon: [
        'iconfont icon-users',
        'iconfont icon-tijikongjian',
        'iconfont icon-shangpin',
        'iconfont icon-danju',
        'iconfont icon-baobiao'
      ],
      isCollapse: false,
      activeItem: ''
    }
  },

  // components: {},

  // computed: {},

  async created () {
    const { data } = await this.$http.get('menus')
    this.menuList = data.data
    this.menuList.splice(this.menuList.length - 1)
    this.menuList.splice(1, 1)
    console.log(this.menuList)
    this.activeItem = window.sessionStorage.getItem('activeItem')
  },
  methods: {
    logout: function () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleCollapse: function () {
      this.isCollapse = !this.isCollapse
    },
    saveActive: function (activeItem) {
      this.activeItem = activeItem
      window.sessionStorage.setItem('activeItem', activeItem)
    },
    goShop: function() {
      this.$router.push('/shop')
    }
  }
}
</script>
<style lang='less' scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #BEBEBE;
  align-items: center;
  div {
    color: white;
    font-size: 20px;
    display: flex;
    align-items: center;
    span {
      padding-left: 10px;
    }
  }
}
.el-aside {
  background-color: #e0e0e0;
}
.el-main {
  background-color: #f0f0f0;
}

.el-menu {
  border-right: 0;
  .foldControl {
    background-color: #e0e0e0;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  i {
    margin-right: 10px;
  }
}
</style>
