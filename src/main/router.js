import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {

      path: "/users",
      component: () => import("./views/Users")
    },
    {
      path: "/",
      component: () => import("./views/UserInfo")
    },
    {
      path: "/task",
      component: () => import("./views/Task")
    },
    {
      path: "/complete",
      component: () => import("./views/Complete")
    },
    {
      path: "/examlist",
      component: () => import("./views/ExamList")
    }
  ]
});
