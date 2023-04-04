<!--  -->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      <table-tree
        :data="tableTreeData"
        :columns="tableTreeColumns"
        show-index
        index-text="#"
        border
        :expand-type="false"
        :selection-type="false"
      >
        <template v-slot:avilable="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted == false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else-if="scope.row.cat_deleted == true" style="color:red"></i>
        </template>
        <template v-slot:level="scope">
          <el-tag v-if="scope.row.cat_level == 0">level 1</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level == 1">level 2</el-tag>
          <el-tag type="warning" v-else-if="scope.row.cat_level == 2">level 3</el-tag>
        </template>
        <template v-slot:options>
          <!-- <el-button type="primary" icon="el-icon-edit" size="mini">edit</el-button> -->
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </table-tree>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getCateDataParams.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="getCateDataParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalDataNum"
      ></el-pagination>
    </el-card>
    <el-dialog
      title="添加商品分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="closeAddCateDialog"
    >
      <el-form
        :model="addCateParams"
        :rules="addCateRules"
        ref="addCateRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label-width="130px" label="分类名称:" prop="cat_name">
          <el-input v-model="addCateParams.cat_name"></el-input>
        </el-form-item>
        <el-form-item label-width="130px" label="父级分类:">
          <el-cascader
            v-model="addCateParams.cat_pid"
            :options="parentCateData"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddCateForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      getCateDataParams: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      totalDataNum: 0,
      tableTreeData: [],
      tableTreeColumns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '可使用',
          type: 'template',
          template: 'avilable'
        },
        {
          label: '分类等级',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'options'
        }
      ],
      addCateDialogVisible: false,
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateData: [],
      addCateParams: {
        cat_pid: [],
        cat_name: '',
        cat_level: 0
      },
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      }
    }
  },
  created() {
    this.getCateData()
  },
  methods: {
    getCateData: async function() {
      const { data } = await this.$http.get('categories', {
        params: this.getCateDataParams
      })
      console.log(data)
      if (data.meta.status !== 200) {
        return this.$message.info('cata data get failed')
      }
      this.totalDataNum = data.data.total
      this.tableTreeData = data.data.result
    },
    handleSizeChange: function(size) {
      // console.log(size)
      this.getCateDataParams.pagesize = size
      this.getCateData()
    },
    handleCurrentChange: function(page) {
      // console.log(page)
      this.getCateDataParams.pagenum = page
      this.getCateData()
    },
    showAddCateDialog: function() {
      this.addCateDialogVisible = true
      this.getParentCateData() // get level 1,2 cate data
    },
    closeAddCateDialog: function() {
      this.addCateDialogVisible = false
      this.$refs.addCateRef.resetFields()
      this.addCateParams.cat_pid = []
      this.addCateParams.cat_name = ''
      this.addCateParams.cat_level = 0
    },
    getParentCateData: async function() {
      const { data } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (data.meta.status !== 200) {
        return this.$message.info('cate data get failed')
      }
      this.parentCateData = data.data
      console.log(data.data)
    },
    parentCateChange: function(value) {
      this.addCateParams.cat_level = this.addCateParams.cat_pid.length
      if (this.addCateParams.cat_pid.length - 1 >= 0) {
        this.addCateParams.cat_pid = this.addCateParams.cat_pid[this.addCateParams.cat_pid.length - 1]
      } else {
        this.addCateParams.cat_pid = 0
      }
      console.log(this.addCateParams)
    },
    submitAddCateForm: function() {
        if (typeof this.addCateParams.cat_pid === 'object') {
          this.addCateParams.cat_pid = 0
          }
        this.$refs.addCateRef.validate(async isValid => {
          if (!isValid) {
            return this.$message.info('表单有不符合规定的项')
          }
          const { data } = await this.$http.post('categories', this.addCateParams)
          if (data.meta.status !== 201) {
            return this.$message.info('add category failed')
          }
          this.$message.success('add category successful')
          this.addCateDialogVisible = false
          this.getCateData()
        })
    }
  }
}
</script>
<style lang='less' scoped>
.el-cascader {
  width: 100%;
}
</style>