<template>
  <div class="vue-button" :class="btnName">
    <router-link v-if="href" :to="href" class="button" :class="[ btnColor, btnActiveLink, btnDisabled, type ]">
      <vc-icon v-if="icon" :icon="icon"></vc-icon>
      <span v-if="$slots.default"><slot></slot></span>
    </router-link>
    <div v-else class="button" :class="[ btnColor, btnActive, btnDisabled, type ]" @click="btnClick">
      <vc-icon v-if="icon" :icon="icon"></vc-icon>
      <span v-if="$slots.default"><slot></slot></span>
    </div>   
    <vue-dropdown v-if="btnDropdown.data && btnDropdown.data.length" :dropdown="btnDropdown"></vue-dropdown> 
  </div>
</template>

<script>
//<vcIcon v-if="btnDropdown.data && btnDropdown.data.length" icon="arrow" fx="default"></vcIcon>
export default {
  props: [ "name", "icon", "img", "color", "type", "dropdown", "click", "href", "disabled" ],
  data() {
    return {
      btnDropdown: this.dropdown || { },
    }
  },
  computed: {
    btnName() {
      return (this.name) ? `button-${this.name}` : null;
    },
    btnColor() {
      return `col-${this.color || "default"}`;
    },
    btnActive() {
      return (this.btnDropdown.visible) ? "is-active" : false;
    },
    btnActiveLink() {
      return (this.$route.path.slice(1) == this.href) ? "is-active" : false;
    },
    btnDisabled() {
      return (this.disabled || (this.btnDropdown.data && !this.btnDropdown.data.length)) ? "disabled" : false;
    },
    btnIcon() {
      return `icon-${this.icon}`;
    }
  },
  methods: {
    btnClick() {      
      if (this.disabled) return;
      
      this.btnDropdown.visible = !this.btnDropdown.visible;
      if (typeof(this.click) == 'function') return this.click();
    }
  }
}
</script>

<style lang="scss">
@import '_funcs.scss';

.vue-button {
  position: relative;
  display: inline-flex;
  flex-direction: column;

  -webkit-user-select: none; 
	-moz-user-select: none;
  user-select: none;
}
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  color: $base-color;

  white-space: nowrap;	
  text-overflow: clip;
  overflow: hidden;
  cursor: pointer;

  > * {
    pointer-events: none;
  }
  i {
    font-weight: normal;
  }
  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.disabled {
    opacity: .4;
  }

  // Blizzard effects
  &.fill {
    padding: 5px 16px 5px 16px;
    border: 1px solid $base-color;
    background-color: $base-color-bg;
    color: lighten($base-color, 40%);
    box-shadow: 0 1px 1px rgba(black, .3), 0 0 0 1px rgba(white, .15) inset;
    
    transition: background-color .2s ease;
    &:not(.disabled) {
      &.is-active, &:hover {
        color: lighten($base-color, 40%);
        background-color: $base-color;
        text-shadow: 1px 1px 1px #000;
      }
    }
  }

  // Header effects
  &.header {
    padding: 8px 0;
    border-radius: 2px;
    color: $base-color;
    text-align: center;

    transition: color .2s ease, text-shadow .2s ease;
    &:after {
      content: "";
      position: absolute;
      height: 2px;
      top: 0;
      width: 0;
      background: linear-gradient(to right, lighten($base-color, 10%), $base-color, lighten($base-color, 10%));
      @include align-element('x', 50%);

      transition: .2s width ease;
    }

    &:not(.disabled) {
      &:hover, &.is-active {
        color: lighten($base-color, 30%);
        text-shadow: 0 0 1px $base-color;
      }

      &.is-active:after {
        width: 80%;
      }
    }
  }

  // No effects
  &.minimal {
    padding: 4px 8px 4px 8px;
    border: 1px solid $base-color;
    border-radius: 2px;

    transition: background-color .2s ease, border .2s ease, color .2s ease; 
    &:not(.disabled) {
      &.is-active, &:hover {
        border-color: lighten($base-color, 30%);
        color: lighten($base-color, 30%);
        background-color: rgba($base-color, .1);
      }
    }
  }

  // Yoko Anime effects
  &.translucent {
    padding: 8px 16px 8px 16px;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    border-radius: 4px;
    background-color: transparent;
    
    -webkit-transition: background-color .2s ease, border .2s ease, color .2s ease, padding .2s ease;
    -moz-transition: background-color .2s ease, border .2s ease, color .2s ease, padding .2s ease;
    -o-transition: background-color .2s ease, border .2s ease, color .2s ease, padding .2s ease;
    transition: background-color .2s ease, border .2s ease, color .2s ease, padding .2s ease; 

    &:not(.disabled) {
      &.is-active, &:hover {
        border-top: 1px solid $base-color;
        border-bottom: 1px solid $base-color;
        color: lighten($base-color, 30%);
        background-color: rgba(#000, .3);			

        .icon-arrow {
          opacity: 1;
        }
      }
    }
  }

  // Gradient effects
  &.gradient {
    padding: 5px 16px 5px 16px;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    border-radius: 2px;
    background: #000 linear-gradient(to bottom, $base-color, $base-color-bg);
    background-blend-mode: screen;
    color: lighten($base-color, 40%);
    text-shadow: 1px 1px 1px #000;
    transition: background .2s linear, border .2s ease; 

    &:not(.disabled) {
      &.is-active, &:hover {
        background-color: $base-color-2;
        border-top: 1px solid $base-color;
        border-bottom: 1px solid $base-color;

        .icon-arrow {
          opacity: 1;
        }
      }
    }
  }
}
</style>
