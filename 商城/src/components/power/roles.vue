<!--  -->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button>添加角色</el-button>
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bottomBd', index1 == 0 ? 'topBd' : '', 'vcenter']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- level1 -->
              <el-col :span="6">
                <el-tag closable @close="closeRolesTag(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- level2-3 -->
              <el-col :span="18">
                <!-- level2 -->
                <el-row
                  :class="[index2 == 0 ? '' : 'topBd', 'vcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="8">
                    <el-tag
                      type="success"
                      @close="closeRolesTag(scope.row, item2.id)"
                      closable
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <el-tag
                      type="warning"
                      @close="closeRolesTag(scope.row, item3.id)"
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >{{item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete-solid" size="mini"></el-button> -->
            <el-tooltip content="rights assign" placement="top" :enterable="false">
              <el-button @click="showRightDialoge(scope.row)" type="warning" icon="el-icon-s-tools" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- dialoge -->
      <el-dialog title="right assign" :visible.sync="rightDialogVisible" width="30%" @close="closeRightDialog">
        <span>
          <el-tree ref="rightTreeRef" :data="rightTreeData" node-key="id" :props="rightTreeProps" show-checkbox default-expand-all :default-checked-keys="defaultCheckedKeys"></el-tree>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitRightAssign">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      rightDialogVisible: false,
      rightTreeData: [],
      rightTreeProps: {
          children: 'children',
          label: 'authName'
        },
      defaultCheckedKeys: [],
      currentRoleId: 0
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    getRolesList: async function() {
      const { data } = await this.$http.get('roles')
      // console.log(data.data)
      if (data.meta.status !== 200) {
        return this.$message.error('rolesData get failed')
      }
      this.tableData = data.data
    },
    closeRolesTag: function(roledata, id) {
      this.$confirm('此操作将永久删除该right, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data } = await this.$http.delete(
            `roles/${roledata.id}/rights/${id}`
          )
          console.log(data)
          if (data.meta.status !== 200) {
            return this.$message.info('right delete failed')
          }
          roledata.children = data.data
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    showRightDialoge: function(data) {
      this.currentRoleId = data.id
      this.rightDialogVisible = true
      this.getRightTree()
      this.getCheckedRightsId(data)
    },
    getRightTree: async function() {
      const { data } = await this.$http.get('rights/tree')
      if (data.meta.status !== 200) {
        return this.$message.info('right data get failed')
      }
      this.rightTreeData = data.data
      // console.log(this.rightTreeData)
    },
    getCheckedRightsId: function(role) {
      // console.log(role)
      if (role.children) {
        role.children.forEach(element => {
          this.getCheckedRightsId(element)
        })
      } else {
        // console.log(role.id)
        return this.defaultCheckedKeys.push(role.id)
      }
    },
    closeRightDialog: function() {
      this.defaultCheckedKeys = []
    },
    submitRightAssign: async function() {
      const { data } = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids: [...this.$refs.rightTreeRef.getCheckedKeys(), ...this.$refs.rightTreeRef.getHalfCheckedKeys()].join(',')
      })
      if (data.meta.status !== 200) {
        return this.$message.info('right assign failed')
      }
      // console.log(...this.$refs.rightTreeRef.getCheckedKeys())
      // console.log(...this.$refs.rightTreeRef.getHalfCheckedKeys())
      // console.log([...this.$refs.rightTreeRef.getCheckedKeys(), ...this.$refs.rightTreeRef.getHalfCheckedKeys()].join(','))
      this.currentRoleId = 0
      this.rightDialogVisible = false
      this.getRolesList()
    }
  }
}
</script>
<style lang='less' scoped>
.el-tag {
  margin: 7px;
}
.topBd {
  border-top: 1px solid #eee;
}
.bottomBd {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>