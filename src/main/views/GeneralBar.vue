<template>
  <el-container>
    <el-aside width="180px" class="home-aside">
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
              <i class="el-icon-location" style="color: #20a0ff"></i>
              <span slot="title">任务查看</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <router-link to="/task">任务列表</router-link>
              </el-menu-item>
          <!--    <el-menu-item index="1-2">
                <router-link to="/complete">完成情况</router-link>
              </el-menu-item>-->
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu" style="color: #20a0ff"></i>
              <span slot="title">监考信息</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1">
                <router-link to="/examlist">监考查看</router-link>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-setting" style="color: #20a0ff"></i>
              <span slot="title">用户设置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1">
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
a {
  text-decoration: none;
  color: black;
}
a:hover {
  color: #20a0ff;
}
</style>

<script>
export default {};
</script>
