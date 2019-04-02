import Vue from 'vue'
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    bnet: -1,
    user: -1,
    loading: {
      state: false,
      error: null,
      message: "Loading",
    },
  },
  mutations: {
    // BNet
    setBNet: (state, data) => {
      state.bnet = data;
    },
    clearBNet: (state) => {
      state.bnet = undefined;
    },
    // Loading
    startLoading: (state, data) => {
      state.loading.state = true;
      state.loading.error = null;
      state.loading.message = data || "Loading";
    },
    failLoading: (state, data) => {
      state.loading.state = false;
      state.loading.error = true;
      state.loading.message = data;
    },
    stopLoading: (state) => {
      state.loading.state = false;
    }
  },
  getters: {
    // BNet
    getBNet: state => {
      return state.bnet;
    },
    // Loading
    getLoading: state => {
      return state.loading;
    }
  }
})

export default store;