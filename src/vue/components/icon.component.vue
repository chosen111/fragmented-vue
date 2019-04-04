<template>
  <router-link v-if="href" :to="href" class="icon" :class="[ iconName, iconImage, iconSize, iconFX, iconCursor ]" :style="iconStyle"></router-link>
  <i v-else class="icon" :class="[ iconName, iconImage, iconSize, iconFX, iconCursor ]" :style="iconStyle" @click.stop="btnClick"></i>
</template>

<script>
export default {
  props: [ "icon", "size", "fx", "click", "img", "spacing", "href", "disabled" ],
  computed: {
    iconName() {
      return (this.icon) ? `icon-${this.icon}` : null;
    },
    iconImage() {
      return (this.img) ? `icon-is-img` : null;
    },
    iconSize() {
      return `icon-size-${this.size || "s"}`;
    },
    iconFX() {
      return (this.fx) ? `icon-fx-${this.fx}` : null;
    },
    iconCursor() {
      return (this.disabled) ? `icon-is-disabled` : (this.click) ? `icon-is-pointer` : null;
    },
    iconStyle() {
      let style = { }

      if (this.img) return { backgroundImage: `url('${this.img}')` };
      style.margin = this.spacing || "0 6px 0 0";

      return style;
    }
  },
  methods: {
    btnClick() {
      if (typeof(this.click) == 'function') return this.click();
    }
  }
}
</script>

<style lang="scss">
@font-face {
  font-family: 'fragmentedico';
  src:  url('~assets/fonts/fragmentedico.eot?4m2ft8');
  src:  url('~assets/fonts/fragmentedico.eot?4m2ft8#iefix') format('embedded-opentype'),
    url('~assets/fonts/fragmentedico.ttf?4m2ft8') format('truetype'),
    url('~assets/fonts/fragmentedico.woff?4m2ft8') format('woff'),
    url('~assets/fonts/fragmentedico.svg?4m2ft8#fragmentedico') format('svg');
  font-weight: normal;
  font-style: normal;
}

$icon-locked: "\e901";
$icon-mail: "\f0e0";
$icon-sq-twitter: "\f081";
$icon-sq-facebook: "\f082";
$icon-twitter: "\f099";
$icon-facebook: "\f09a";
$icon-rarrow: "\f054";
$icon-larrow: "\f053";
$icon-check: "\f00c";
$icon-close: "\f00d";
$icon-warning: "\f071";

.icon {
  font-family: 'fragmentedico' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  text-shadow: 1px 1px 0 #000;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  &.icon-is-img {
    background-position: center;
    background-size: cover;
    width: 13px;
    height: 13px;
  }

  &.icon-size-m {
    font-size: 16px;
    &.icon-is-img {
      width: 16px;
      height: 16px;
    }
  }
  &.icon-size-l {
    font-size: 20px;
    &.icon-is-img {
      width: 20px;
      height: 20px;
    }
  }
  &.icon-size-xl {
    font-size: 24px;
    &.icon-is-img {
      width: 24px;
      height: 24px;
    }
  }

  &.icon-is-disabled {
    color: rgba($base-color, .4);
  }  

  &:not(.icon-is-disabled).icon-fx-default {
    transition: color .2s ease;
    &.icon-arrow {
      transition: opacity .2s ease;
    }
    &:hover {
      color: lighten($base-color, 40%);
    }
    &.col-red:hover {
      color: lighten($red, 20%);
    }
    &.col-amber:hover {
      color: lighten($lred, 20%);
    }
    &.col-yellow:hover {
      color: lighten($mustard, 30%);
    }
  }

  &.icon-is-pointer {
    cursor: pointer;
  }
  &.icon-is-disabled {
    cursor: not-allowed;
  }

  &.icon-locked:before {
    content: $icon-locked; 
  }
  &.icon-mail:before {
    content: $icon-mail;
  }
  &.icon-sq-facebook:before {
    content: $icon-sq-facebook;
  }
  &.icon-sq-twitter:before {
    content: $icon-sq-twitter;
  }
  &.icon-facebook:before {
    content: $icon-facebook;
  }
  &.icon-twitter:before {
    content: $icon-twitter;
  }
  &.icon-rarrow:before {
    content: $icon-rarrow;
  }
  &.icon-larrow:before {
    content: $icon-larrow;
  }
  &.icon-check:before {
    content: $icon-check;
  }
  &.icon-close:before {
    content: $icon-close;
  }
  &.icon-warning:before {
    content: $icon-warning;
  }
  &.icon-arrow {
    border: none;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #00dfa6;
    
    opacity: 0;
  }	
}
</style>
