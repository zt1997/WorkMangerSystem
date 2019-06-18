<template>
  <div
    style="border:1px;width:100%;height:100%;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"
  >
    <el-container>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>系统首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人信息</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="name" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="account" label="学工号" width="180">
            </el-table-column>
            <el-table-column prop="title" label="职称"> </el-table-column>
            <el-table-column prop="phone" label="电话号"> </el-table-column>
             <el-table-column
                  fixed="right"
                  label="操作"
                  width="100">
            <template slot-scope="scope">
              <el-button @click="changePassword(scope.row)" type="text" size="small">修改密码</el-button>
            </template>
          </el-table-column>
          </el-table>
          <el-button
            style="float: right; padding: 10px 5px; margin:20px 50%"
            @click="open"
            type="primary"
            >修改信息</el-button
          >
          <!--       <el-button
                  style="float: right; padding: 10px 5px; margin:20px 50%"
                  @click="change()"
                  type="primary"
          >修改密码</el-button>-->
        </div>
      </el-card>
      <!--修改密码-->
      <el-dialog
              title="修改密码"
              style="padding: 0px;"
              :close-on-click-modal="false"
              :visible.sync="mPassworddialogVisible"
              width="77%"
      >
        <div>
          <el-input v-model="oldpassword" placeholder="请输入旧密码" style="width: 30%" ></el-input>

          <el-input v-model="newpassword" placeholder="请输入新密码" style="width: 30%;margin-left: 10%"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="mPassworddialogVisible=false">取 消</el-button>
              <el-button size="mini" type="primary" @click="changepws"
              >确 定</el-button
              >
            </span>
      </el-dialog>
      <!--修改信息对话框-->
      <el-form :model="user">
        <div style="text-align: left">
          <el-dialog
            :title="dialogTitle"
            style="padding: 0px;"
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            width="77%"
          >
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
                    <el-input
                      v-model="user.position"
                      style="width: 130px"
                      size="mini"
                      disabled="true"
                    >
                    </el-input>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="个人简介">
                  <el-input type="text" v-model="user.introduction"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="cancelEidt">取 消</el-button>
              <el-button size="mini" type="primary" @click="postUser"
                >确 定</el-button
              >
            </span>
          </el-dialog>
        </div>
      </el-form>
    </el-container>
  </div>
</template>
<script>
import bus from "@/util/Bus";
import axios from "@/util/MyAxios";
import { getMyInfo } from "@/main/api/Main";

export default {
  data: () => ({
      oldpassword:"",
      newpassword:"",
    tableData: [
      {
        name: null,
        account: null,
        title: null,
        phone: null
      }
    ],
    user: {
    },
    dialogVisible: false,
      mPassworddialogVisible:false,
    dialogTitle: "",

  }),
  created() {
    getMyInfo();
    bus.$on(bus.user, data => {
      console.log(data);
      this.user = data;
      this.tableData[0].name = this.user.name;
      this.tableData[0].account = this.user.account;
      this.tableData[0].title = this.user.position;
      this.tableData[0].phone = this.user.phone;
    });
  },
  methods: {
    cancelEidt() {
      this.dialogVisible = false;
    },
    open() {
      this.dialogTitle = "编辑个人信息";
      this.dialogVisible = true;
    },
    postUser() {
      this.$confirm("确认更新?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
           axios.post("/updateUser", {account:this.user.account,name:this.user.name,position:this.user.position,intro:this.user.introduction,phone:this.user.phone}).then(response => {
            this.user = response.data.user;
          });
            this.dialogVisible=false;
          this.$message({
            type: "success",
            message: "更新成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消"
          });
        });
    },
      changePassword(row){
        this.mPassworddialogVisible=true;
        console.log(row);
        /*  axios.post("/updateUser", {account:this.user.account,name:this.user.name,position:this.user.position,intro:this.user.introduction,
              phone:this.user.phone}).then(response => {
              this.user = response.data.user;
          });*/
      },
      changepws(){
        console.log(this.user.account);
           axios.post("/updatePass", {account:this.user.account,oldPass:this.oldpassword,newPass:this.newpassword}).then(response => {
              console.log(response["data"].message);
              alert(response["data"].message);
              this.mPassworddialogVisible=false;
            });
      }
  }
};
</script>
<style>
.text {
  font-size: 16px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
}
</style>
