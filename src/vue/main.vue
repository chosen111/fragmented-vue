<template>
  <div id="vue-app">
    <header>header</header>
    <transition mode="out-in"> 
      <router-view></router-view>
    </transition>
    <footer>footer</footer>
  </div>
</template>

<script>
export default { }
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
