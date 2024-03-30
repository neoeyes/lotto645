import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld';
import Lotto from '@/components/Lotto';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'root',
      component: Lotto,
    },
    {
      path: '/lotto',
      name: 'lotto',
      component: Lotto,
    },
    {
      path: '/lotto/:size',
      name: 'lotto:size',
      component: Lotto,
    },
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld,
    // },
  ],
});
