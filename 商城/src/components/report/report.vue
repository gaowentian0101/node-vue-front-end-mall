<template>
  <div>
    <el-card>
        <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
    }
  },
  async mounted() {
    const { data } = await this.$http.get('reports/type/1')
    const myChart = echarts.init(document.getElementById('main'))
    myChart.setOption(data.data)
  },
  created() {
  },
  methods: {
    }
}
</script>
<style lang='less' scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>