<template>
  <main class="vue_attendance">
    <Loading v-if="loading" message="Loading"></Loading>
    <section v-else class="attendance">
      <h1 class="title">ATTENDANCE</h1>
    </section>
  </main>
</template>

<script>
export default { 
  props: [],
  data() {
    return {
      calendar: null,
      loading: true,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
