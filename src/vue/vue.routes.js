import Vue from 'vue'
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import vp404 from './pages/404.page.vue';
import vpHome from './pages/home.page.vue';
import vpAttendance from './pages/attendance.page.vue';

const routes = [
  { path: '/', component: vpHome },
  { path: '/attendance', component: vpAttendance },
  { path: '*', component: vp404 },
]

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

export default router;

/*const routes = [
  { path: '/', component: vpHome },
  { path: '/news', component: vpNews },
  { path: '/anime', component: vpAnime,
    children: [
      { path: '', component: vpAnime },
      { path: ':anime', component: vpAnimeSpecific,
        children: [
          { path: 'admin', component: vcAdmin }
        ]
      },
      { path: ':anime/episode/:episode', component: vpAnimeSpecific,
        children: [
          { path: 'admin', component: vcAdmin }
        ]
      }
    ]
  },      
  { path: '/ova', component: vpOVA },
  { path: '/movie', component: vpMovie },
  { path: '/manga', component: vpManga },
  //{ path: '/search', component: vpSearch, props: (route) => ({ query: route.query.q }) },
  { path: '*', component: vp404 }
]*/
