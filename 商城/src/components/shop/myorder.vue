<template>
  <div>
    {{userInfo}}
    <!-- <el-table
    :data="tableData"
    stripe
    style="width: 100%">
    <el-table-column
      prop="date"
      label="日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
  </el-table> -->
  </div>
</template>

<script>
import '../../assets/css/base.css'
import '../../assets/css/common.css'
import '../../assets/css/detail.css'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      orderList: []
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  created() {
    this.getOrderList()
  },
  methods: {
    getOrderList: async function () {
      const { data } = await this.$http.get('orders', {
        params: {
          pagesize: 10,
          pagenum: 1,
          user_id: this.userInfo.id
        }
      })
      console.log(data)
    },
    goToCart: function() {
      this.$router.push('/cart')
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
