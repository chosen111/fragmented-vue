const axios = require('axios');
const qs = require('querystring');
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'fragmented',
    password: 'vfs@8?sdUm5rQKgnfzm*@JU5q+9RLVb3$&84C+Dm$caTE_dh?#_7J?9sUs8ZPhMa',
    database: 'fragmented'
  }
});

/*const crawler = require('crawler');
const c = new crawler({
  rateLimit: 1000,
  // This will be called for each crawled page
  callback : function (error, res, done) {
    if(error){
      console.log(error);
    }
    else {
      var $ = res.$;
      console.log($("title").text());
    }
    done();
  }
})

c.queue({
  uri: 'https://www.warcraftlogs.com/character/eu/silvermoon/blinkal%c3%b8t',
  // The global callback won't be called
  callback: function (error, res, done) {
      if(error){
          console.log(error);
      }
      else {
        var $ = res.$;
        console.log($('.best-perf-avg').html());
      }
      done();
  }
})*/

const database = {
  schema: {
    cache: "cache",
    guild_raids: "guild_raids",
    guild_members: "guild_members",
    heroic_attendance: "heroic_attendance",
    mythic_attendance: "mythic_attendance",
    static_guild_ranks: "static_guild_ranks",
    static_wow_classes: "static_wow_classes",
    static_wow_genders: "static_wow_genders",
    static_wow_races: "static_wow_races"
  },
  addBackTicks(array) {
    return array.map((i) => '`' + i + '`');
  },
  async batchReplace(table, records, options={}) {
    if (!table) throw "No table specified!";
    if (!records || !records.length) throw "No records specified!";
  
    let columns = [];
    for (let key in records[0]) {
      columns.push(key);
    }
    vals = records.map(record => {
      let tmp = [];
      for (let key in record) {
        tmp.push(record[key]);
      }
      return tmp;
    })
  
    let updateQuery = `REPLACE INTO ${table} (${this.addBackTicks(columns).join(',')}) VALUES ${records.map(() => '(?)').join(',')}`;
    return await knex.raw(updateQuery, vals);
  }
}

const vars = {
  knex: knex,

  Fragmented: { 
    async addGuildMembers(members) {
      let membersBatch = [];   
      for(let i = 0; i < members.length; i++) {
        if (members[i].character.level < 120) continue;
        membersBatch.push({
          name: members[i].character.name,
          rank: members[i].rank,
          level: members[i].character.level,
          thumbnail: members[i].character.thumbnail,
          class: members[i].character.class,
          race: members[i].character.race,
          gender: members[i].character.gender
        })
      }
      await knex.transaction(async (trx) => {
        try {
          // Update the cache variable and repopulate guild members, rollback on error
          await knex.raw('INSERT INTO `cache` (`cache`, `expiresAt`) VALUES ("guild_members", ":expiresAt") ON DUPLICATE KEY UPDATE `expiresAt` = ":expiresAt"', {
            expiresAt: Date.now() + (60*60*1000)
          })
          await knex.del().from(`guild_members`);
          await database.batchReplace(`guild_members`, membersBatch);
        }
        catch (err) {
          console.error("The transaction failed. Rollback to previous state!");
          throw err;
        }
      })
    },
    getGuildMembers() {
      return knex.select().from(database.schema.guild_members)
          .joinRaw(`NATURAL LEFT JOIN ${database.schema.static_guild_ranks}`)
          .joinRaw(`NATURAL LEFT JOIN ${database.schema.static_wow_classes}`)
          .joinRaw(`NATURAL LEFT JOIN ${database.schema.static_wow_races}`)
          .joinRaw(`NATURAL LEFT JOIN ${database.schema.static_wow_genders}`)
          .orderByRaw("`rank` ASC, `name` ASC");
    },
    async getRaidsByType(type) {
      let query = knex.select().from(database.schema.guild_raids);

      switch(type) {
        case "mythic": return await query.where(`type`, "LIKE", 'm');
        case "heroic": return await query.where(`type`, "LIKE", 'h');
        default: return await query;
      }
    },
    async getRaidsByMember(name) {
      return await knex.select().from(database.schema.guild_raids).where(`name`, "LIKE", name);
    },
    async getRaiders(type) {
      let query = this.getGuildMembers();
      
      switch(type) {
        case "mythic": return await query.whereRaw("`rank` < 5 OR `rank` = 7");
        case "heroic": return await query.whereRaw("`rank` < 4 OR `rank` = 5");
        default: return await query;
      }
    }
  },
  WarcraftLogs: {
    KEY: "7b266aa882cb34bb1ab4e9569531464d",
    ORDER: {
      "Champion of the Light": 1,
      "Jadefire Masters": 2,
      "Grong": 3,
      "Opulence": 4,
      "Conclave of the Chosen": 5,
      "King Rastakhan": 6,
      "Mekkatorque": 7,
      "Stormwall Blockade": 8,
      "Lady Jaina Proudmoore": 9
    },
    async getRanking(character, realm) {
      try {
        let response = await axios.get(`https://www.warcraftlogs.com/v1/rankings/character/${encodeURI(character)}/${encodeURI(realm)}/eu?timeframe=historical&api_key=${this.KEY}`);
        return response.data
            .filter((e, i, self) => e.difficulty == self.reduce((max, e) => e.difficulty > max ? e.difficulty : max, self[0].difficulty)) // Filter by the highest difficulty
            .map((e) => { return { encounter: e.encounterName, percentile: e.percentile, difficulty: e.difficulty, reportId: e.reportID, fightId: e.fightID } }) // Store only the necessary fields
            .sort((e1, e2) => this.ORDER[e1.encounter] - this.ORDER[e2.encounter]); // Sort by the correct boss order
      }
      catch (err) {
        return { error: this.getError(err) }
      }
    }
  },
  Blizzard: { 
    BNET_ID: "c6c7463498de4b988b45625bcd052eb5",
    BNET_SECRET: "W9mHstYdG2LeDn20PXaaOLpW1RbmNAeb",
    token: null,
    expires: null,

    getError(err) {
      return {
        status: err.response.status,
        message: err.response.statusText
      }
    },

    async getToken() {
      if (!this.token || Date.now() > this.expires) {
        try {
          let response = await axios.post('https://eu.battle.net/oauth/token', qs.stringify({
            grant_type: "client_credentials",
            client_id: this.BNET_ID,
            client_secret: this.BNET_SECRET
          }));
          this.setToken(response.data);
        }
        catch (err) {
          console.log(err);
        }
      }
    },
    setToken(response) {
      axios.defaults.headers.common['Authorization'] = `${response.token_type} ${response.access_token}`;
      this.token = response.access_token;
      this.expires = Date.now() + response.expires_in;
    },

    async getGuildMembers(guildName, realmName) {
      let result;
      try {
        // check cache
        let isCached = await knex.select().from('cache').where('cache', 'guild_members');
        if (!isCached[0] || isCached[0].expiresAt < Date.now()) {
          result = await axios.get(`https://eu.api.blizzard.com/wow/guild/${realmName}/${guildName}?fields=members`);          
          await vars.Fragmented.addGuildMembers(result.data.members);
        }
        return await vars.Fragmented.getRaiders('m');
      }
      catch (err) {
        console.log(err);
      }
    },

    async getCharacters(token) {
      try {
        let result = await axios.get(`https://eu.api.blizzard.com/wow/user/characters`, {
          headers: { 'Authorization': `bearer ${token}` }
        })
        return result.data.characters.filter((c) => c.realm == "Silvermoon").sort((a, b) => b.level - a.level);
      }
      catch (err) {
        return { error: this.getError(err) }
      }
    }
  },
}

module.exports = vars;