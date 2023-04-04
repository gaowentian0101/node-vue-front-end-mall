<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon :closable="false" center></el-alert>
      <el-steps :space="200" align-center :active="tabActiveName - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top">
        <el-tabs
          :tab-position="'left'"
          v-model="tabActiveName"
          @tab-click="tabClick"
          :before-leave="beforeChangeTab"
        >
          <!-- tab = 0 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateData"
                :props="{
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                    }"
                @change="cascaderChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- tab = 1 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in dynamicParams" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(subitem, subindex) in item.attr_vals"
                  :key="subindex"
                  :label="subitem"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- tab = 2 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in staticAttributes"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
              <!-- <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(subitem, subindex) in item.attr_vals"
                  :key="subindex"
                  :label="subitem"
                  border
                ></el-checkbox>
              </el-checkbox-group>-->
            </el-form-item>
          </el-tab-pane>
          <!-- tab = 3 -->
          <!-- upload component use an individual axios, so that individual url and token need to be set -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="picUploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="picUploadSuccess"
              :on-error="picUploadError"
              :headers="picUploadHeaderConfig"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- tab = 4 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor class="editor" v-model="addForm.goods_introduce" />
            <el-button @click="submitAddForm">Add item</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- pic preview -->
    <el-dialog title="preview" :visible.sync="previewVisible" width="50%">
      <img :src="previewURL" alt />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabActiveName: '0',
      //   form data waiting to submit
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      //   form rules
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      //   cate data got from DB
      cateData: [],
      //    selected cascader's value(Array)
      dynamicParams: [],
      staticAttributes: [],
      picUploadURL: 'http://127.0.0.1:8000/api/private/v1/upload',
      picUploadHeaderConfig: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewURL: '',
      previewVisible: false
    }
  },
  computed: {
    cateId: function() {
      return this.addForm.goods_cat.length === 3
        ? this.addForm.goods_cat[2]
        : null
    }
  },
  created() {
    this.getCateData()
  },
  methods: {
    // when tab change
    tabClick: function() {
      console.log(this.tabActiveName)
    //   if (this.tabActiveName === '1') {
    //     this.getParams('many')
    //   } else if (this.tabActiveName === '2') {
    //     this.getParams('only')
    //   }
    },
    // receiving data from DB and giving to cascader
    getCateData: async function() {
      const { data } = await this.$http.get('categories')
      console.log(data)
      if (data.meta.status !== 200) {
        return this.$message.info('data get failed')
      }
      this.cateData = data.data
    },
    // when select a option from cascader , only level3 can be selected
    cascaderChange: function() {
        console.log(this.addForm.goods_cat)
      this.addForm.goods_cat =
        this.addForm.goods_cat.length === 3 ? this.addForm.goods_cat : []
        // giving data to dynamic and static
        this.getParams('many')
        this.getParams('only')
    },
    beforeChangeTab: function(to, from) {
      if (from === '0') {
        console.log('length=' + this.addForm.goods_cat.length)
        console.log(this.addForm.goods_cat)
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.error('category need to be selected')
          return false
        }
      }
    },
    // when tabActiveName = 1 & 2
    getParams: async function(type) {
      const { data } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: type
          }
        }
      )
    //   console.log(data)
      if (data.meta.status !== 200) {
        return this.$message.info('data get failed')
      }
      if (type === 'many') {
        //   attr_vals string turn into array
        data.data.forEach(item => {
          item.attr_vals = item.attr_vals.split(',')
        })
        this.dynamicParams = data.data
        console.log(this.dynamicParams)
      } else {
        // staticAttributes dosent expected to receive string or number ,not array
        this.staticAttributes = data.data
        console.log(this.staticAttributes)
      }
    },
    // pic motions
    picUploadSuccess: function(response) {
      console.log(response)
      if (response.meta.status !== 200) {
        return this.$message.info('pic upload failed')
      }
      // why tmp_path not url?
      const picParams = { pic: response.data.tmp_path }
      this.addForm.pics.push(picParams)
      console.log(this.addForm)
    },
    picUploadError: function(err) {
      console.log('this is error')
      console.log(err)
    },
    handlePreview: function(file) {
      this.previewVisible = true
      console.log(file)
      this.previewURL = file.response.data.url
    },
    handleRemove: function(file) {
      console.log(this.addForm.pics)
      // console.log(file.response.data.tmp_path)
      const i = this.addForm.pics.findIndex(
        item => item.pic === file.response.data.tmp_path
      )
      // console.log(i)
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm.pics)
    },
    submitAddForm: function() {
        this.$refs.addFormRef.validate(async isValid => {
            if (!isValid) {
                return this.$message.info('please complete the form')
            }
            // fomat form to meet api document
            this.dynamicParams.forEach(item => {
                const paramsData = {
                attr_id: item.attr_id,
                attr_value: item.attr_vals.join(',')
                }
                this.addForm.attrs.push(paramsData)
            })
            this.staticAttributes.forEach(item => {
                const paramsData = {
                attr_id: item.attr_id,
                attr_value: item.attr_vals
                }
                this.addForm.attrs.push(paramsData)
            })
            // console.log(this.dynamicParams)
            // console.log(this.staticAttributes)
            this.addForm.goods_cat = this.addForm.goods_cat.join(',')
            console.log(this.addForm)
            const { data } = await this.$http.post('goods', this.addForm)
            console.log(data)
            if (data.meta.status !== 201) {
                return this.$message.error('add item failed')
            }
            this.$router.push('/goods')
            this.$message.success('add item successful')
        })
    }
  }
}
</script>
<style lang='less' scoped>
.el-step {
  margin: 15px 0;
}
</style>