<template>
  <footer class="vue-footer">
    <span class="copyright">© 2019 Fragmented - All rights reserved</span>
  </footer>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.vue-footer {
  position: relative;
  display: grid;
  grid-auto-columns: auto;
  align-items: center;
  justify-content: center;

  background: linear-gradient(to top, rgba(darken($base-color, 20%), .1), rgba($base-color, .1));
  &:before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 1px;
    background: linear-gradient(to right, lighten($base-color, 10%), $base-color, lighten($base-color, 10%));
    opacity: .4;
  }
}
</style>
