/**
 * User: kfs
 * Date：2017/4/16
 * Desc：
 */
import axios from 'axios';
// 适配vue-resource
const instance = axios.create();
instance.interceptors.request.use(config=> {
//Serialize.decode(config);
  return config;
});
instance.interceptors.response.use(response=> {
  return response.data;
}, err=> {
  if (err.response) {
    axios.post('/v1/error', err.response);
    return Promise.reject(err.response.data);
  }
  return Promise.reject({ code: 1024, msg: err.message });
});
function plugin(Vue) {
  if (plugin.installed) {
    return;
  }
  Vue.http = instance;
}
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}
export default plugin;
