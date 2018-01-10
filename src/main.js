// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueAxios from 'vue-axios';
import axios from 'axios';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/css/VUECharts.less';
Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(ElementUI);
Vue.prototype.$ELEMENT = { size: 'medium' };
/* eslint-disable no-new */
var eventHub = new Vue();
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: {
    eventHub: eventHub,
    sprintSelected: null
  },
  methods: {
    sprintSelected: function (params) {
      console.log(params);
      this.sprintSelected = params;
    }
  },
  created: function () {
    var self = this;
    if (this.eventHub) {
      this.eventHub.$on('sprintSelected', function (params) {
        self.sprintSelected = params;
      });
    }
  }
});
