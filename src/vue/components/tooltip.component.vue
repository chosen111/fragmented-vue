<template>
  <transition name="tooltipfx">
    <div v-if="tooltip" class="vue-tooltip" :class="[ tooltip.type, arrow ]" :style="tooltipPosition">
      <span>{{ tooltip.text }}</span>
    </div>
  </transition>
</template>

<script>
import util from '../../util.js';

export default {
  data() {
    return {
      position: null,
      arrow: null
    }
  },
  computed: {
    tooltip() {
      return this.$store.getters.getTooltip;
    },
    tooltipPosition() {
      return this.position;
    }
  },
  watch: {
    'tooltip': function(to, from) {
      if (!to) return;      
      this.$nextTick(function() {        
        let el = to.element;
        let tooltip = this.$el;

        let { left, top } = util.offset(el);
        let preset = {
          top: document.documentElement.clientHeight-top+10,
          middle: top+el.offsetHeight/2-tooltip.offsetHeight/2,
          bottom: top+el.offsetHeight+10,
          left: document.documentElement.clientWidth-left+10,
          center: left+el.offsetWidth/2-tooltip.offsetWidth/2,
          right: left+el.offsetWidth+10
        }
        let position = { 
          x: { css: "left", px: preset.center },
          y: { css: "bottom", px: preset.top }
        }
        this.arrow = "bottom";

        if (position.x.px - tooltip.offsetWidth <= 0 || position.x.px + tooltip.offsetWidth >= document.documentElement.clientWidth) {
          position.y = { css: "top", px: preset.middle }
          if (position.x.px - tooltip.offsetWidth <= 0) {
            position.x = { css: "left", px: preset.right }
            this.arrow = "left";
          }
          if (position.x.px + tooltip.offsetWidth >= document.documentElement.clientWidth) {
            position.x = { css: "right", px: preset.left }
            this.arrow = "right"
          }
        }
        else {
          if (top-tooltip.offsetHeight-10 <= 0) {
            position.y = { css: "top", px: preset.bottom }
            this.arrow = "top";
          }      
        }
        this.position = { }
        this.position[position.x.css] = `${position.x.px}px`;
        this.position[position.y.css] = `${position.y.px}px`;
      })      
    }
  }
}
</script>

<style lang="scss">
.vue-tooltip {
  position: absolute;
  display: flex;
  align-items: center;
  padding: 4px 6px 4px 6px;
  border-radius: 2px;
  border-color: $base-color;
  border: 1px solid;
  background-color: darken($base-color, 40%);
  font-size: 13px;
  white-space: pre;
  z-index: 5000;

  &.alert {
    border-color: $lred;
    border: 1px solid;
    color: $lred;
    background-color: darken($lred, 55%);
  }
  
  transition: opacity .2s ease;
  &:before, &:after {
    content: "";
    display: block;
    position: absolute;		    
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    pointer-events: none;
  }
  
  &.top:before, &.top:after, &.bottom:before, &.bottom:after {
    left: 50%;
    transform: translateX(-50%);		
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
  }

  &.left:before, &.left:after, &.right:before, &.right:after {
    top: 50%;
    transform: translateY(-50%);
    border-top: 7px solid transparent;
    border-bottom: 7px solid transparent;
  }

  &.top:before, &.top:after {
    top: 0;
  }
  &.bottom:before, &.bottom:after {
    top: 100%;
  }
  &.left:before, &.left:after {
    left: 0;
  }
  &.right:before, &.right:after {
    left: 100%;
  }
  &.right {
    &:before {
      border-left: 5px solid;
    }
    &:after {
      z-index: 10;
      margin-left: -1px;
    }
    &.default:after { border-left: 5px solid darken($base-color, 40%); }
    &.alert:after { border-left: 5px solid darken($lred, 55%); }
  }
  &.bottom {
      &:before {
          border-top: 5px solid;
      }
      &:after {
          margin-top: -1px;
          z-index: 10;   
      }
      &.default:after { border-top: 5px solid darken($base-color, 40%); }
      &.alert:after { border-top: 5px solid darken($lred, 55%); }
  }
  &.left {
      &:before {
          left: -13px;
          border-right: 5px solid;
      }
      &:after {
          left: -12px;
          z-index: 10;
      }
      &.default:after { border-right: 5px solid darken($base-color, 40%); }
      &.alert:after { border-right: 5px solid darken($lred, 55%); }
  }
  &.top {
      &:before {
          top: -6px;
          border-bottom: 5px solid;
      }

      &:after {
          top: -5px;
          z-index: 10;
      }
      &.default:after { border-bottom: 5px solid darken($base-color, 40%); }
      &.alert:after { border-bottom: 5px solid darken($lred, 55%); }
  }

  i {
      margin-right: 5px;
  }
}

.tooltipfx-enter, .tooltipfx-leave-to {
  opacity: 0 !important;
}

</style>
