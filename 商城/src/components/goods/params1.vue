<!--  -->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数" :closable="false" type="warning"></el-alert>
      <el-cascader
        v-model="cascaderSelectedKeys"
        :options="cateData"
        :props="{
            value: 'cat_id',
            label: 'cat_name',
            children: 'children',
            expandTrigger: 'hover' }"
        @change="cascaderChange"
      ></el-cascader>
      <el-tabs v-model="tabActiveName" @tab-click="tabClick">
        <el-tab-pane label="Dynamic Params" name="many">
          <el-button
            type="primary"
            :disabled="buttonIsNotAvilable"
            @click="AddFormVisible = true"
          >Add Params</el-button>
          <el-table :data="dynamicParams" border style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="deleteTag(scope.row, index)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="inputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="Params Name"></el-table-column>
            <el-table-column label="Options">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >edit</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                >delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="Static Attributes" name="only">
          <el-button
            type="primary"
            :disabled="buttonIsNotAvilable"
            @click="AddFormVisible = true"
          >Add Attributes</el-button>
          <el-table :data="staticAttributes" border style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals" :key="index" closable @close="deleteTag(scope.row, index)">{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="inputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="Params Name"></el-table-column>
            <el-table-column label="Options">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >edit</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row.attr_id)"
                >delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- add-form-dialog -->
    <el-dialog
      :title="'Add ' + titleText"
      :visible.sync="AddFormVisible"
      width="30%"
      @close="clearAddForm"
    >
      <el-form ref="AddFormRef" :model="AddFormData" label-width="auto" :rules="AddFormRules">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="AddFormData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- edit-from-dialog -->
    <el-dialog
      :title="'Add ' + titleText"
      :visible.sync="EditFormVisible"
      width="30%"
      @close="clearEditForm"
    >
      <el-form ref="EditFormRef" :model="EditFormData" label-width="auto" :rules="EditFormRules">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="EditFormData.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateData: [],
      cascaderSelectedKeys: [],
      tabActiveName: 'many',
      dynamicParams: [],
      staticAttributes: [],
      AddFormVisible: false,
      AddFormData: {
        attr_name: ''
      },
      AddFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      EditFormVisible: false,
      EditFormData: {
        attr_name: ''
      },
      EditFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 添加按钮是否可用
    buttonIsNotAvilable: function() {
      if (this.cascaderSelectedKeys.length === 3) {
        return false
      } else {
        return true
      }
    },
    // 添加表单标题名称
    titleText() {
      if (this.tabActiveName === 'many') {
        return 'Dynamic Params'
      }
      return 'Static Attributes'
    }
    // splitedDynamicParams() {
    //     return this.dynamicParams.attr_vals.split(',')
    // }
  },
  created() {
    this.getCateData()
  },
  methods: {
    getCateData: async function() {
      const { data } = await this.$http.get('categories')
      console.log(data)
      if (data.meta.status !== 200) {
        return this.$message.info('cata data get failed')
      }
      this.cateData = data.data
    },
    cascaderChange: function() {
      // this.cascaderSelectedKeys = value
      // console.log(value)
      //   console.log(this.cascaderSelectedKeys)
      this.getCateParams()
    },
    tabClick: function() {
      //   console.log(this.tabActiveName)
      this.getCateParams()
    },
    getCateParams: async function() {
      if (this.cascaderSelectedKeys.length !== 3) {
          this.dynamicParams = []
          this.staticAttributes = []
          return
      }
      const { data } = await this.$http.get(
        `categories/${this.cascaderSelectedKeys[2]}/attributes`,
        {
          params: {
            sel: this.tabActiveName
          }
        }
      )
      console.log(data)
      if (data.meta.status !== 200) {
        return this.$message.info('data get failed')
      }
      data.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          item.inputVisible = false
          item.inputValue = ''
        })
      if (this.tabActiveName === 'many') {
        this.dynamicParams = data.data
        } else {
        this.staticAttributes = data.data
        }
    // ????????????????????????????????????????????????????????????
    // 如下写法会出现bug
    //   if (this.tabActiveName === 'many') {
    //     this.dynamicParams = data.data
    //     this.dynamicParams.forEach(item => {
    //       item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
    //       item.inputVisible = false
    //       item.inputValue = ''
    //     })
    //   } else {
    //     this.staticAttributes = data.data
    //     this.dynamicParams.forEach(item => {
    //       item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
    //       item.inputVisible = false
    //       item.inputValue = ''
    //     })
    //   }
    // ??????????????????????????????????????????????????????????/
    },
    clearAddForm: function() {
      this.$refs.AddFormRef.resetFields()
    },
    submitAddForm: function() {
      this.$refs.AddFormRef.validate(async isValid => {
        if (!isValid) return
        const { data } = await this.$http.post(
          `categories/${this.cascaderSelectedKeys[2]}/attributes`,
          {
            attr_name: this.AddFormData.attr_name,
            attr_sel: this.tabActiveName
          }
        )
        if (data.meta.status !== 201) {
          return this.$message.info('add failed')
        }
        this.$message.success('operation successful')
        this.getCateParams()
        this.AddFormVisible = false
      })
    },
    showEditDialog: function(id) {
      this.getEditData(id)
      this.EditFormVisible = true
    },
    getEditData: async function(id) {
      console.log(this.cascaderSelectedKeys[2])
      console.log(id)
      const { data } = await this.$http.get(
        `categories/${this.cascaderSelectedKeys[2]}/attributes/${id}`,
        {
          params: {
            attr_sel: this.tabActiveName
          }
        }
      )
      if (data.meta.status !== 200) {
        return this.$message.info('get data failed')
      }
      this.EditFormData = data.data
    },
    clearEditForm: function() {
      this.$refs.EditFormRef.resetFields()
    },
    submitEditForm: function() {
      console.log(this.EditFormData)
      this.$refs.EditFormRef.validate(async isValid => {
        if (!isValid) return
        const { data } = await this.$http.put(
          `categories/${this.cascaderSelectedKeys[2]}/attributes/${this.EditFormData.attr_id}`,
          {
            attr_name: this.EditFormData.attr_name,
            attr_sel: this.tabActiveName
          }
        )
        if (data.meta.status !== 200) {
          return this.$message.info('eidt failed')
        }
        this.$message.success('operation successful')
        this.getCateParams()
        this.EditFormVisible = false
      })
    },
    deleteParams: function(id) {
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data } = await this.$http.delete(
            `categories/${this.cascaderSelectedKeys[2]}/attributes/${id}`
          )
          if (data.meta.status !== 200) {
            return this.$message.info('delete failed')
          }
          this.getCateParams()
          this.$message.success('删除成功!')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    showInput: function(row) {
        row.inputVisible = true
        this.$nextTick(_ => {
        this.$refs.inputRef.$refs.input.focus()
      })
    },
    handleInputConfirm: function(row) {
        if (row.inputValue.trim().length === 0) {
            row.inputVisible = false
            row.inputValue = ''
            return
        }
        // console.log(row)
        row.attr_vals.push(row.inputValue)
        // console.log(row.attr_vals.join(','))
        this.saveUpdateIntoDB(row)
    },
    saveUpdateIntoDB: async function(row) {
        const { data } = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`, {
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(',')
        })
        // console.log(data)
        if (data.meta.status !== 200) {
            return this.$message.info('params update failed')
        }
        row.inputVisible = false
        row.inputValue = ''
        this.$message.success('params update successful')
    },
    deleteTag: function(row, index) {
        row.attr_vals.splice(index, 1)
        this.saveUpdateIntoDB(row)
    }
  }
}
</script>
<style lang='less' scoped>
.input-new-tag {
    width: 120px;
}
.el-tag {
  margin: 10px;
}
.cat_opt {
  margin: 15px 0;
}
</style>