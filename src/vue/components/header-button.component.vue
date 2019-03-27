<template>
  <router-link v-if="href" :to="href" class="vue-header-button" :class="[ btnName, btnActive, btnDisabled ]">
    <i class="icon" :class="[ btnIcon ]"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </router-link> 
</template>

<script>
export default {
  props: [ "name", "icon", "href", "disabled" ],
  computed: {
    btnName() {
      return (this.name) ? `button-${this.name}` : null;
    },
    btnActive() {
      return (this.$route.path.slice(1) == this.href) ? "is-active" : false;
    },
    btnDisabled() {
      return (this.disabled) ? "disabled" : false;
    },
    btnIcon() {
      return `icon-${this.icon}`;
    }
  },
}
</script>

<style lang="scss">
@import '_funcs.scss';

.vue-header-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  border-radius: 2px;
  color: $base-color;
  text-align: center;

  white-space: nowrap;	
  text-overflow: clip;
  overflow: hidden;
  cursor: pointer;

  -webkit-user-select: none; 
	-moz-user-select: none;
  user-select: none;

  transition: .2s color ease;

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

  &:hover, &.is-active {
    color: lighten($base-color, 30%);
  }

  &.is-active:after {
    width: 80%;
  }
}
</style>
