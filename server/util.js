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
    getGuildMembers() {
      return knex.select().from(database.schema.guild_members)
          .joinRaw(`NATURAL LEFT JOIN ${database.schema.static_guild_ranks}`)
          .joinRaw(`NATURAL LEFT JOIN ${database.schema.static_wow_classes}`)
          .joinRaw(`NATURAL LEFT JOIN ${database.schema.static_wow_races}`)
          .joinRaw(`NATURAL LEFT JOIN ${database.schema.static_wow_genders}`)
          .orderByRaw(`rank ASC, name ASC`);
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
        case "mythic": return await query.whereRaw("rank < 5 OR rank = 7");
        case "heroic": return await query.whereRaw("rank < 4 OR rank = 5");
        default: return await query;
      }
    }
  },
  Blizzard: { 
    BNET_ID: "c6c7463498de4b988b45625bcd052eb5",
    BNET_SECRET: "W9mHstYdG2LeDn20PXaaOLpW1RbmNAeb",
    token: null,
    expires: null,

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
        return await vars.Fragmented.getRaiders('m');
      }
      catch(e) {
        console.log(e);
      }
    },

    async getCharacters(token) {
      try {
        let result = await axios.get(`https://eu.api.blizzard.com/wow/user/characters`, {
          headers: { 'Authorization': `bearer ${token}` }
        })
        return result.data.characters.filter((c) => c.realm == "Silvermoon").sort((a, b) => b.level - a.level);
      }
      catch(e) {
        console.log(e);
      }
    }
  },
}

module.exports = vars;