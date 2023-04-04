<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- header -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="usersParams.query" clearable @clear="clearFilter">
            <el-button slot="append" icon="el-icon-search" @click="dataFilter"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible = true">add user</el-button>
        </el-col>
      </el-row>
      <!-- list -->
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="username"></el-table-column>
        <el-table-column prop="email" label="email"></el-table-column>
        <el-table-column prop="mobile" label="mobile"></el-table-column>
        <el-table-column prop="role_name" label="rolename"></el-table-column>
        <el-table-column label="state">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="stateChange(scope.row)"></el-switch>
            <!-- scope.row??????---为什么没有定义slot????????????????????????????? -->
          </template>
        </el-table-column>
        <el-table-column label="options" width="180px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editUser(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete-solid"
              size="mini"
              @click="delUser(scope.row.id)"
            ></el-button>
            <el-tooltip content="roles assign" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                size="mini"
                @click="showRoleAssignDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="pageChange"
        :current-page="usersParams.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="usersParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total - 0"
      ></el-pagination>
    </el-card>
    <!-- add user dialog -->
    <el-dialog title="add user" :visible.sync="dialogVisible" width="50%" @close="clearAddForm">
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px">
        <el-form-item label="username" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="password" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="mobile" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- eidt user dialog -->
    <el-dialog
      title="edit user"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="clearEditForm"
    >
      <el-form :model="editForm" :rules="addRules" ref="editFormRef" label-width="100px">
        <el-form-item label="username" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="mobile" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm(editForm.id)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- role assign dialog -->
    <el-dialog
      title="role assign"
      :visible.sync="roleAssignDialogVisible"
      width="50%"
      @close="closeRoleAssignDialog"
    >
      <p>current user: {{selectedUserInfo.username}}</p>
      <p>current role: {{selectedUserInfo.role_name}}</p>
      <p>new role:
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
          v-for="item in rolesListData"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
          ></el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleAssignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRoleAssign">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (!emailReg.test(value)) {
        return callback(new Error('email doesnt meet the requirement'))
      }
      callback()
    }
    var checkMobile = (rule, value, callback) => {
      const mobilelReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (!mobilelReg.test(value)) {
        return callback(new Error('mobileNumber doesnt meet the requirement'))
      }
      callback()
    }
    return {
      tableData: [],
      usersParams: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: '',
      dialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      addRules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入email', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入mobileNum', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      roleAssignDialogVisible: false,
      rolesListData: [],
      selectedRoleId: '',
      selectedUserInfo: {}
    }
  },

  created() {
    this.getUsersData()
  },

  components: {},

  computed: {},

  methods: {
    getUsersData: async function() {
      const { data } = await this.$http.get('users', {
        params: this.usersParams
      })
      if (data.meta.status !== 200) {
        this.$message.info(data.meta.msg)
      }
      this.tableData = data.data.users
      this.total = data.data.total
      // console.log(this.tableData)
      // console.log(data)
    },
    pageSizeChange: function(pagesize) {
      // console.log(pagesize)
      this.usersParams.pagesize = pagesize
      this.getUsersData()
    },
    pageChange: function(page) {
      // console.log(page)
      this.usersParams.pagenum = page
      this.getUsersData()
    },
    stateChange: async function(data) {
      // console.log(data)
      const res = await this.$http.put(
        `users/${data.id}/state/${data.mg_state}`
      )
      // console.log(res.status)
      if (res.status !== 200) {
        this.mg_state = !this.mg_state
        return this.$message.error('status change failed')
      }
      this.$message.success('status change successful')
      this.getUsersData()
    },
    dataFilter: function() {
      console.log(this.usersParams.query)
      this.getUsersData()
    },
    clearFilter: function() {
      this.getUsersData()
    },
    clearAddForm: function() {
      this.dialogVisible = false
      this.$refs.addFormRef.resetFields()
    },
    clearEditForm: function() {
      this.editDialogVisible = false
      this.$refs.editFormRef.resetFields()
    },
    submitAddForm: function() {
      this.$refs.addFormRef.validate(async isValid => {
        if (!isValid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        this.dialogVisible = false
        this.getUsersData()
      })
      // dialogVisible = false
    },
    editUser: async function(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('get data failed')
      }
      this.editForm = res.data
      // console.log(this.editForm)
      this.editDialogVisible = true
    },
    submitEditForm: function(id) {
      this.$refs.editFormRef.validate(async isValid => {
        if (!isValid) return
        const { data: res } = await this.$http.put('users/' + id, this.editForm)
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('edit用户失败！')
        }
        this.$message.success('edit用户成功！')
        this.editDialogVisible = false
        this.getUsersData()
      })
    },
    delUser: function(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data } = await this.$http.delete('users/' + id)
          if (data.meta.status !== 200) {
            return this.$message.info('delete user failed')
          }
          this.$message.success('删除成功!')
          this.getUsersData()
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    getRolesListData: async function() {
      const { data } = await this.$http.get('roles')
      this.rolesListData = data.data
      console.log(this.rolesListData)
    },
    showRoleAssignDialog: function(userInfo) {
      this.selectedUserInfo = userInfo
      console.log(this.selectedUserInfo)
      this.getRolesListData()
      this.roleAssignDialogVisible = true
    },
    submitRoleAssign: async function() {
      const { data } = await this.$http.put(`users/${this.selectedUserInfo.id}/role`, { rid: this.selectedRoleId })
      if (data.meta.status !== 200) {
        return this.$message.info('role assign failed')
      }
      this.$message.success('role assign success')
      this.closeRoleAssignDialog()
      // console.log(data)
    },
    closeRoleAssignDialog: function() {
      this.selectedUserInfo = {}
      this.selectedRoleId = ''
      this.roleAssignDialogVisible = false
      this.getUsersData()
    }
  }
}
</script>
<style lang='less' scoped>
  p {
    margin-bottom: 10px;
  }
</style>