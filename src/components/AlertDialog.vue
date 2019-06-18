<template>
  <div>
    <el-alert
      title="警告提示的文案"
      type="warning"
      description="文字说明文字说明文字说明文字说明文字说明文字说明"
      show-icon
    ></el-alert>
  </div>
</template>
<script>
import bus from "@/util/Bus";
export default {
  created() {
    bus.$on(bus.e, data => {
      alert(data);
    });
  },
  beforeDestroy() {
    bus.$off(bus.e);
  }
};
</script>
