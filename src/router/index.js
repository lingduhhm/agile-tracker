import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/components/admin-home/home';
import Login from '@/components/login/login';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Story from '@/components/admin-story/story';
import Dashboard from '@/components/admin-dashboard/dashboard';
import Planning from '@/components/admin-planning/planning';
import Configuration from '@/components/admin-configuration/config';

Vue.use(Router);
Vue.use(ElementUI);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/dashboard',
          component: Dashboard
        },
        {
          path: '/planning',
          component: Planning
        },
        {
          path: '/story/:sprintid',
          component: Story
        },
        {
          path: '/configuration',
          component: Configuration
        }
      ],
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/login',
      name: 'login',
      component: Login
    }
  ]
});
