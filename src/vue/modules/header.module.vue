<template>
  <header class="vue-header">
    <router-link to="/" class="logo"></router-link>
    <div class="middle">
      <vc-header-button icon="warning" name="raids" href="raids">Raids</vc-header-button>
      <vc-header-button icon="warning" name="attendance" href="attendance">Attendance</vc-header-button>
      <vc-header-button icon="warning" name="flask" href="flask">Flasks</vc-header-button>
      <vc-header-button icon="warning" name="members" href="members">Members</vc-header-button>
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
header {
  position: relative;
  // grid attributes
  display: grid;
  align-items: center;
  grid-template-columns: 200px 1fr minmax(120px, auto);
  grid-column-gap: 10px;
  // end
  padding: 0 10px;
  background: linear-gradient(to bottom, rgba(darken($base-color, 20%), .1), rgba($base-color, .1));
  &:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    //background: linear-gradient(to right, lighten($base-color, 10%), $base-color, lighten($base-color, 10%));
  }

  .logo {
    background: url('~assets/images/logo.png') no-repeat center center / cover;
    height: 48px;
    transition: opacity .2s ease;
    &:hover {
      opacity: .4;
    }
  }
  .middle {
    display: flex;
    border-right: 1px solid;

    .vue-header-button {
      flex: 1;
      display: inline-block;
    }
  }
  .auth {
    display: flex;
    justify-content: center;
  }
}
</style>
