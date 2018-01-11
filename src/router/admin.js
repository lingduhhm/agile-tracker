import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/admin-home/home';
import Login from '@/components/login/login';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Story from '@/components/admin-story/story';
import Dashboard from '@/components/admin-dashboard/dashboard';
import Cookies from 'js-cookie';

Vue.use(Router);
Vue.use(ElementUI);

const routerObj = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/dashboard',
          component: Dashboard
        },
        {
          path: '/story/:category',
          component: Story
        }
      ],
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }

  ]
});
routerObj.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!Cookies.get('agiletracker')) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next(); // 确保一定要调用 next()
  }
});

export default routerObj;
