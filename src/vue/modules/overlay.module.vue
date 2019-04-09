<template>
  <transition name="overlayfx">
    <section class="vue-overlay" v-show="windows.length">
      <vm-window v-for="window in windows" :key="window.id" v-bind="window"></vm-window>
    </section>
  </transition>
</template>

<script>
export default {
  computed: {
    windows() {
      return this.$store.getters.getWindows;
    }
  }
}
</script>

<style lang="scss">
.vue-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(#000, .8);
  overflow: auto;  
  transition: opacity .2s ease;
  z-index: 10;
}

.overlayfx-enter, .overlayfx-leave-active {
  opacity: 0;
}
</style>
