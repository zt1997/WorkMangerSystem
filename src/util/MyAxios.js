import axios from "axios";
import bus from "@/util/Bus";

axios.defaults.baseURL = "/api";
axios.interceptors.request.use(
  function(req) {
    req.headers.Authorization = sessionStorage.getItem("Authorization");
    return req;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    bus.$emit(bus.e, error.response.data.message);
    return Promise.reject(error);
  }
);

export default axios;
