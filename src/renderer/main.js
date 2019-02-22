import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import db from '../datastore/index'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$http = axios
// 是否跨域
axios.defaults.withCredentials = true
Vue.prototype.$db = db

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
