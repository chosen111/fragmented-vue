const axios = require('axios');
const qs = require('querystring');
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '192.168.1.192',
    user: 'fragmented',
    password: 'vfs@8?sdUm5rQKgnfzm*@JU5q+9RLVb3$&84C+Dm$caTE_dh?#_7J?9sUs8ZPhMa',
    database: 'fragmented'
  }
});

const Validator = require('./validator');
const ResponseUtil = require('./responseutil');
const Database = {
  schema: {
    cache: "cache",
    static_wow_classes: "static_wow_classes",
    static_wow_genders: "static_wow_genders",
    static_wow_races: "static_wow_races",
    static_guild_attendance: "static_guild_attendance",
    static_guild_ranks: "static_guild_ranks",
    guild_members: "guild_members",
    guild_raids: "guild_raids",
    guild_applications: "guild_applications",
    guild_attendance: "guild_attendance",
    wlogs_rankings: "wlogs_rankings",
  },
  async cache(table) {
    let replaceQuery = "REPLACE INTO `cache` (`cache`) VALUES (?)";
    return await knex.raw(replaceQuery, [table]);
  },
  async dropSchema() {
    let schema = [];
    for (table in this.schema) {
      schema.push(table);
    }
    for (table of schema.reverse()) {
      await knex.schema.dropTableIfExists(table);
    }
  },
  async createSchema(schema) {
    if (await knex.schema.hasTable(schema)) return;
    switch (schema) {
      case 'cache':
        return await knex.schema.createTable(schema, (table) => {
          table.charset('utf8');
          table.string('cache', 32).primary().notNullable();
          table.timestamp('updated_at').defaultTo(knex.fn.now());
        })

      case 'static_wow_classes':
        return await knex.schema.createTable(schema, (table) => {
          table.charset('utf8');
          table.integer('class').primary().notNullable();
          table.string('className', 32).notNullable();
          table.string('classColor', 8).notNullable();
        })

      case 'static_wow_genders':
        return await knex.schema.createTable(schema, (table) => {
          table.charset('utf8');
          table.integer('gender').primary().notNullable();
          table.string('genderName', 8).notNullable();
        })

      case 'static_wow_races':
        return await knex.schema.createTable(schema, (table) => {
          table.charset('utf8');
          table.integer('race').primary().notNullable();
          table.string('raceName', 32).notNullable();
          table.string('raceFaction', 16).notNullable();
        })

      case 'static_guild_attendance':
        return await knex.schema.createTable(schema, (table) => {
          table.charset('utf8');
          table.integer('attendance').primary().notNullable();
          table.string('attendanceText', 32).notNullable();
          table.integer('attendanceFlag').notNullable();
        })

      case 'static_guild_ranks':
        return await knex.schema.createTable(schema, (table) => {
          table.charset('utf8');
          table.integer('rank').primary().notNullable();
          table.string('rankName', 32).notNullable();
          table.string('rankColor', 32).defaultTo(null);
          table.boolean('isAlt').defaultTo(null)
        })

      case 'guild_members':
        return await knex.schema.createTable(schema, (table) => {
          table.charset('utf8');
          table.string('character', 32).collate('utf8_bin').primary().notNullable();
          table.integer('rank').references('rank').on(this.schema.static_guild_ranks).notNullable().onDelete("NO ACTION").onUpdate("NO ACTION");
          table.integer('level').notNullable();
          table.string('role', 32).defaultTo(null);
          table.string('spec', 32).defaultTo(null);
          table.string('thumbnail', 128).notNullable();
          table.integer('class').references('class').on(this.schema.static_wow_classes).notNullable().onDelete("NO ACTION").onUpdate("NO ACTION");
          table.integer('race').references('race').on(this.schema.static_wow_races).notNullable().onDelete("NO ACTION").onUpdate("NO ACTION");
          table.integer('gender').references('gender').on(this.schema.static_wow_genders).notNullable().onDelete("NO ACTION").onUpdate("NO ACTION");
          table.boolean('hidden').defaultTo(false).notNullable();
          table.string('twitch').defaultTo(null);
          table.timestamp('updated_at').defaultTo(knex.fn.now());
        })

      case 'guild_raids':
        return await knex.schema.createTable(schema, (table) => {
          table.charset('utf8');
          table.increments('raid').notNullable();
          table.time('date').notNullable().unique();
          table.string('type', 32).notNullable();
        })

      case 'guild_applications':
        return await knex.schema.createTable(schema, (table) => {
          table.charset('utf8');
          table.collate('utf8_bin');
          table.string('battleTag', 32).primary().notNullable();
          table.string('character', 32).notNullable();
          table.json('role', 8).notNullable();
          table.text('about').notNullable();
          table.text('applyReason').notNullable();
          table.text('leaveReason');
          table.text('addition').notNullable();
          table.text('played').notNullable();
          table.text('raider').notNullable();
          table.text('experience').notNullable();
          table.boolean('cancelled').notNullable().defaultTo(false);
          table.timestamps(true, true);
        })

      case 'guild_attendance':
        return await knex.schema.createTable(schema, (table) => {
          table.charset('utf8');
          table.string('character', 32).collate('utf8_bin').references('character').on(this.schema.guild_members).notNullable();
          table.integer('raid').unsigned().references('raid').on(this.schema.guild_raids).notNullable();
          table.integer('attendance').references('attendance').on(this.schema.static_guild_attendance).notNullable();
          table.string('type', 4).notNullable();
          table.primary(['character', 'raid', 'type']);
        })

      case 'wlogs_rankings':
        return await knex.schema.createTable(schema, (table) => {
          table.charset('utf8');
          table.string('character', 32).collate('utf8_bin').notNullable();
          table.string('realm', 64).collate('utf8_bin').notNullable();
          table.json('rankings').notNullable();
          table.primary(['character', 'realm']);
          table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
    }
  },
  addBackTicks(array) {
    return array.map((i) => '`' + i + '`');
  },
  async batchReplace(table, records, options = {}) {
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
};

const Fragmented = { 
  async addApplication(battletag, data, action) {
    try {
      if (!battletag || battletag.length == 0) return ResponseUtil.notificationObject("warning", "E_NOT_LOGGED_WITH_BNET", "alert");
      data.battleTag = battletag;
      
      let validated = Validator.fn.run("guildApplication", data);
      switch(action) {
        case "insert": 
          await knex.insert(validated).into(Database.schema.guild_applications);
          return ResponseUtil.notificationObject("warning", "I_GUILD_APPLICATION_POSTED");
        case "update":
          let limit = await knex.select('created_at', 'cancelled').from(Database.schema.guild_applications).where(`battleTag`, "LIKE", battletag);
          if (limit[0].created_at.setHours(limit[0].created_at.getHours() + 6) < Date.now()) {
            return ResponseUtil.notificationObject("warning", "E_GUILD_APPLICATION_IS_FINAL", "alert");
          }
          await knex.update(validated).into(Database.schema.guild_applications).where(`battleTag`, "LIKE", battletag);
          return ResponseUtil.notificationObject("warning", "I_GUILD_APPLICATION_EDITED");
      }
    }
    catch (err) {
      if (err instanceof Validator.ValidateError) {
        return ResponseUtil.errorObject(err.fields);
      }
      else {
        if (err.code == "ER_DUP_ENTRY") {
          return ResponseUtil.notificationObject("warning", "E_ALREADY_APPLIED_TO_GUILD", "alert")
        }
        else {
          console.error(err);
        }
      }
    }
  },
  async cancelApplication(battletag) {
    try {
      if (!battletag || battletag.length == 0) return ResponseUtil.notificationObject("warning", "E_NOT_LOGGED_WITH_BNET", "alert");

      let limit = await knex.select('created_at').from(Database.schema.guild_applications).where(`battleTag`, "LIKE", battletag);
      if (limit[0].created_at.setHours(limit[0].created_at.getHours() + 6) < Date.now()) return ResponseUtil.notificationObject("warning", "E_GUILD_APPLICATION_IS_FINAL", "alert");

      await knex.delete().from(Database.schema.guild_applications).where(`battleTag`, "LIKE", battletag);
      return ResponseUtil.notificationObject("warning", "I_GUILD_APPLICATION_CANCELLED");
    }
    catch (err) {
      console.error(err);
    }
  },
  async getApplication(battletag) {
    try {
      if (!battletag || battletag.length == 0) return ResponseUtil.notificationObject("warning", "E_NOT_LOGGED_WITH_BNET", "alert");
      return knex.select().from(Database.schema.guild_applications).where(`battleTag`, "LIKE", battletag);
    }
    catch (err) {
      console.error(err);
    }
  },
  async addRanking(character, realm, rankings) {
    let replaceQuery = `REPLACE INTO ${Database.schema.wlogs_rankings} (${"`character`, `realm`, `rankings`"}) VALUES (?, ?, ?)`;
    return await knex.raw(replaceQuery, [character, realm, JSON.stringify(rankings)]);
  },
  async getRanking(character, realm) {
    let result = [];
    try {
      result = await knex.select(`rankings`).from(Database.schema.wlogs_rankings).where('character', character).andWhere('realm', realm);
    }
    catch (err) {
      console.error(err);
    }
    finally {
      return (result.length) ? JSON.parse(result[0].rankings) : result;
    }
  },
  async addGuildMembers(members) {
    let membersBatch = [];   
    for(let i = 0; i < members.length; i++) {
      if (members[i].character.level < 120) continue;
      membersBatch.push({
        character: members[i].character.name,
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
        await knex.del().from(Database.schema.guild_members);
        await Database.cache(Database.schema.guild_members);          
        await Database.batchReplace(Database.schema.guild_members, membersBatch);
      }
      catch (err) {
        console.error("The transaction failed. Rollback to previous state!");
        throw err;
      }
    })
  },
  getGuildMembers() {
    return knex.select().from(Database.schema.guild_members)
        .joinRaw(`NATURAL LEFT JOIN ${Database.schema.static_guild_ranks}`)
        .joinRaw(`NATURAL LEFT JOIN ${Database.schema.static_wow_classes}`)
        .joinRaw(`NATURAL LEFT JOIN ${Database.schema.static_wow_races}`)
        .joinRaw(`NATURAL LEFT JOIN ${Database.schema.static_wow_genders}`)
        .orderByRaw("`rank` ASC, `character` ASC");
  },
  async getRaidsByType(type) {
    let query = knex.select().from(Database.schema.guild_raids);

    switch(type) {
      case "mythic": return await query.where(`type`, "LIKE", 'm');
      case "heroic": return await query.where(`type`, "LIKE", 'h');
      default: return await query;
    }
  },
  async getRaidsByMember(name) {
    return await knex.select().from(Database.schema.guild_raids).where(`character`, "LIKE", name);
  },
  async getRaiders(type) {
    let query = this.getGuildMembers();
    
    switch(type) {
      case "mythic": return await query.whereRaw("`rank` < 5 OR `rank` = 7");
      case "heroic": return await query.whereRaw("`rank` < 4 OR `rank` = 5");
      default: return await query;
    }
  }
};

const WarcraftLogs = {
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
      let cache = await knex.select('updated_at').from(Database.schema.wlogs_rankings).where('character', character);
      if (!cache[0] || (cache[0].updated_at.setHours(cache[0].updated_at.getHours()+6) < Date.now())) {
        let result = await axios.get(`https://www.warcraftlogs.com/v1/rankings/character/${encodeURI(character)}/${encodeURI(realm)}/eu?timeframe=historical&api_key=${this.KEY}`);
        let rankings = result.data
            .filter((e, i, self) => e.difficulty == self.reduce((max, e) => e.difficulty > max ? e.difficulty : max, self[0].difficulty)) // Filter by the highest difficulty
            .map((e) => { return { encounter: e.encounterName, percentile: e.percentile, difficulty: e.difficulty, reportId: e.reportID, fightId: e.fightID } }) // Store only the necessary fields
            .sort((e1, e2) => this.ORDER[e1.encounter] - this.ORDER[e2.encounter]); // Sort by the correct boss order*/
        await Fragmented.addRanking(character, realm, rankings);
      }
    }
    catch (err) {
      console.error(err);
    }
    finally {
      return await Fragmented.getRanking(character, realm);
    }
  }
};

const Blizzard = { 
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
      let cache = await knex.select('updated_at').from('cache').where('cache', 'guild_members');
      if (!cache[0] || (cache[0].updated_at.setHours(cache[0].updated_at.getHours() + 1) < Date.now())) {
        result = await axios.get(`https://eu.api.blizzard.com/wow/guild/${realmName}/${guildName}?fields=members`);          
        await Fragmented.addGuildMembers(result.data.members);
      }
      return await Fragmented.getRaiders('m');
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
};

(async function() {
  try {
    //await Database.dropSchema();
    for (let table in Database.schema) {
      await Database.createSchema(table);
    }    
  }
  catch (err) {
    console.error(err);
  }
})()

module.exports = { knex, Fragmented, WarcraftLogs, Blizzard };