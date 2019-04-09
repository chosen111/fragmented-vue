<template>
  <header class="vue-header">
    <router-link to="/" class="logo">
      <img height="110px" src="~assets/images/fragmented_v2.png" />
    </router-link>
    <div class="middle">
      <vc-button type="header" icon="warning" name="members" href="members">Members</vc-button>
      <vc-button type="header" icon="warning" name="raids" href="raids">Raids</vc-button>
      <vc-button type="header" icon="warning" name="attendance" href="attendance">Attendance</vc-button>
      <vc-button type="header" icon="warning" name="flask" href="flask">Flasks</vc-button>
      <vc-button type="header" icon="warning" name="contact" href="contact">Contact Us</vc-button>
      <vc-button type="header" icon="warning" name="apply" href="apply">Apply</vc-button>
    </div>
    <div class="auth">
      <vc-button type="fill">Log In</vc-button>
    </div>
  </header>
</template>

<script>
export default {

}
</script>

<style lang="scss">
@import '_funcs.scss';

.vue-header {
  position: relative;
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr 120px;
  grid-column-gap: 10px;
  padding: 0 10px;
  background: linear-gradient(to bottom, rgba(darken($base-color, 20%), .1), rgba($base-color, .1));
  &:before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: linear-gradient(to right, lighten($base-color, 10%), $base-color, lighten($base-color, 10%));
    opacity: .4;
  }  
  .middle {
    display: flex;
    border-right: 1px solid;

    .vue-button {
      flex: 1;
    }
  }
  .logo {
    height: 0;
    align-self: stretch;
    transition: opacity .2s ease;
    &:hover {
      opacity: .6;
    }
  }
  .auth {
    display: flex;
    justify-content: center;
  }
}
</style>
