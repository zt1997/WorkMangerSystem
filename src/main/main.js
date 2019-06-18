import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import bus from "@/util/Bus";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);
Vue.config.productionTip = false;

let token = sessionStorage.getItem("Authorization");
if (token == null) {
  window.location.href = "./login.html";
} else {
  console.log(sessionStorage);
  let role = sessionStorage.getItem("role");
  if (role =="SUPERADMIN"||role =="ADMIN") {
    setTimeout(() => {
      bus.$emit(bus.isAdmin, true);
    }, 500);
  }
  new Vue({
    router,
    render: h => h(App)
  }).$mount("#app");
}
