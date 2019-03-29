<template>
  <div class="dropdown" :class="[ dropdownStyle, dropdownActive ]">
    <vue-button v-for="(item, id) in dropdown.data" :key="id" v-bind="item"></vue-button>
  </div>
</template>

<script>
export default {
  props: [ "dropdown" ],
  computed: {
    dropdownStyle() {
      return this.dropdown.style || "inline";
    },
    dropdownActive() {
      return (this.dropdown.visible) ? "is-active" : false;
    }
  }
}
</script>

<style lang="scss">
div.dropdown.absolute {
  position: absolute;
  left: 0;
  right: 0;
  top: 45px;
  max-height: 0;
  border-left: 2px solid $base-color;
  border-right: 2px solid $base-color;
  //background-image: url("~assets/images/bg-components.jpg");
  border-radius: 4px;
  padding: 0 4px 0 4px;
  overflow-y: auto;
  z-index: 10;
  
  transition: max-height .4s ease, margin .4s ease;
  &.is-active {
    max-height: 165px;
  }

  .vue-button {      
    display: block;
    &:first-child .button {
      margin-top: 2px;
    }
    &:last-child .button {
      margin-bottom: 2px;
    }
    .button {
      padding: 2px 4px 2px 4px;
      margin: 4px 0 4px 0;
      background-color: rgba(#000, .5);
      text-overflow: clip;
    }
  }
}

div.dropdown.inline {
  max-height: 0;
  margin: 0 10px 0 10px;
  border-left: 2px solid $base-color;
  border-radius: 4px;
  padding: 0 4px 0 4px;
  overflow-y: auto;

  transition: max-height .4s ease, margin .4s ease;
  &.is-active {
    margin: 4px 10px 4px 10px;
    max-height: 165px;
  }
  
  .__vc-button {      
    display: block;
    &:first-child .button {
      margin-top: 2px;
    }
    &:last-child .button {
      margin-bottom: 2px;
    }
    .button {
      padding: 2px 4px 2px 4px;
      margin: 4px 0 4px 0;
      background-color: rgba(#000, .5);
      text-overflow: clip;
    }
  }
}
</style>
