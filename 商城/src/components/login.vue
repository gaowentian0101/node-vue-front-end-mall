<!--  -->
<template>
  <div id="login_container">
    <div class="form-box">
      <div class="avatar-box">
        <img src="../assets/img/logo.png" alt />
      </div>
      <el-form ref="loginForm" label-width="0px" class="login-form" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima"  type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="submitValid">登陆</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, message: '请输入username', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入password', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
      resetForm: function () {
        console.log(this.$refs.loginForm)
        // this.$refs.loginForm.resetFields()
      },
      submitValid: function () {
        this.$refs.loginForm.validate(async valid => {
          if (!valid) {
            return false
          }
          const { data } = await this.$http.post('login', this.loginForm)
          if (data.meta.status !== 200) {
            this.$message.error('username or password is not correct')
          } else {
            this.$message.success('login successful')
            window.sessionStorage.setItem('token', data.data.token)
            this.$router.push('/welcome')
          }
        })
      }
  }
}
</script>
<style lang='less' scoped>
#login_container {
  background-color: #aaaaaa;
  width: 100%;
  height: 100%;
}
.form-box {
  height: 300px;
  width: 450px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avatar-box {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    box-shadow: 0 0 10px #eee;
    border: 1px solid #eee;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login-form {
    position: absolute;
    width: 100%;
    bottom: 0;
    padding: 20px;
    box-sizing: border-box;
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
  .el-form-item {
    width: 400px !important;
  }
}
</style>
