<template>
  <main class="vue_attendance">
    <vc-loading v-if="loading.state" :message="loading.message" :error="loading.error"></vc-loading>
    <section v-else class="apply">
      <a href="/blizzard/auth/callback">Login</a>
    </section>
  </main>
</template>

<script>
import axios from 'axios';
import slugify from 'slugify';

export default { 
  props: [],
  data() {
    return {
      loading: {
        state: false,
        error: null,
        message: "Loading",
      },
      applications: [],
    }
  },
  async mounted() {
    try {
      let response = await axios.post('/blizzard/profile');
      console.log(response);
    }
    catch(e) {
      this.loading.error = true;
      this.loading.message = e;
    }
  },
  methods: {

  }  
}
</script>

<style lang="scss">
.attendance {
  display: flex;
  flex-direction: column;
  padding: 10px;

  .attendanceWrapper {
    display: grid;
    grid-template-columns: 400px auto;
    border: 1px solid $base-color;
    border-radius: 4px;
    background-color: rgba(darken($base-color, 20%), .1);

    .membersTitle, .raidsTitle {
      padding: 5px 0;
      background-color: rgba(darken($base-color, 20%), .5);
      border-bottom: 1px solid $base-color;
      text-align: center;
    }

    .members {
      border-right: 1px solid;

      .member {
        padding: 4px 8px;
        margin: 5px 0;
        background-color: rgba($base-color, .1);
      }
    }

    .data {
      display: grid;
      grid-auto-columns: minmax(400px, 1fr);
      grid-auto-flow: column;
      overflow-x: auto;

      [class*="raid-"] {
        .status .member {
          padding: 4px 8px;
          margin: 5px 0;
          background-color: rgba($base-color, .1);
        }
      }
    }
  }
}
</style>
