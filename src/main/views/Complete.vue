<template>
  <div>
    <el-container>

      <el-table
        :data="tasks"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        border
      >
        <el-table-column
          prop="date"
          label="任务名称"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="完成人数"
          width="180"
        ></el-table-column>
        <el-table-column prop="address" label="未完成人数"></el-table-column>
      </el-table>
    </el-container>
  </div>
</template>
<script>
//import axios from "@/util/MyAxios";
export default {
  data: () => ({
    tasks: []
  }),
  created() {}
};
</script>

<style scoped>
.el-header,
.el-footer {
  background-color: #efefef;
  color: #333;
  text-align: center;
  height: 60px;
  line-height: 60px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
</style>
