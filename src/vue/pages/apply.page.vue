<template>
  <main class="vue_attendance">
    <vc-loading v-if="isLoading" :message="loading.message" :error="loading.error"></vc-loading>
    <section v-else class="apply">
      <div v-if="$store.state.bnet == undefined" class="blizzard">
        <h1>Permissions</h1>
        <div class="permission">
          <h2><i class="icon-warning"></i>Fragmented is asking for your permission to access:</h2>
          <span>Your battle.net tag</span> 
          <span>Your World of Warcraft characters</span> 
        </div>
        <div class="star">
          <span>Due to how Blizzard API works we require your permission to access your battle.net tag and World of Warcraft characters, the information we will get from the Blizzard Authentication Server can only be used for this matter!</span>
          <span class="documentation">For more details please refer to <a href="https://develop.battle.net/documentation/guides/using-oauth/authorization-code-flow" target="_blank">their documentation</a>!</span>
        </div>
        <div class="authenticate">
          <a href="/blizzard/auth/callback" class="vue-button login">Continue</a>
        </div>
      </div>
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
        error: null,
        message: "Retrieving user",
      },
      applications: [],
    }
  },
  async mounted() {

  },
  computed: {
    isLoading() {
      return (this.$store.state.bnet != -1) ? false : true;
    }
  },
  methods: {

  }  
}
</script>

<style lang="scss">
.apply {
  align-items: center;
  justify-content: center;
  .blizzard {
    display: flex;
    flex-direction: column;
    align-items: center; 
    justify-content: center;
    width: 1024px;
    height: 576px;
    padding: 40px;
    border: 1px solid #0e86ca;
    border-radius: 2px;
    background: #0e86ca url('~assets/images/blizzard.jpg') no-repeat center top;
    color: white;
    h1 {
      font-size: 40px;
      font-weight: 400;
      margin: 0;
    }
    .permission {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      h2 {
        display: flex;
        align-items: center;
        font-weight: 400;
        i {
          margin-right: 10px;
        }
      }
      span {
        margin: 2px;
      }
    }
    .star {
      margin: 20px 0;
      max-width: 630px;
      font-size: 12px;
      text-align: center;

      span {
        display: block;
        i {
          margin-right: 2px;
          vertical-align: middle;
        }
        &.documentation {
          margin-top: 10px;
          a {
            color: #10a1de;
            &:hover {
              color: lighten(#10a1de, 20%); 
              text-shadow: 0 0 1px #10a1de !important;
            }
          }
        }        
      }
    }
    .authenticate {
      display: flex;
      .login {
        flex: 1;
        width: 200px;
        padding: 10px 50px 10px 50px;
        color: white;
        background-color: #0e86ca;
        border: 1px solid #10a1de;
        box-shadow: 0 1px 1px rgba(black, .3), 0 0 0 1px rgba(white, .15) inset;

        transition: background-color .2s ease;
        &:hover {
          background-color: #10a1de;
        }
      }
    }

    
  }
}
</style>
