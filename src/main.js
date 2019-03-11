import Vue from 'vue'
import VueRouter from 'vue-router'
import Fragmented from './Fragmented.vue'

Vue.config.productionTip = false
Vue.use(VueRouter);
new Vue({
  render: h => h(Fragmented),
}).$mount('#_vue-fragmented')
