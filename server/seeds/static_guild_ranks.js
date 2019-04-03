exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex(`static_guild_ranks`).del().then(() => {
    // Inserts seed entries
    return knex(`static_guild_ranks`).insert([
      { rank: 0, rankName: 'Guild Master', rankColor: 'default', isAlt: false },
      { rank: 1, rankName: 'Officer', rankColor: 'default', isAlt: false },
      { rank: 2, rankName: 'Officer', rankColor: 'default', isAlt: true },
      { rank: 4, rankName: 'Mythic Raider', rankColor: 'default', isAlt: false },
      { rank: 5, rankName: 'Heroic Raider', rankColor: 'default', isAlt: false },
      { rank: 7, rankName: 'Trial', rankColor: 'default', isAlt: false },
      { rank: 8, rankName: 'Social', rankColor: 'default', isAlt: true },
      { rank: 9, rankName: 'Social', rankColor: 'default', isAlt: false },
    ])
  })
}

