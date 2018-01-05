import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/login/login';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
    // {
    //   path: '/*',
    //   name: 'error-404',
    //   meta: {
    //     title: '404-页面不存在'
    //   },
    //   component: resolve => { require(['@/components/error-page/404.vue'], resolve); }
    // },
    // {
    //   path: '/403',
    //   meta: {
    //     title: '403-权限不足'
    //   },
    //   name: 'error-403',
    //   component: resolve => { require(['@//components/error-page/403.vue'], resolve); }
    // },
    // {
    //   path: '/500',
    //   meta: {
    //     title: '500-服务端错误'
    //   },
    //   name: 'error-500',
    //   component: resolve => { require(['@/components/error-page/500.vue'], resolve); }
    // }
  ]
});
