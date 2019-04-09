import Vue from 'vue'
import Vuex from 'vuex';
Vue.use(Vuex);

import util from '../util.js';

const LANG = {
  en: require('../lang/en')
}

const store = new Vuex.Store({
  state: {
    bnet: -1,
    user: -1,
    loading: {
      state: false,
      error: null,
      message: "Loading",
    },
    notifications: [],
    tooltip: null,
    windows: [],
  },
  mutations: {
    // Overlay
    openWindow(state, window) {
      state.windows.push({
        id: util.uuid_v4(),
        window: {
          name: window.name || "Window",        
          component: window.component,
          props: window.props,
          draggable: window.draggable || true,
          dismissable: window.dismissable || true,
        }
      })
    },
    focusWindow(state, window) {
      let id = state.windows.findIndex((w) => w.id == window.id);
      if (id != -1) state.windows.push(state.windows.splice(id, 1)[0]);
    },
    closeWindow(state, window) {
      let id = state.windows.findIndex((w) => w.id == window.id);
      state.windows.splice(id, 1);
    },

    // Tooltips
    showTooltip(state, tooltip) {
      state.tooltip = tooltip;
    },
    hideTooltip(state) {
      state.tooltip = null;
    },

    // Notifications
    addNotification(state, data) {
      if (!data || !data.text) return;
      data.timeout = data.timeout || 5;

      let id = util.uuid_v4()
      state.notifications.push({ 
        id,
        icon: data.icon, 
        text: LANG.en.get(data.text), 
        type: data.type 
      });
      setTimeout(this.commit, data.timeout*1000, "hideNotification");
    },
    hideNotification(state) {
      state.notifications.shift();
    },    
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
    // Overlay
    getWindows: state => {
      return state.windows;
    },

    // Tooltips
    getTooltip: state => {
      return state.tooltip;
    },

    // Notifications
    getNotifications: state => {
      return state.notifications;
    },

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