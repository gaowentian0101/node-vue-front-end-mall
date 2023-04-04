import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    items: [],
    userInfo: {
      isLogin: false
    }
  },
  mutations: {
    add: function(state, step) {
      // 查询相同id商品是否已存在
      const isExist = state.items.some(i => i.id === step.id)
      // 如果已存在，商品数量叠加
      if (isExist) {
        state.items.some(i => {
          if (i.id === step.id) {
            i.num = i.num + step.num
          }
          return true
        })
      } else {
        // 如果不存在，添加新商品
        state.items.push(step)
      }
    },
    sub: function(state, step) {
      const a = state.items.findIndex(i => i.id === step)
      // console.log(a)
      state.items.splice(a, 1)
    },
    suball: function(state, step) {
      state.items = []
    },
    loginMutation: function(state, step) {
      state.userInfo.isLogin = true
      Object.assign(state.userInfo, step)
      console.log('userInfo in vuex:', state.userInfo)
    },
    clearCart: function (state) {
      this.state.items = []
    },
    logoutMutation: function (state) {
      state.userInfo = {
        isLogin: false
      }
    }
  },
  actions: {
  },
  getters: {
    totalItem: function(state) {
      let total = 0
      state.items.forEach(item => {
        total += item.num
      })
      return total
    },
    sum: function(state) {
      let sum = 0
      state.items.forEach(item => {
        sum += item.num * item.price
      })
      return sum
    }
  },
  modules: {
  }
})
