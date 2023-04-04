<template>
  <div>

    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="name">
        <el-input v-model="ruleForm.name" width="800px"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登陆</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        name: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位电话号码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' }
        ],
        pass: [{ validator: validatePass, trigger: 'blur', required: true }],
        checkPass: [{ validator: validatePass2, trigger: 'blur', required: true }]
      }
    }
  },

  components: {},

  computed: {},

  created() {},

  methods: {
    ...mapMutations(['loginMutation']),
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) {
          this.$message.info('请按要求填写信息')
          return false
        }
        const { data } = await this.$http.post('login', {
            username: this.ruleForm.name,
            password: this.ruleForm.pass
          })
        console.log('data in login:', data)
        if (data.meta.status !== 200) {
          this.$message.success('登陆失败')
          return
        }
        console.log('data', data)
        this.$message.success('登陆成功')
        this.loginMutation(data.data)
        window.sessionStorage.setItem('token', data.data.token)
        this.goShop()
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    goShop: function() {
      this.$router.push('/shop')
    }
  }
}
</script>
<style lang='less'>
.el-form-item {
  width: 500px;

}
</style>
