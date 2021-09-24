import Vue from "vue";
import global from "./modules/global";

const mixinsData = { global };

Object.keys(mixinsData).forEach(key => {
  //每当向应用程序添加全局mixin时，都应使用一个标志以避免多次注册它
  if (!Vue[`__my_${key}__`]) {
    Vue[`__my_${key}__`] = true
    Vue.mixin(mixinsData[key]);
  }
});