import Vue from 'vue'
import Fragmented from './Fragmented.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Fragmented),
}).$mount('#_vue-fragmented')
