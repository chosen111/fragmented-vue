<template>
  <div class="vue-input">
    <textarea v-if="isTextarea" :placeholder="$slots.default" v-model="value" :disabled="disabled" />
    <input v-else :type="type" :placeholder="$slots.default" v-model="value" :disabled="disabled" />
    <vc-icon v-if="error" icon="warning" v-tooltip="{ text: error, type: 'alert' }"></vc-icon>
  </div>
</template>

<script>
export default {
  props: [ "type", "input", "error", "disabled" ],
  data() {
    return {
      value: this.input
    }
  },
  computed: {
    isTextarea() {
      return (this.type == 'textarea') ? true : false;
    }
  },
  watch: {
    'value': function(to, from) {
      this.$emit('update:input', to);
    }
  }
}
</script>

<style lang="scss">
.vue-input {
  display: flex;
  position: relative;
  flex-direction: column;

  .icon-warning {
    position: absolute;
    right: 0;
    top: 4px;
    color: $lred;
    animation: .4s flashError ease-in-out;
  }
}
</style>
