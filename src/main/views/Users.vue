<template>
  <div
    style="border:1px;width:100%;height:100%;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"
  >
    <el-container>
      <el-header style="display: flex;justify-content: space-between;align-items: center;">
        <el-button
          type="primary"
          @click="addVis = true"
          size="mini"
          icon="el-icon-plus"
          >添加用户</el-button
        >
      </el-header>
      <el-main>
        <el-table
          :data="users"
          style="width: 100%"
          title="普通用户列表"
          size="mini"
        >
          <el-table-column
            prop="name"
            label="姓名"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="account"
            label="学工号"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="title"
            label="职称"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="introduction"
            label="简介"
            width="150"
          ></el-table-column>
          <el-table-column
            prop="phone"
            label="电话"
            width="180"
          ></el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button @click="showEditEmpView(scope.row)" size="mini"
                >编辑</el-button
              >
              <el-button type="success" size="mini" @click="open(scope.row)"
                >授权</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>

    <el-form :model="user">
      <div style="text-align: left">
        <el-dialog
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="77%"
        >
          <el-container>
            <el-header>
              <el-button type="warning" @click="deleteUser" size="mini"
                >删除该员工</el-button
              >
            </el-header>
            <el-main>
              <div>
                <el-row>
                  <el-col :span="6">
                    <div>
                      <el-form-item label="姓名:" prop="name">
                        <el-input
                          prefix-icon="el-icon-edit"
                          size="mini"
                          style="width: 130px"
                          placeholder="请输入员工姓名"
                          v-model="user.name"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="7">
                    <div>
                      <el-form-item label="学工号">
                        <el-input
                          prefix-icon="el-icon-set-up"
                          size="mini"
                          style="width: 140px"
                          disabled="true"
                          v-model="user.account"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="5">
                    <div>
                      <el-form-item label="电话">
                        <el-input
                          prefix-icon="el-icon-phone"
                          size="mini"
                          style="width: 140px"
                          placeholder="请输入员工电话"
                          v-model="user.phone"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="5">
                    <div>
                      <el-form-item label="职称">
                        <el-select
                          v-model="user.title"
                          style="width: 130px"
                          size="mini"
                          placeholder="请选择职位"
                        >
                          <el-option
                            v-for="item in positions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <el-form-item label="个人简介">
                      <el-input
                        type="text"
                        v-model="user.introduction"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-main>
          </el-container>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEidt">取 消</el-button>
            <el-button size="mini" type="primary" @click="postUser(user)"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </div>
    </el-form>
    <el-dialog title="增加用户" :visible.sync="addVis">
      <el-form :model="newUser">
        <el-form-item label="学工号">
          <el-input
            prefix-icon="el-icon-set-up"
            v-model="newUser.account"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="初始密码">
          <el-input
            prefix-icon="el-icon-set-up"
            v-model="newUser.password"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVis = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import bus from "@/util/Bus";
import axios from "@/util/MyAxios";
import { Message } from "element-ui";
import { getUsers } from "@/main/api/Main";
import { postUsers } from "@/main/api/Main";
export default {
  data: () => ({
    users: [],
    user: {
      id: "",
      authority: "",
      name: "",
      naccount: "",
      title: "",
      phone: "",
      introduction: ""
    },
    newUser: {
      account: "",
      password: ""
    },
    dialogVisible: false,
    dialogTitle: "",
    addVis: false,
    positions: [
      { id: "1", name: "讲师" },
      { id: "2", name: "副教授" },
      { id: "3", name: "教授" }
    ]
  }),
  created() {
    getUsers();
    bus.$on(bus.users, data => {
      this.users = data;
      console.log(data);
    });
  },
  methods: {
    cancelEidt() {
      this.dialogVisible = false;
    },
    showEditEmpView(row) {
      this.dialogTitle = "编辑员工";
      this.dialogVisible = true;
      this.user = row;
      this.user.name = row.name;
      this.user.account = row.account;
      this.user.id = row.id;
      this.user.phone = row.phone;
      this.user.introduction = row.introduction;
    },
    deleteUser() {
      this.$confirm("确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios
          .post("/delUser", {account:this.user.account})
          .then(resp => {
            if (resp.status == 200) {
              Message.success("删除成功!");
              this.dialogVisible = false;
              getUsers();
            }
          })
          .catch(() => {
            Message.warning("未知错，删除失败");
          });
      });
    },
    postUser(user) {
      postUsers(user);
       getUsers();
    },
    addUser() {
      axios
        .post("/addUser",{ account:this.newUser.account,password:this.newUser.password})
        .then(resp => {
          if (resp.status == 200) {
            Message.success("添加成功!");
            this.newUser = { account: null, name: null, password: null };
            this.addVis = false;
            getUsers();
          } else {
            Message.warning("未知错误");
              getUsers();
          }
        })
        .catch(error => {
          console.log(error);
          Message.warning("学工号重复,添加失败");
        });
    },

    open(row) {
      this.$confirm("确认授权管理员给学工号为【" + row.account+ "】的用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"})
        .then(() => {
          console.log(row.id);
          this.user = row;
          axios.post("/changeAuth", {account:row.account,authorized:sessionStorage.getItem("Authorization")}).then(resp => {
            if (resp && resp.status == 200) {
              console.log("success");
            }
          });
          this.$message({
            type: "success",
            message: "授权成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消授权"
          });
        });
    }
  }
};
</script>
