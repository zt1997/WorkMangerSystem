import axios from "@/util/MyAxios";
import bus from "@/util/Bus";
import { Message } from "element-ui";
export function getMyInfo() {
  axios
    .post("/listOne", { account: sessionStorage.getItem("id") })
    .then(response => {
      // 模拟异步延时操作
      //console.log(response.data.data);
      bus.$emit(bus.user, response.data.data);
    });
}

export function getTasks() {
  axios.get("/task/all").then(resp => {
    console.log(resp);
    bus.$emit(bus.tasks, resp.data.task);
  });
}

export function getReplys(data) {
  axios.get(`/taskdetail/get/${data.id}`).then(resp => {
    console.log(resp.data);
  });
}
/*export function postCourse(data) {
  axios.post("admin/courses", data.course).then(response => {
    if (response.status == 200) {
      setTimeout(() => {
        bus.$emit(bus.courses, response.data.courses);
      }, 100);
    } else {
      Message.warning("提交失败");
    }
  });
}*/
export function getAllLesions() {
  axios.get("/lession/list").then(resp => {
    console.log(resp);
    bus.$emit(bus.lessions, resp.data.lessions);
  });
}
export function getUsers() {
  axios.post("/listAll",{ account: sessionStorage.getItem("id") ,token: sessionStorage.getItem("Authorization")}).then(response => {
   // console.log(response.data.data);
      bus.$emit(bus.users, response.data.data);
  });
}

export function getExams() {
  axios.get("/listAllExam").then(response => {
    //console.log(response.data.data);
    bus.$emit(bus.exams, response.data.data);
  });
}
export function postUsers(data) {
  axios
    .post("/updateUser", data)
    .then(response => {
      setTimeout(() => {
        bus.$emit(bus.users, response.data.user);
      }, 500);
      Message.success("修改成功");
    })
    .catch(() => {
      Message.warning("未知错误，修改失败");
    });
}
