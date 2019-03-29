import Vue from 'vue';
import VueCookies from 'vue-cookies';

Vue.use(VueCookies);
VueCookies.config('30d')

require('./vue/vue.components.js');
import router from './vue/vue.routes.js';
import store from './vue/vue.store.js';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  el: 'div#vue-fragmented',
  template: '<vue-fragmented />'
})

