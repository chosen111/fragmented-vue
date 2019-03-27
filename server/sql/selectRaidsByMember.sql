module.exports = (schema, find) => {
  let query = [
    `SELECT`,
        `*`,
    `FROM`,
        `${schema.guild_raids} graids`,
		`WHERE`,
        `graids.type LIKE ${find}`,
  ]
  return query.join(' ');
}