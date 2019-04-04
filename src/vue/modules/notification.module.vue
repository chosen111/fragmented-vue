<template>
  <transition-group tag="section" class="vue-notification" name="notificationfx">
    <div v-for="(notification, index) in notifications" :key="notification.id" class="notification" :class="notification.type">
      <vc-icon icon="warning"></vc-icon>
      <span class="message">{{ notification.text }} : {{ notification.id || index }}</span>
    </div>
  </transition-group>
</template>

<script>
export default {
  computed: {
    notifications() {
      return this.$store.getters.getNotifications;
    }
  }
}
</script>

<style lang="scss">
.vue-notification {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 110px;
  overflow: hidden;

  .notification {
    display: flex;
    align-items: center;
    height: 32px; // 40px;
    padding: 0 10px 0 10px;
    margin: 2px 5px 2px 5px;
    border: 1px solid $teal;
    border-radius: 5px;
    background-color: darken($teal, 40%);
    font-weight: 600;
    opacity: 1;

    &.alert {
      color: $lred;
      border-color: $lred;
      background-color: darken($lred, 55%);
    }
    &.warning {
      color: $mustard;
      border-color: $mustard;
      background-color: darken($mustard, 40%);
    }
    i {
      margin-right: 10px;
    }
  }
}

.notificationfx-enter-active, .notificationfx-leave-active {
  transition: height .4s, opacity .4s;
}
.notificationfx-enter, .notificationfx-leave-to {
  opacity: 0 !important;
  height: 0 !important;
}
</style>