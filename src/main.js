/**
 * Created by xiangsongtao on 16/10/29.
 * Description: main.js
 * */
'use strict';
import Vue from 'vue';
import App from './App';
import router from './router.js'
import kComps from './components/index'
import "./theme/util.scss";
import "bootstrap/bootstrap.scss";
// import "bootstrap/js/tooltip.js";
// import "bootstrap/js/modal.js";
// import "bootstrap/js/transition.js";
import attachFastClick from "fastclick";
import {ua} from './utils/utils'

/**
 * $router全局化，便于外部js调用
 * */
window.$router = router;

/**
 * 浏览环境判断，保存为全局
 * */
window.ua = ua;

/**
 * 触摸配置
 * */
new attachFastClick(document.body);

/**
 * 发布模式禁用console.log()
 * */
// if (process.env.NODE_ENV === 'production') {
//   console.log = function () {
//   }
//   console.warn = function () {
//   }
// }

//console.log = function () {}
console.warn = function () {}


Vue.use(kComps);

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App},
})
