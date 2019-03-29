<template>
  <header class="vue-header">
    <router-link to="/" class="logo">
      <img height="110px" src="~assets/images/fragmented-logo.png" />
    </router-link>
    <div class="middle">
      <vc-header-button icon="warning" name="members" href="members">Members</vc-header-button>
      <vc-header-button icon="warning" name="raids" href="raids">Raids</vc-header-button>
      <vc-header-button icon="warning" name="attendance" href="attendance">Attendance</vc-header-button>
      <vc-header-button icon="warning" name="flask" href="flask">Flasks</vc-header-button>
      <vc-header-button icon="warning" name="contact" href="contact">Contact Us</vc-header-button>
      <vc-header-button icon="warning" name="apply" href="apply">Apply</vc-header-button>
    </div>
    <div class="auth">
      <vc-button type="gradient">Log In</vc-button>
    </div>
  </header>
</template>

<script>
export default {

}
</script>

<style lang="scss">
@import '_funcs.scss';

header {
  position: relative;
  // grid attributes
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr 120px;
  grid-column-gap: 10px;
  // end
  padding: 0 10px;
  background: linear-gradient(to bottom, rgba(darken($base-color, 20%), .1), rgba($base-color, .1));
  &:before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    //background: linear-gradient(to right, lighten($base-color, 10%), $base-color, lighten($base-color, 10%));
  }  
  .middle {
    display: flex;
    border-right: 1px solid;

    .vue-header-button {
      flex: 1;
      display: inline-block;
    }
  }
  .logo {
    align-self: stretch;
    height: 0;
    transition: opacity .2s ease;
    text-align: center;
    &:hover {
      opacity: .4;
    }
    z-index: 1;
  }
  .auth {
    display: flex;
    justify-content: center;
  }
}
</style>
