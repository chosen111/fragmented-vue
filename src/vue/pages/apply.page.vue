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
        <form class="application">
          <div class="tab character-data">
            <h2 class="tab-title">Character</h2>
            <div class="input battletag">
              <label class="input-label">BATTLE TAG</label>
              <vc-input type="text" :input.sync="form.data.battleTag" :error="form.error.battleTag" :disabled="true"></vc-input>
            </div>
            <div class="switch-user">
              <vc-button type="fill" :click="deauthorizeBNet.bind()">Switch Accounts</vc-button>
            </div>
            <div class="input charater">
              <label class="input-label">
                <span>CHARACTER</span>
                <vc-icon v-if="form.error.character" icon="warning" v-tooltip="{ text: form.error.character, type: 'alert' }"></vc-icon>
              </label>
              <vc-select :select="bind.characterSelect" :disabled="isDisabled"></vc-select>
            </div>
            <div class="input role">
              <label class="input-label">
                <span>ROLE</span>
                <vc-icon v-if="form.error.role" icon="warning" v-tooltip="{ text: form.error.role, type: 'alert' }"></vc-icon>
              </label>
              <div class="role-container">
                <div class="custom-checkbox">
                  <input type="checkbox" name="role" v-model="form.data.role[0]" :disabled="isDisabled">
                  <span class="checkmark tank"></span>
                </div>
                <div class="custom-checkbox">
                  <input type="checkbox" name="role" v-model="form.data.role[1]" :disabled="isDisabled">
                  <span class="checkmark healer"></span>
                </div>
                <div class="custom-checkbox">
                  <input type="checkbox" name="role" v-model="form.data.role[2]" :disabled="isDisabled">
                  <span class="checkmark dps"></span>
                </div>
              </div>
            </div>
            <div v-if="performance.length" class="rankings">
              <label class="input-label">PERFORMANCE ({{ getRankingDifficulty }})</label>
              <div class="encounters">
                <a v-for="(parse, index) in performance" :key="index" class="parse custom" :class="[ getRankingColor(parse.percentile) ]" :href="`https://www.warcraftlogs.com/reports/${parse.reportId}#fight=${parse.fightId}&type=damage-done`" target="_blank">
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
              <vc-input type="textarea" :input.sync="form.data.about" :error="form.error.about" :disabled="isDisabled"></vc-input>
            </div>
            <div class="input apply-reason">
              <label class="input-label">Why are you applying to Fragmented?</label>
              <vc-input type="textarea" :input.sync="form.data.applyReason" :error="form.error.applyReason" :disabled="isDisabled"></vc-input>
            </div>
            <div class="input leave-reason">
              <label class="input-label">Why did you leave the previous guild?</label>
              <vc-input type="textarea" :input.sync="form.data.leaveReason" :error="form.error.leaveReason" :disabled="isDisabled"></vc-input>
            </div>
            <div class="input addition">
              <label class="input-label">Why do you think you can be a valuable addition?</label>
              <vc-input type="textarea" :input.sync="form.data.addition" :error="form.error.addition" :disabled="isDisabled"></vc-input>
            </div>
          </div>
          <div class="tab experience-data">
            <h2 class="tab-title">Experience</h2>
            <div class="input played">
              <label class="input-label">How long have you been playing WoW?</label>
              <vc-input type="textarea" :input.sync="form.data.played" :error="form.error.played" :disabled="isDisabled"></vc-input>
            </div>
            <div class="input raider">
              <label class="input-label">How long have you been an active raider?</label>
              <vc-input type="textarea" :input.sync="form.data.raider" :error="form.error.raider" :disabled="isDisabled"></vc-input>
            </div>
            <div class="input experience">
              <label class="input-label">Describe your past raiding experience</label>
              <vc-input type="textarea" :input.sync="form.data.experience" :error="form.error.experience" :disabled="isDisabled"></vc-input>
            </div>
          </div>
        </form>
        <div v-if="!isFinal" class="control">
          <vc-button v-if="!applicationStatus || isEditing" type="fill add" :click="addApplication.bind()">Submit Application</vc-button>
          <vc-button v-if="applicationStatus && !isEditing" type="fill edit" :click="editApplication.bind()">Edit Application</vc-button>
          <vc-button v-if="applicationStatus" type="fill cancel" :click="cancelApplication.bind()" color="red">Cancel Application</vc-button>
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
          selected: null,
          text: "Select a character",
          options: [],
          ack: this.OnCharacterSelect.bind(null)
        },
      },
      applicationStatus: null,
      form: { 
        error: { },
        data: {
          battleTag: undefined,
          character: undefined,
          role: [ false, false, false ],
          about: undefined,
          applyReason: undefined,
          leaveReason: undefined,
          addition: undefined,
          played: undefined,
          raider: undefined,
          experience: undefined,
        }
      }, 
    }
  },
  async mounted() {
    if (!this.$store.getters.getBNet == -1) {
      await this.load(this.$store.state.bnet);
    }
    // Clear out the URL
    if (this.$route.query.login) {
      this.$store.commit("addNotification", { text: "I_BNET_AUTHORIZED" });
      this.$router.push(this.$route.path);
    }
    this.$store.commit("openWindow", { component: `vw-dialog`, name: `madafaca` });
    this.$store.commit("openWindow", { component: `vw-dialog`, name: `madafaca doi` });
  },
  computed: {
    isLoading() {
      return (this.$store.getters.getBNet == -1 || this.$store.getters.getLoading.state) ? true : false;
    },
    isDisabled() {
      switch (this.applicationStatus) {
        case "applied":
        case "final":
          return true;
        default:  
          return false;
      }
    },
    isEditing() {
      return (this.applicationStatus == "editing") ? true : false;
    },
    isFinal() {
      return (this.applicationStatus == "final") ? true : false;
    },
    getRankingDifficulty() {
      let difficulty = this.performance[0].difficulty;
      switch(difficulty) {
        case 5: return 'MYTHIC';
        case 4: return 'HEROIC';
        case 3: return 'NORMAL';
        case 1: return 'LFR';
      }
    },
  },
  methods: {
    async loadApplication() {
      this.$store.commit('startLoading', "Loading your application");
      try {
        let response = await axios.post('/guild/getapplication');
        if(response.error) {
          throw `${response.error.status} ${response.error.message}`;
        }
        else {
          if (response.data.length) {
            let created = new Date(response.data[0].created_at);
            this.applicationStatus = created.setHours(created.getHours() + 6) < Date.now() ? "final" : "applied";
            delete response.data[0].created_at;
            delete response.data[0].updated_at;

            // Update form fields
            this.$set(this.form, 'data', response.data[0]);
            this.form.data.role = JSON.parse(response.data[0].role);
            // Update character selection
            let id = this.characters.map((c) => c.name).indexOf(response.data[0].character);
            this.bind.characterSelect.selected = id;
            // Update rankings
            await this.loadRankings(id);
          }
          // Show notifications
          this.$store.commit("addNotification", response.data.notification);
        }
      }
      catch (err) {
        console.error(err);
      }
    },
    async addApplication() {
      try {
        this.form.error = { };
        let action = (this.isEditing) ? '/guild/editapplication' : '/guild/addapplication';
        let response = await axios.post(action, this.form.data);
        if(response.error) {
          throw `${response.error.status} ${response.error.message}`;
        }
        // Show form errors or notifications
        this.form.error = response.data.error || { };
        this.$store.commit("addNotification", response.data.notification);
  
        if (response.data.notification) {
          switch(response.data.notification.text) {
            case "E_GUILD_APPLICATION_IS_FINAL": return this.applicationStatus = "final";
          }
        }
        if (!response.data.error) this.applicationStatus = 'applied';
      }
      catch (err) {
        console.error(err);
      }
    },
    editApplication() {
      this.applicationStatus = "editing";
    },
    async cancelApplication() {      
      try {
        let response = await axios.post('/guild/cancelapplication', this.form.data);
        if(response.error) {
          throw `${response.error.status} ${response.error.message}`;
        }
        // Show notifications
        this.$store.commit("addNotification", response.data.notification);
        if (response.data.notification) {
          switch(response.data.notification.text) {
            case "E_GUILD_APPLICATION_IS_FINAL": return this.applicationStatus = "final";
          }
        }
        this.formReset();
      }
      catch (err) {
        console.error(err);
      }
    },
    async OnCharacterSelect(id) {
      this.form.data.character = this.characters[id].name;
      await this.loadRankings(id)
    },
    async deauthorizeBNet() {     
      try {
        await axios.post('/blizzard/auth/logout');
        this.$store.commit('clearBNet');
        this.$store.commit("addNotification", { text: "I_BNET_DEAUTHORIZED" });
      }
      catch (err) {
        console.error(err);
      }
    },
    async loadCharacters(bnet) {
      this.form.data.battleTag = bnet.battletag;
      this.$store.commit('startLoading', "Retrieving characters");
      try {
        let response = await axios.post('/blizzard/characters', {
          token: bnet.token
        })
        if(response.error) {
          throw `${response.error.status} ${response.error.message}`;
        }
        this.addCharacters(response.data);
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
    async loadRankings(character) {
      try {
        let response = await axios.post('/warcraftlogs/getranking', {
          character: this.characters[character].name,
          realm: this.characters[character].realm,
        })
        if(response.error) {
          throw `${response.error.status} ${response.error.message}`;
        }
        this.performance = response.data;
      }
      catch (err) {
        console.error(err);
      }
    },
    getRankingColor(percentile) {
      switch(true) {
        case percentile == 100: return 'artifact';
        case percentile >= 95: return 'legendary';
        case percentile >= 75: return 'epic';
        case percentile >= 50: return 'rare';
        case percentile >= 25: return 'uncommon';
        default: return 'common';
      }
    },
    async load(bnet) {
      if(!bnet || bnet == -1) return;
      await this.loadCharacters(bnet);
      await this.loadApplication(bnet);      
      this.$store.commit('stopLoading');
    },
    formReset() {
      this.applicationStatus = null;
      this.bind.characterSelect.selected = null;
      this.form.data = Object.assign(this.form.data, {
        role: [ false, false, false ],
        about: undefined,
        applyReason: undefined,
        leaveReason: undefined,
        addition: undefined,
        played: undefined,
        raider: undefined,
        experience: undefined,
      });
      this.performance = [];
    }
  },
  watch: {
    '$store.state.bnet': async function(to, from) {
      this.load(to);
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

        .input-label {
          position: relative;
          .icon-warning {
            position: absolute;
            right: 0;
            bottom: 4px;
            color: $lred;
            animation: .4s flashError ease-in-out;
          }
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
        margin: 0 10px 0 10px;
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
