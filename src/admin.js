// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueAxios from 'vue-axios';
import axios from 'axios';
import router from './router/admin';
import '@/css/admin.less';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
var eventHub = new Vue();
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: {
    module: window.localStorage.getItem('module'),
    eventHub: eventHub
  }
});
