<template>
  <div id="vue-app">
    <div class="bg"></div>
    <vm-header></vm-header>
    <transition name="fx-main" mode="out-in"> 
      <router-view></router-view>
    </transition>
    <vm-footer></vm-footer>
  </div>
</template>

<script>
import { TweenLite, CSSPlugin, Power2 } from 'gsap/TweenMax';
import ScrollToPlugin from "gsap/ScrollToPlugin";

export default { 
  show(el, done) {
    let animation = new TweenLite(el, 400, { opacity: 1 });
    el.style.opacity = 0;
    animation.play();
  },
  hide(el, done) {
    Velocity(el, "stop", true);        
    Velocity(el, {
      opacity: 0
    }, { easing: "swing", duration: 200, complete: done })
  },
}
</script>

<style lang="scss">
@import 'normalize.scss';
@import '_fonts.scss';
@import '_icons.scss';
@import '_fx.scss';
@import '_wow_classes.scss';

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

a {
  text-decoration: none;
  outline: none !important;
}

#vue-app {
  width: inherit;
  height: inherit;
  min-width: 1024px;
  min-height: 720px;

  display: grid;
  grid-template-rows: 96px 1fr 32px;
  main {
    display: grid;
    transition: opacity .25s ease-out;

    section {
      display: flex;
      flex-direction: column;  
     
     .title {
        position: relative;
        padding: 5px 12px;
        align-self: center;
        border-radius: 10px;
        border-bottom: 1px solid $base-color;
        background: linear-gradient(to bottom, rgba(darken($base-color, 20%), .01) 40%, rgba($base-color, .1) 100%);
        color: $base-color;
        font-weight: 400;
      }
    }
  }
}

.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  background: url('~assets/images/bg.jpg') no-repeat fixed center top / cover;
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

.fx-main-enter {
  opacity: 0;
}
.fx-main-leave-to {
  opacity: 0;
}
</style>
