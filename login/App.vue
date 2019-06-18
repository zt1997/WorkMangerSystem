<template>
  <div id="app">
    <el-container class="logcontainer">
      <el-main>
        <div>
          <el-form
            :rules="rules"
            class="login-container"
            label-position="left"
            label-width="0px"
          >
            <h3 class="login_title">登录</h3>
            <el-form-item prop="account">
              <el-input
                type="text"
                v-model="user.account"
                auto-complete="off"
                placeholder="学工号"
              ></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
              <el-input
                type="password"
                v-model="user.password"
                auto-complete="off"
                placeholder="密码"
              ></el-input>
            </el-form-item>
            <el-checkbox
              class="login_remember"
              v-model="checked"
              label-position="left"
              >记住密码</el-checkbox
            >
            <el-form-item style="width: 100%">
              <el-button type="primary" style="width: 100%" @click="login"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-main>
      <el-footer class="el-footer">copyright@DuYL ZhaoT Duancc ZhengDS</el-footer>
    </el-container>
  </div>
</template>
<style scoped>
.el-footer {
  background-color: #20a0ff;
  opacity: 0.8;
  color: white;
  text-align: center;
  line-height: 60px;
  border-radius: 0 0 5px 5px;
}
#app {
  margin: 0;
}
.logcontainer {
  background: url("../assets/img/login-bg.jpg");
  background-size: cover;
}

.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  width: 20%;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  margin: 145px 70%;
  opacity: 0.8;
}

.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
.login_remember {
  margin: 0px 0px 35px 0px;
  text-align: left;
}
</style>

<script>
import axios from "@/util/MyAxios";
import { Message } from "element-ui";
export default {
  data: () => ({
    rules: {
      account: [{ required: true, message: "请输入学工号", trigger: "null" }],
      checkPass: [{ required: true, message: "请输入密码", trigger: "null" }]
    },
    checked: true,
    user: { account: null, password: null }
  }),
  methods: {
    login() {
      if (this.user.account == null || this.user.password == null) {
        Message.warning("用户名和密码不能为空");
        return;
      }
      axios.post("/login", this.user).then(response => {
        if (response.e) {
          Message.warning("用户名或密码错误");
          // 否则发送的user会被清空
          this.$nextTick(() => {
            this.user = { account: null, password: null };
          });
        }
        console.log(response);
        console.log(response.data["Authorization"]);
        let token = response.data["Authorization"];
        let role = response.data["role"];
        //console.log(role);
        let id = response.data["account"];
        if (token != null) {
          sessionStorage.setItem("Authorization", token);
          sessionStorage.setItem("role", role);
          sessionStorage.setItem("id", id);
          window.location.href = "./index.html";
        }
      });
    }
  }
};
</script>
