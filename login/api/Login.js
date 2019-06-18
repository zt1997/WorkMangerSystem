import axios from "@/util/MyAxios";

export function login(user) {
  axios.post("/login", user).then(response => {
    console.log(user.id);
    let token = response.data["Authorization"];
    let role = response.data["role"];
    let id = response.data["account"];
    if (token != null) {
      sessionStorage.setItem("Authorization", token);
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("id",id );
      window.location.href = "./index.html";
    }
  });
}
