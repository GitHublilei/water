import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/main-page',
      name: 'main-page',
      component: require('@/pages/MainPage').default
    },
    {
      path: '/setting',
      name: 'setting',
      component: require('@/pages/setting').default
    }
  ]
})
