//对于axios进行二次封装
import axios from "axios";
import { MessagePlugin } from "tdesign-vue-next";
import router from "@/router/index";
import useUserStore from "@/stores/models/user/user.js";


//配置通用的基础路径和超时时间
const httpRequest = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 60000,
});

//请求拦截器
httpRequest.interceptors.request.use((config) => {
  //config：配置对象，对象里面有一个属性很重要，headers请求头
  let userStore = useUserStore();
  if (userStore.token) {
    config.headers["authorization"] = userStore.token; // 设置请求头
  }
  return config;
});

//响应拦截器
httpRequest.interceptors.response.use(
  (response) => {
    //响应成功的回调
    let userStore = useUserStore();
    const res = response.data;
    const code = res.code;
    if (code !== 200) {
      MessagePlugin.error(res.message);
    }
    if (code === 405) {
      userStore.logout();
      router.push("/login");
    }
    return res;
  },
  (error) => {
    //响应失败的回调
    return Promise.reject(new Error("faile"));
  }
);

//对外暴露
export default httpRequest;
