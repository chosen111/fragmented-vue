exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex(`static_guild_attendance`).del().then(() => {
    // Inserts seed entries
    return knex(`static_guild_attendance`).insert([
      { attendance: 1, attendanceText: 'Accepted', attendanceFlag: 1 },
      { attendance: 2, attendanceText: 'Declined', attendanceFlag: 2 },
      { attendance: 3, attendanceText: 'Standby', attendanceFlag: 1 },
      { attendance: 4, attendanceText: 'Benched', attendanceFlag: 2 },
      { attendance: 5, attendanceText: 'Missed', attendanceFlag: 2 },
      { attendance: 6, attendanceText: 'RL Issue', attendanceFlag: 3 },
    ])
  })
}
