<template>
  <div class="vue-select">
    <div class="select" :class="{ 'is-active': isActive, 'disabled': disabled }" @click="open">
      <label class="select-label">{{ text }}</label>
      <vc-icon icon="arrow" fx="default"></vc-icon>
    </div>
    <ul class="select-dropdown" :class="{ 'is-active': isActive }">
      <li v-for="(option, id) in select.options" :key="id" class="option" @click="selectOption(id)">
        <label class="option-label">{{ option.text }}</label>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: [ "select", "disabled" ],
  data() {
    return {
      isActive: false,
    }
  },
  computed: {
    text() {
      return (this.select.selected != null) ? this.select.options[this.select.selected].text : this.select.text;
    }
  },
  methods: {
    open() {
      if (this.disabled) return;
      this.isActive = !this.isActive;
    },
    selectOption(id) {
      if (this.disabled) return;

      this.isActive = false;
      this.select.selected = id;
      
      if (typeof(this.select.ack) == 'function') {
        this.select.ack(id)
      }
    }
  }
}
</script>

<style lang="scss">
.vue-select {
  flex: 1; 
  display: inline-flex;
  flex-direction: column;
  position: relative;

  .select {
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 0 0 2px 2px;
    background-color: rgba($base-color, 0.2);
    color: $base-color;
    font-weight: 600;

    white-space: nowrap;	
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;

    transition: background-color .2s ease, border .15s ease, color .2s ease; 
    > * {
      pointer-events: none;
    }

    .icon {
      top: 1px;
      font-weight: normal;
    }

    .select-label {
      flex: 1;
      margin: 0 4px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .icon-arrow {
      margin-left: 8px;
    }

    &.disabled {
      opacity: .4;
      cursor: not-allowed;
    }
    
    &:not(.disabled) {
      &.is-active, &:hover {
        border-color: lighten($base-color, 20%);
        color: lighten($base-color, 30%);
        background-color: rgba(#000, .3);			

        .icon-arrow {
          opacity: 1;
        }
      }
    }
  }
  .select-dropdown {
    position: absolute;
    left: 0;
    right: 0;
    top: 25px;
    max-height: 0;
    border-left: 2px solid $base-color;
    border-right: 2px solid $base-color;
    background-color: darken($base-color-2, 20%);
    border-radius: 4px;
    overflow-y: auto;
    z-index: 1;

    transition: max-height .4s ease;
    &.is-active {
      max-height: 205px;
    }

    .option {
      display: block;
      padding: 2px 4px 2px 4px;
      margin: 2px 0 2px 0;
      border-top: 1px solid transparent;
      border-bottom: 1px solid transparent;
      background-color: transparent;
      color: $base-color;
      font-size: 13px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;

      -webkit-transition: background-color .2s ease, border .15s ease, color .2s ease;
      -moz-transition: background-color .2s ease, border .15s ease, color .2s ease;
      -o-transition: background-color .2s ease, border .15s ease, color .2s ease;
      transition: background-color .2s ease, border .15s ease, color .2s ease; 
      cursor: pointer;      
      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }

      &:hover {
        border-top: 1px solid $base-color;
        border-bottom: 1px solid $base-color;
        color: lighten($base-color, 30%);
        background-color: rgba($base-color, .3);			
      }

      > * {
        pointer-events: none;
      }
    }
  }
}
</style>
