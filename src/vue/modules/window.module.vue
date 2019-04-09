<template>
  <transition name="windowfx">
    <section class="vue-window" :class="windowNameSlug" @click="focus">
      <header @mousedown="hold" :class="{ 'vue-drag': isDraggable }">
        <label class="title">{{ window.name }}</label>
        <vc-icon v-if="window.dismissable" icon="close" :click="dismiss"></vc-icon>  
      </header>
      <component :is="window.component" :dismiss="dismiss" v-bind="window.props"></component>
    </section>
  </transition>
</template>

<script>
import util from '../../util.js';
import slugify from 'slugify';

export default {
  props: [ 'id', 'window' ],
  data() {
    return {
      dragging: {
        handler: false,
        offsetLeft: 0,
        offsetTop: 0        
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      let el = this.$el;
      el.style.top = `${Math.max(0, (document.documentElement.clientHeight - el.clientHeight) / 2)}px`;
      el.style.left = `${Math.max(0, (document.documentElement.clientWidth - el.clientWidth) / 2)}px`;
    })
  },
  created() {
    window.addEventListener('mousemove', this.move);
    window.addEventListener('mouseup', this.release);
  },
  destroy() {
    window.removeEventListener('mousemove', this.move);
    window.removeEventListener('mouseup', this.release);
  },
  computed: {
    isDraggable() {
      return this.window.draggable;
    },
    windowNameSlug() {
      return slugify(this.window.name.toLowerCase());
    }
  },
  methods: {
    noselect(evt) {
      evt.preventDefault();
    },
    hold(evt) {
      if (!util.hasClass(evt.target, 'vue-drag')) return;
      window.addEventListener('selectstart', this.noselect);

      let { left, top } = util.offset(evt.target);
      this.dragging.handler = evt.target;
      this.dragging.offsetLeft = evt.pageX - left;
      this.dragging.offsetTop = evt.pageY - top;
      this.focus();
    },
    move(evt) {
      if (!this.dragging.handler) return;

      let win = this.dragging.handler.offsetParent;
      let posX = util.clampRange(evt.pageX - this.dragging.offsetLeft, 0, document.documentElement.clientWidth - win.offsetWidth);
      let posY = util.clampRange(evt.pageY - this.dragging.offsetTop, 0, document.documentElement.clientHeight - win.offsetHeight);

      win.style.left = `${posX}px`;
      win.style.top = `${posY}px`;
    },
    release(evt) {
      window.removeEventListener('selectstart', this.noselect);
      this.dragging.handler = null;
    },
    focus() {
      this.$store.commit('focusWindow', { id: this.id })
    },
    dismiss() {
      this.$store.commit('closeWindow', { id: this.id })
    }
  }
}
</script>

<style lang="scss">
.vue-window {
  position: absolute;  
  border: 1px solid $base-color-bg;
  background: radial-gradient(darken($base-color, 40%) 0%, darken($base-color, 50%) 500%);
  transition: opacity .2s ease, transform .2s ease;

  header {       
    min-width: 200px;
    min-height: 16px;
    padding: 5px 25px;    
    background-color: rgba($base-color-bg, .6);
    color: lighten($base-color, 40%);
    box-shadow: 0 1px 1px rgba(black, .3), 0 0 0 1px rgba(white, .15) inset;
    .title {
      display: block;
      text-align: center;
      pointer-events: none;
    }
    .icon-close {
      position: absolute;
      right: 2px;
      top: 6px;
    }
  }
  main {
    padding: 10px;
  }
}

.windowfx-enter, .windowfx-leave-active {
  opacity: 0;
  transform: translateY(-50px) scale(0.2);
}
</style>
