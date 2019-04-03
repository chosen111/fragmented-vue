exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex(`static_wow_genders`).del().then(() => {
    // Inserts seed entries
    return knex(`static_wow_genders`).insert([
      { gender: 0, genderName: 'Male' },
      { gender: 1, genderName: 'Female' },
    ])
  })
}