<template>
  <main class="vue_attendance">
    <vc-loading v-if="isLoading || loading.state" :message="loading.message" :error="loading.error"></vc-loading>
    <section v-else class="apply">
      <div v-if="$store.state.bnet == undefined" class="permissionWrapper">
        <h1>Permissions</h1>
        <div class="request">
          <h2><i class="icon-warning"></i>Fragmented is asking for your permission to identify:</h2>
          <span>Your battle.net tag</span> 
          <span>Your World of Warcraft characters</span> 
        </div>
        <div class="star">
          <span>Due to how Blizzard API works we require your permission to identify your battle.net tag and World of Warcraft characters, the information we will get from the Blizzard Authentication Server can only be used for this matter!</span>
          <span class="documentation">For more details please refer to <a href="https://develop.battle.net/documentation/guides/using-oauth/authorization-code-flow" target="_blank">their documentation</a>!</span>
        </div>
        <div class="authenticate">
          <a href="/blizzard/auth/callback" class="button fill login">Continue</a>
        </div>
      </div>
      <div v-else class="applicationWrapper">
        <h1 class="title">Apply to Fragmented</h1>
        <form class="application" action="/guild/apply" method="post">
          <div class="tab characterData">
            <h2 class="tabTitle">Character</h2>
            <div class="input battletag">
              <label class="input-label">BATTLE TAG</label>
              <input type="text" v-model="form.tag" disabled></input>
            </div>
            <div class="switch-user">
              <vc-button type="fill" :click="deauthorizeBNet.bind(null)">Switch Accounts</vc-button>
            </div>
            <div class="input battletag">
              <label class="input-label">CHARACTER</label>
              <vc-select :data="characterSelect"></vc-select>
            </div>
            <div class="input battletag">
              <label class="input-label">ROLE</label>
              <input type="text"></input>
            </div>
          </div>
          <div class="tab personalData">
            <h2 class="tabTitle">Personal</h2>
          </div>
          <div class="tab experienceData">
            <h2 class="tabTitle">Experience</h2>
          </div>
        </form>
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
        state: false,
        error: null,
        message: "Loading",
      },
      characters: [],
      form: { 
        characters: {
          selected: null,
          text: "Select a character",
          options: [],
          disabled: false,
        },
      }, 
      applications: [],
    }
  },
  async mounted() {
    if (!this.characters.length) await this.loadCharacters(this.$store.state.bnet);
  },
  async activated() {
    //console.log(this.characters);
  },
  computed: {
    characterSelect() {
      this.form.characters.options = [];
      for (let character of this.characters) {
        this.form.characters.options.push({ text: `(${character.level}) ${character.name} - ${character.realm}` });
      }
      return this.form.characters;
    },
    isLoading() {
      return (this.$store.state.bnet != -1) ? false : true;
    }
  },
  methods: {
    async deauthorizeBNet() {
      //
    },
    async loadCharacters(bnet) {
      if (bnet == undefined || bnet == -1) return;

      this.form.tag = bnet.battletag;
      try {
        this.loading.state = true;
        this.loading.message = "Retrieving characters";
        let response = await axios.post('/blizzard/characters', {
          token: bnet.token
        });
        this.loading.state = false;
        this.addCharacters(response.data);
      }
      catch(e) {
        this.loading.error = true;
        this.loading.message = e;
      }
    },
    addCharacters(characters) {
      this.characters = characters;
    }
  },
  watch: {
    '$store.state.bnet': async function(newVal, oldVal) {
      await this.loadCharacters(newVal);
    }
  }
}
</script>

<style lang="scss">
@import "_funcs.scss";

.apply {
  .applicationWrapper {
    display: flex;
    flex-direction: column;
    form.application {
      flex: 1;
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 400px;
      grid-column-gap: 10px;
      justify-content: center;
      padding: 10px;
      .tab {
        background-color: rgba(darken($base-color-2, 10%), .4);
        padding: 10px 50px 10px 50px;
        border-radius: 2px;

        .tabTitle {
          text-align: center;
        }

        .switch-user {
          margin: 8px 0;
          text-align: center;
        }
      }
    }
  }
  .permissionWrapper {
    display: flex;
    flex-direction: column;
    align-items: center; 
    justify-content: center;
    align-self: center;
    justify-self: center;
    width: 1024px;
    height: 576px;
    padding: 40px;
    border: 1px solid $base-color-bg;
    border-radius: 2px;
    background: $base-color-bg url('~assets/images/blizzard.jpg') no-repeat center top;
    color: lighten($base-color, 40%);

    h1 {
      font-size: 40px;
      font-weight: 400;
      margin: 0;
    }
    .request {
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
            color: $base-color;
            &:hover {
              color: lighten($base-color, 20%);
            }
          }
        }        
      }
    }
    .login {
      width: 200px;
      padding: 10px 50px 10px 50px;
    }   
  }
}
</style>
