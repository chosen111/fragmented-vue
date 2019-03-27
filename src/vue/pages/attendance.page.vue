<template>
  <main class="vue_attendance">
    <vc-loading v-if="loading.state" :message="loading.message" :error="loading.error"></vc-loading>
    <section v-else class="attendance">
      <div class="attendanceWrapper">
        <div class="members">
          <div class="membersTitle">Members</div>
          <div v-for="(member, index) in members" :key="index" class="member" :class="[ className(index) ]">{{ member.name }}</div>
        </div>
        <div class="data">
          <div class="raid-1">
            <div class="raidsTitle">12/01/1994</div>
            <div class="status">
              <div v-for="(member, index) in members" :key="index" class="member">{{ member.name }}</div>
            </div>
          </div>
          <div class="raid-1">
            <div class="raidsTitle">12/01/1994</div>
            <div class="status">
              <div v-for="(member, index) in members" :key="index" class="member">{{ member.name }}</div>
            </div>
          </div>
          <div class="raid-1">
            <div class="raidsTitle">12/01/1994</div>
            <div class="status">
              <div v-for="(member, index) in members" :key="index" class="member">{{ member.name }}</div>
            </div>
          </div>
          <div class="raid-1">
            <div class="raidsTitle">12/01/1994</div>
            <div class="status">
              <div v-for="(member, index) in members" :key="index" class="member">{{ member.name }}</div>
            </div>
          </div>
          <div class="raid-1">
            <div class="raidsTitle">12/01/1994</div>
            <div class="status">
              <div v-for="(member, index) in members" :key="index" class="member">{{ member.name }}</div>
            </div>
          </div>
          <div class="raid-1">
            <div class="raidsTitle">12/01/1994</div>
            <div class="status">
              <div v-for="(member, index) in members" :key="index" class="member">{{ member.name }}</div>
            </div>
          </div>
          <div class="raid-1">
            <div class="raidsTitle">12/01/1994</div>
            <div class="status">
              <div v-for="(member, index) in members" :key="index" class="member">{{ member.name }}</div>
            </div>
          </div>
          <div class="raid-1">
            <div class="raidsTitle">12/01/1994</div>
            <div class="status">
              <div v-for="(member, index) in members" :key="index" class="member">{{ member.name }}</div>
            </div>
          </div>
          <div class="raid-1">
            <div class="raidsTitle">12/01/1994</div>
            <div class="status">
              <div v-for="(member, index) in members" :key="index" class="member">{{ member.name }}</div>
            </div>
          </div>
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
      calendar: null,
      loading: {
        state: true,
        error: null,
        message: "Loading",
      },
      ranks: [],
      members: [],
    }
  },
  async mounted() {
    try {
      let response = await axios.post('/blizzard/guild/members');
      this.loading.state = false;

      this.addMembers(response.data);
    }
    catch(e) {
      this.loading.error = true;
      this.loading.message = e;
    }
  },
  methods: {
    className(index) {
      return slugify(this.members[index].className.toLowerCase());
    },
    addMembers(members) {
      let ranks = [];
      for (let i in members) {
        if (ranks.indexOf(members[i].rankName) == -1) {
          ranks.push(members[i].rankName);
        }
      }
      this.ranks = ranks;
      this.members = members.filter((member) => (member.rank < 5 || member.rank == 7) && !member.isAlt);
    },
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
