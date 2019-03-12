<template>
  <div id="vue-app">
    <div class="bg"></div>
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
@import '../assets/scss/normalize';
@import '../assets/scss/_vars';
@import '../assets/scss/_funcs';
@import '../assets/scss/_fonts';
@import '../assets/scss/_fx';
@import '../assets/scss/_wow_classes';

html, body {
  height: 100%;
  width: 100%;
}

body {
  display: flex;
  font-family: "Ubuntu";
  font-weight: 400;
  color: $base-color;
}

ul, li {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

#vue-app {
  width: inherit;
  height: inherit;
  min-width: 1024px;
  min-height: 720px;

  display: grid;
  grid-template-rows: 96px 1fr 32px;
  header {
    position: relative;
    background: linear-gradient(to bottom, transparent 0, rgba(#fd6a02, .1) 96px);
    &:after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      background: linear-gradient(to right, lighten(#fd6a02, 10%), #fd6a02, lighten(#fd6a02, 10%));
    }
  }
  main {
    display: grid;
    background: linear-gradient(to bottom, rgba(#fd6a02, .1) 0, transparent 96px);
  }
  footer {

  }
}

.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  background: url('../assets/images/bg.jpg') no-repeat fixed center top / cover;
  z-index: -1;
  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at top, rgba(#000, .5), rgba(#000, .8)),
                radial-gradient(ellipse at bottom, rgba(#000, .5), rgba(#000, .8));
  }
}
</style>
