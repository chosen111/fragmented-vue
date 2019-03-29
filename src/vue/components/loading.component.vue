<template>
  <div class="loading" :class="{ fail: error }">
    <div class="spinner">
      <span v-if="error">Failed</span>
      <span v-else>Loading</span>
    </div>
    <div v-if="message" class="message">
      <vc-icon v-if="error" icon="warning"></vc-icon>
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script>
export default { 
  props: ["message", "error"],
}
</script>

<style lang="scss">
@import '_funcs.scss';

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0;

  animation: fadeIn .8s ease .2s forwards;
  &.fail {
    .spinner {
      border-color: $lred;
      span {
        color: $lred;
      }
      &:after {
        display: none;
      }
    }
    .message {
      border: 1px solid $lred;
      color: $lred;
      background-color: rgba(darken($lred, 50%), .6);      
      animation: none;

      .icon-warning {
        display: inline-block;
        margin-right: 5px;
      }
    }      
  }
  .spinner {
    position: relative;
    width: 80px;
    height: 80px;
    border: 3px solid rgba(darken($base-color, 15%), .6);		
    border-radius: 100px;
    background-color: rgba(#000, .5);
    text-align: center;		

    span {
      position: absolute;
      width: 100%;
      @include align-element('both', 50%);
    }

    &:after {
      content: "";
      position: absolute;
      left: -3px; top: -3px;
      padding: 40px;
      border: 3px solid transparent;
      border-top: 3px solid $base-color;
      border-radius: 100px;
      animation: rotate .8s linear infinite;
    }
  }

  .message {
    margin-top: 14px;
    padding: 5px 10px 5px 10px;
    border-radius: 4px;

    animation: blink 2s ease infinite;
  }
}
</style>
