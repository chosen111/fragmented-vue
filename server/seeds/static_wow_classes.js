exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex(`static_wow_classes`).del().then(() => {
    // Inserts seed entries
    return knex(`static_wow_classes`).insert([
      { class: 1, className: 'Warrior', classColor: '#c79c6e' },
      { class: 2, className: 'Paladin', classColor: '#f58cba' },
      { class: 3, className: 'Hunter', classColor: '#abd473' },
      { class: 4, className: 'Rogue', classColor: '#fff569' },
      { class: 5, className: 'Priest', classColor: '#ffffff' },
      { class: 6, className: 'Death Knight', classColor: '#c41f3b' },
      { class: 7, className: 'Shaman', classColor: '#0070de' },
      { class: 8, className: 'Mage', classColor: '#40c7eb' },
      { class: 9, className: 'Warlock', classColor: '#8787ed' },
      { class: 10, className: 'Monk', classColor: '#00ff96' },
      { class: 11, className: 'Druid', classColor: '#ff7d0a' },
      { class: 12, className: 'Demon Hunter', classColor: '#a330c9' },
    ])
  })
}