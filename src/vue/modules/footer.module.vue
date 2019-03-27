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
  display: grid;
  grid-auto-columns: auto;
  align-items: center;
  justify-content: center;

  background: linear-gradient(to top, rgba(darken($base-color, 20%), .1), rgba($base-color, .1));
}

</style>
