// https://wow.gamepedia.com/Wowpedia:List_of_mini_icons
// https://wow.gamepedia.com/Category:WoW_Icons
<template>
  <main class="vue_attendance">
    <vc-loading v-if="isLoading" v-bind="$store.getters.getLoading"></vc-loading>
    <section v-else class="apply">
      <div v-if="$store.state.bnet == undefined" class="permission-wrapper">
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
          <a href="/blizzard/auth/callback" class="button fill login custom">Continue</a>
        </div>
      </div>
      <div v-else class="application-wrapper">
        <h1 class="title">Apply to Fragmented</h1>
        <form class="application" action="/guild/apply" method="post">
          <div class="tab character-data">
            <h2 class="tab-title">Character</h2>
            <div class="input battletag">
              <label class="input-label">BATTLE TAG</label>
              <input type="text" v-model="form.tag" disabled />
            </div>
            <div class="switch-user">
              <vc-button type="fill" :click="deauthorizeBNet.bind(null)">Switch Accounts</vc-button>
            </div>
            <div class="input charater">
              <label class="input-label">CHARACTER</label>
              <vc-select :data="bind.characterSelect"></vc-select>
            </div>
            <div class="input role">
              <label class="input-label">ROLE</label>
              <div class="role-container">
                <div class="custom-checkbox">
                  <input type="checkbox" name="role" v-model="form.role.tank" :disabled="form.isDisabled">
                  <span class="checkmark tank"></span>
                </div>
                <div class="custom-checkbox">
                  <input type="checkbox" name="role" v-model="form.role.healer" :disabled="form.isDisabled">
                  <span class="checkmark healer"></span>
                </div>
                <div class="custom-checkbox">
                  <input type="checkbox" name="role" v-model="form.role.dps" :disabled="form.isDisabled">
                  <span class="checkmark dps"></span>
                </div>
              </div>
            </div>
            <div v-if="performance.length" class="rankings">
              <label class="input-label">PERFORMANCE ({{ getRankingDifficulty }})</label>
              <div class="encounters">
                <a v-for="(parse, index) in performance" :key="index" class="parse custom" :class="[ getParseColor(parse.percentile) ]" :href="`https://www.warcraftlogs.com/reports/${parse.reportId}#fight=${parse.fightId}&type=damage-done`" target="_blank">
                  <span class="encounter">{{ parse.encounter }}</span>
                  <span class="percentile">{{ parse.percentile }}</span>
                </a>
              </div>
            </div>
          </div>
          <div class="tab personal-data">
            <h2 class="tab-title">Personal</h2>
            <div class="input about-me">
              <label class="input-label">Short description of you (include your name)</label>
              <textarea v-model="form.aboutMe" />
            </div>
            <div class="input apply-reason">
              <label class="input-label">Why are you applying to Fragmented?</label>
              <textarea v-model="form.applyReason" />
            </div>
            <div class="input leave-reason">
              <label class="input-label">Why did you leave the previous guild?</label>
              <textarea v-model="form.leaveReason" />
            </div>
            <div class="input addition">
              <label class="input-label">Why do you think you can be a valuable addition?</label>
              <textarea v-model="form.addition" />
            </div>
          </div>
          <div class="tab experience-data">
            <h2 class="tab-title">Experience</h2>
            <div class="input played">
              <label class="input-label">How long have you been playing WoW?</label>
              <textarea v-model="form.played" />
            </div>
            <div class="input raider">
              <label class="input-label">How long have you been an active raider?</label>
              <textarea v-model="form.raider" />
            </div>
            <div class="input experience">
              <label class="input-label">Describe your past raiding experience</label>
              <textarea v-model="form.experience" />
            </div>
          </div>
        </form>
        <div class="control">
          <vc-button type="fill submit">Submit Application</vc-button>
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
      characters: [],
      performance: [],
      bind: {
        characterSelect: {
          text: "Select a character",
          options: [],
          disabled: false,
          ack: this.OnCharacterSelect.bind(null)
        },
      },
      form: { 
        isDisabled: true,
        character: undefined,
        role: {
          tank: false,
          healer: false,
          dps: false,
        }
      }, 
      applications: [],
    }
  },
  async mounted() {
    if (!this.characters.length) await this.loadCharacters(this.$store.state.bnet);

    if (this.$route.query.login) {
      this.$router.push(this.$route.path);
    }
  },
  computed: {
    isLoading() {
      return (this.$store.getters.getBNet == -1 || this.$store.getters.getLoading.state) ? true : false;
    },
    getRankingDifficulty() {
      let difficulty = this.performance[0].difficulty;
      switch(difficulty) {
        case 5: return 'MYTHIC';
        case 4: return 'HEROIC';
        case 3: return 'NORMAL';
        case 1: return 'LFR';
      }
    }
  },
  methods: {
    async OnCharacterSelect(id) {
      try {
        let response = await axios.post('/warcraftlogs/getranking', {
          character: this.characters[id].name,
          realm: this.characters[id].realm,
        })
        if(response.error) {
          console.error(`${response.error.status} ${response.error.message}`);
        }
        else {
          this.form.character = id;
          this.performance = response.data
        }
      }
      catch (err) {
        console.error(err);
      }
    },
    async deauthorizeBNet() {
      try {
        await axios.post('/blizzard/auth/logout');
        this.$store.commit('clearBNet');
      }
      catch (err) {
        console.error(err);
      }
    },
    async loadCharacters(bnet) {
      if (bnet == undefined || bnet == -1) return;

      this.form.tag = bnet.battletag;
      try {
        this.$store.commit('startLoading', "Retrieving characters");
        let response = await axios.post('/blizzard/characters', {
          token: bnet.token
        });
        this.$store.commit('stopLoading');

        if(response.error) {
          console.error(`${response.error.status} ${response.error.message}`);
          this.$store.commit('clearBNet');
        }
        else {
          this.addCharacters(response.data);
        }
      }
      catch (err) {
        this.$store.commit('failLoading', err);
      }
    },
    addCharacters(characters) {
      this.characters = characters;

      this.bind.characterSelect.options = [];
      for (let character of characters) {
        this.bind.characterSelect.options.push({ text: `(${character.level}) ${character.name} - ${character.realm}` });
      }
    },
    getParseColor(percentile) {
      switch(true) {
        case percentile == 100: return 'artifact';
        case percentile >= 95: return 'legendary';
        case percentile >= 75: return 'epic';
        case percentile >= 50: return 'rare';
        case percentile >= 25: return 'uncommon';
        default: return 'common';
      }
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
@import "_wow.scss";

.apply {
  .application-wrapper {
    display: flex;
    flex-direction: column;
    form.application {
      flex: 1;
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 430px;
      grid-column-gap: 10px;
      justify-content: center;
      padding: 10px;
      .tab {
        display: flex;
        flex-direction: column;
        background-color: rgba(darken($base-color-2, 10%), .4);
        padding: 10px 50px 20px 50px;
        border-radius: 2px;

        &.personal-data .input, &.experience-data .input {
          flex: 1;
          textarea {
            height: 100%;
          }
        }

        .tab-title {
          text-align: center;
        }

        .switch-user {
          margin: 14px 0;
          text-align: center;
        }

        .role .input-label, .rankings .input-label {
          padding: 5px;      
          border-bottom: 2px solid darken($base-color, 20%);
          color: darken($base-color, 20%);
          font-weight: 600;
          text-align: center;
        }

        .role {
          margin: 20px 0;

          .role-container {
            position: relative;
            display: flex;
            justify-content: space-around;
            padding: 20px 0;
            border-radius: 0 0 4px 4px;
            //background-color: rgba(#000, .4);
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;

            .custom-checkbox {
              position: relative;
              width: 55px;
              height: 55px;
              input[type="checkbox"] {
                position: absolute;
                width: 100%;
                height: 100%;
                opacity: 0;
                cursor: pointer;
              }
              .checkmark {
                display: block;
                width: inherit;
                height: inherit;
                border-radius: 50%;

                transition: background-color .2s ease, box-shadow .2s ease;
                &.tank { background: transparent url('~assets/images/roles.png') no-repeat -6px -70px; }
                &.healer { background: transparent url('~assets/images/roles.png') no-repeat -72px -4px; }
                &.dps { background: transparent url('~assets/images/roles.png') no-repeat -72px -70px; }
              }
              input:checked ~ .checkmark {
                &.tank { background-color: rgba(blue, .4); box-shadow: 0 0 4px 2px blue; }
                &.healer { background-color: rgba(lighten(green, 50%), .4); box-shadow: 0 0 4px 2px lighten(green, 50%); }
                &.dps { background-color: rgba(red, .4); box-shadow: 0 0 4px 2px red; }
              }
            }
          }
        }

        .rankings {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .encounters {
            padding: 5px;
            border-radius: 0 0 4px 4px;
            //background-color: rgba(#000, .4);

            .parse {
              display: block;
              padding: 0 8px;
              margin: 8px 0;
              border: 1px solid;
              border-left: none;
              border-right: none;
              border-radius: 4px;
              transition: background-color .2s ease;
              font-weight: 600;

              &.artifact:hover { background-color: rgba($ARTIFACT, .1); }
              &.legendary:hover { background-color: rgba($LEGENDARY, .1); }
              &.epic:hover { background-color: rgba($EPIC, .1); }
              &.rare:hover { background-color: rgba($RARE, .1); }
              &.uncommon:hover { background-color: rgba($UNCOMMON, .1); }
              &.common:hover { background-color: rgba($COMMON, .1); } 
              
              .percentile {
                float: right;
                padding-left: 8px;
                border-left: 1px solid;
              }
            }
          }
        }
      }
    }
    .control {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 10px 0 20px 0;      
      .button {
        width: 200px;
        padding: 10px 50px 10px 50px;
      }
    }
  }
  .permission-wrapper {
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
