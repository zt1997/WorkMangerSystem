<template>
  <div id="app">
    <el-container class="home-container">
      <el-header class="home-header">
        <span class="home_title">软件工程专业工作管理系统</span>
        <div style="display: flex;align-items: center;margin-right: 7px">
          <el-badge style="margin-right: 30px">
            <i class="fa fa-bell-o" style="cursor: pointer"></i>
          </el-badge>
          <el-dropdown @command="handleCommand">
            <div
              class="el-dropdown-link home_userinfo"
              style="display: flex;align-items: center"
            >
              <div
                class="el-icon-user-solid"
                style="width: 30%; height: 30%"
              ></div>
              <span style="margin-left: 10px"> {{ user.name }}</span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link to="/">个人中心</router-link>
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <sidebar v-if="isAdmin" />
      <generalbar v-if="!isAdmin" />
    </el-container>
  </div>
</template>

<script>
//import bus from "@/util/Bus";
import axios from "@/util/MyAxios";

export default {
  components: {
    sidebar: () => import("./views/Sidebar"),
    generalbar: () => import("./views/GeneralBar"),

  },
  data: () => ({
    isAdmin: false,
    user: {}
  }),
  computed: {
    routes() {
      return this.$store.state.routes;
    }
  },
  created() {
    axios.post("/listOne", { account: sessionStorage.getItem("id") })
      .then(response => {
        //console.log(response);
        this.user = response["data"].data;
        //console.log(this.user);
      });
    let role = sessionStorage.getItem("role");
    if (role =="SUPERADMIN"||role =="ADMIN") {
      this.isAdmin = true;
    }
    console.log(this.isAdmin);
  },
  methods: {
    handleCommand(cmd) {
      var _this = this;
      if (cmd == "logout") {
        this.$confirm("注销登录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            window.sessionStorage.removeItem("Authorization");
            window.sessionStorage.removeItem("id");
            window.sessionStorage.removeItem("role");
            window.location.href = "./login.html";
          })
          .catch(() => {
            _this.$message({
              type: "info",
              message: "取消"
            });
          });
      }
    }
  }
};
</script>
<style>
a {
  text-decoration: none;
  color: #000;
}
a:hover {
  color: #20a0ff;
}
.home-container {
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
}

.home-header {
  background-color: #20a0ff;
  color: #333;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: content-box;
  padding: 0px;
}

.home-aside {
  background-color: #ececec;
}

.home-main {
  background-color: #fff;
  color: #000;
  text-align: center;
  margin: 0px;
  padding: 0px;
}

.home_title {
  color: #fff;
  font-size: 22px;
  display: inline;
  margin-left: 8px;
  letter-spacing: 10px;
}

.home_userinfo {
  color: #fff;
  cursor: pointer;
}

.home_userinfoContainer {
  display: inline;
  margin-right: 20px;
}
</style>
