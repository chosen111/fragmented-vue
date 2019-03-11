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

const database = {
  sql: {
    selectGuildMembers: require('./sql/selectGuildMembers.sql')
  },
  schema: {
    cache: "cache",
    guild_members: "guild_members",
    heroic_attendance: "heroic_attendance",
    mythic_attendance: "mythic_attendance",
    static_guild_ranks: "static_guild_ranks",
    static_wow_classes: "static_wow_classes",
    static_wow_genders: "static_wow_genders",
    static_wow_races: "static_wow_races"
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
  
    let updateQuery = `REPLACE INTO ${table} (${columns.join(',')}) VALUES ${records.map(() => '(?)').join(',')}`;
    return await knex.raw(updateQuery, vals);
  }
}

const vars = {
  knex: knex,

  Fragmented: { 
    async addGuildMembers(members) {
      let membersBatch = [];
      await knex.raw('INSERT INTO `cache` (`cache`, `expiresAt`) VALUES ("guild_members", ":expiresAt") ON DUPLICATE KEY UPDATE `expiresAt` = ":expiresAt"', {
        expiresAt: Date.now() + (60*60*1000)
      })
    
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
      await database.batchReplace(`guild_members`, membersBatch);
    },
    async getGuildMembers() {
      let result = await knex.raw(database.sql.selectGuildMembers(database.schema));
      return result[0];
    }
  },
  Blizzard: { 
    token: null,
    expires: null,

    async getToken() {
      if (!this.token || Date.now() > this.expires) {
        try {
          let response = await axios.post('https://eu.battle.net/oauth/token', qs.stringify({
            grant_type: "client_credentials",
            client_id: "c6c7463498de4b988b45625bcd052eb5",
            client_secret: "W9mHstYdG2LeDn20PXaaOLpW1RbmNAeb"
          }));
          this.setToken(response.data);
        }
        catch(e) {
          console.log(e);
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
        return await vars.Fragmented.getGuildMembers();
      }
      catch(e) {
        console.log(e);
      }
    }
  },
}

module.exports = vars;