import Vue from 'vue'

import store from './vue.store.js';

Vue.directive('tooltip', {
  bind(el, binding) {
    function show() {
      store.commit('showTooltip', { element: el, type: binding.value.type, text: binding.value.text })
    }
    function hide() {
      store.commit('hideTooltip');
    }
    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);
  },
})