<template>
  <router-link v-if="href" :to="href" class="vue-button" :class="[ btnColor, type ]">
    <i v-if="icon" :class="icon"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </router-link>
  <div v-else class="vue-button" :class="[ btnColor, btnActive, btnDisabled, type ]" @click="btnClick">
    <i v-if="icon" :class="icon"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </div>    
</template>

<script>
//<vcIcon v-if="btnDropdown.data && btnDropdown.data.length" icon="arrow" fx="default"></vcIcon>
export default {
  props: [ "name", "icon", "img", "color", "type", "dropdown", "click", "href", "disabled" ],
  data() {
    return {
      btnDropdown: this.dropdown || { },
      //uuid: util.uuid_v4()
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
    btnDisabled() {
      return (this.disabled || (this.btnDropdown.data && !this.btnDropdown.data.length)) ? "disabled" : false;
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
.vue-button {
  display: flex;
  align-items: center;
  justify-content: center;
  color: $base-color;

  white-space: nowrap;	
  text-overflow: clip;
  overflow: hidden;
  cursor: pointer;

  -webkit-user-select: none; 
	-moz-user-select: none;
  user-select: none;

  > * {
    pointer-events: none;
  }
  i {
    font-weight: normal;
    margin-right: 6px;
  }
  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.disabled {
    opacity: .4;
  }

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
  &.gradient {
    padding: 5px 16px 5px 16px;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    border-radius: 2px;
    background: #000 linear-gradient(to bottom, $base-color, darken($base-color, 10%));
    background-blend-mode: screen;
    color: lighten($base-color, 40%);
    text-shadow: 1px 1px 1px #000;
    transition: background .2s linear, border .2s ease; 

    &:not(.disabled) {
      &.is-active, &:hover {
        background-color: darken($base-color, 30%);
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
