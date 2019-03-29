import Vue from 'vue'
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    bnet: -1,
    user: -1,
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

export default store;