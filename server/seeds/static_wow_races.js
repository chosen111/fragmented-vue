exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex(`static_wow_races`).del().then(() => {
    // Inserts seed entries
    return knex(`static_wow_races`).insert([
      { race: 1, raceName: 'Human', raceFaction: 'A' },
      { race: 2, raceName: 'Orc', raceFaction: 'H' },
      { race: 3, raceName: 'Dwarf', raceFaction: 'A' },
      { race: 4, raceName: 'Night Elf', raceFaction: 'A' },
      { race: 5, raceName: 'Undead', raceFaction: 'H' },
      { race: 6, raceName: 'Tauren', raceFaction: 'H' },
      { race: 7, raceName: 'Gnome', raceFaction: 'A' },
      { race: 8, raceName: 'Troll', raceFaction: 'H' },
      { race: 9, raceName: 'Goblin', raceFaction: 'H' },
      { race: 10, raceName: 'Blood Elf', raceFaction: 'H' },
      { race: 11, raceName: 'Draenei', raceFaction: 'A' },
      { race: 22, raceName: 'Worgen', raceFaction: 'A' },
      { race: 24, raceName: 'Pandaren', raceFaction: 'N' },
      { race: 25, raceName: 'Pandaren', raceFaction: 'A' },
      { race: 26, raceName: 'Pandaren', raceFaction: 'H' },
      { race: 27, raceName: 'Nightborne', raceFaction: 'H' },
      { race: 28, raceName: 'Highmountain Tauren', raceFaction: 'H' },
      { race: 29, raceName: 'Void Elf', raceFaction: 'A' },
      { race: 30, raceName: 'Lightforged Draenei', raceFaction: 'A' },
      { race: 31, raceName: 'Zandalari Troll', raceFaction: 'H' },
      { race: 32, raceName: 'Kul Tiran', raceFaction: 'A' },
      { race: 34, raceName: 'Dark Iron Dwarf', raceFaction: 'A' },
      { race: 36, raceName: 'Mag\'har Orc', raceFaction: 'H' },
    ])
  })
}