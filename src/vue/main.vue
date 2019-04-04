<template>
  <div id="vue-app">
    <div class="bg"></div>
    <vm-header></vm-header>
    <transition name="fx-main" mode="out-in">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <vm-footer></vm-footer>
    <vm-notification></vm-notification>
    <vc-tooltip></vc-tooltip>
  </div>
</template>

<script>
import axios from 'axios';

import { TweenLite, CSSPlugin, Power2 } from 'gsap/TweenMax';
import ScrollToPlugin from "gsap/ScrollToPlugin";

export default { 
  async mounted() {
    try {
      let session = await axios.post('/session', { session: this.$cookies.get("session") });
      this.$store.state.user = session.data.user;
      this.$store.state.bnet = session.data.bnet;
    }
    catch(e) {
      console.error(e);
    }
  },
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
@import '_fx.scss';
@import '_wow.scss';

html, body {
  height: 100%;
  width: 100%;
}

body {
  display: flex;
  font-family: "Ubuntu";
  font-weight: 400;
  font-size: 14px;
  color: $base-color;
  text-shadow: 1px 1px 1px #000;
}

ul, li {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

a {
  color: inherit;
  outline: none;
	text-decoration: inherit;
	
	transition: color .2s ease, background-color .2s ease, text-shadow .2s ease;
	cursor: pointer;
	
	&:not(.vue-button):not(.router-link-active):not(.custom):hover {
    color: lighten($base-color, 20%); 
    text-shadow: 0 0 1px $base-color;
	}
}

.input {
  display: flex;
  flex-direction: column;
  margin: 10px 0;
  color: $base-color;
  font-size: 14px;
  font-weight: 600;

  .input-label {
    padding: 5px;      
    border-bottom: 2px solid darken($base-color, 20%);
    color: darken($base-color, 20%);
    font-weight: 600;
  }
  textarea {
    min-height: 85px;
  }
  input, textarea {
    padding: 4px;
    border-radius: 2px;
    color: $base-color;
    background: darken($base-color, 30%);
    font-weight: 600;
    text-shadow: 1px 1px 1px #000;

    &:not(.clear) {
      transition: background-color .2s ease;
      &:hover:not(:focus):not(:disabled) {
        background-color: rgba($base-color, .2);
      }
      &:focus {
        background-color: rgba($base-color, .3);
      }
      &:disabled {
        background-color: transparent;
      }
    }
    background-image: none;
    appearance: none; -webkit-appearance: none; -moz-appearance: none;
    outline: none;
    box-shadow: none;
    border: none;
    resize: none;
  }
}

#vue-app {
  width: inherit;
  height: inherit;
  min-width: 1024px;
  min-height: 720px;

  display: grid;
  grid-template-rows: 110px 1fr 32px;
  main {
    display: grid;
    transition: opacity .25s ease-out;

    section {
      display: grid;     
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
