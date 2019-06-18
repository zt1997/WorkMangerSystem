<template>
  <el-container>
    <el-aside width="180px" class="home-aside" v-if="isAdmin">
      <div>
        <el-menu
          default-active="1-2-1"
          class="el-menu-vertical-demo"
          :collapse="false"
          background-color="#fff"
          text-color="#000"

        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-claim" style="color: #20a0ff"></i>
              <span slot="title">任务管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <router-link to="/task">任务列表</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-date" style="color: #20a0ff"></i>
              <span slot="title">监考管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1">
                <router-link to="/examlist">考试安排</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-user" style="color: #20a0ff"></i>
              <span slot="title">用户管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">
                <router-link to="/users">权限管理</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-setting" style="color: #20a0ff"></i>
              <span slot="title">用户设置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1">
                <router-link to="/">个人信息</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
    </el-aside>
    <el-main>
      <router-view v-bind:key="$route.path" />
    </el-main>
  </el-container>
</template>
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 175px;
}
a {
  text-decoration: none;
  color: black;
}
a:hover {
  color: #20a0ff;
}
</style>

<script>
import bus from "@/util/Bus";
export default {
  data: () => ({
    isAdmin: false
  }),
  created() {
    bus.$on(bus.isAdmin, data => {
      this.isAdmin = data;
      console.log(data);
    });
  },
  beforeDestroy() {
    bus.$off(bus.courses);
  }
};
</script>
