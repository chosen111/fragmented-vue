import Vue from 'vue'

require('./vue/vue.components.js');
import router from './vue/vue.routes.js';

Vue.config.productionTip = false

new Vue({
  router,
  el: 'div#vue-fragmented',
  template: '<Fragmented />'
})

