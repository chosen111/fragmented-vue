module.exports = (schema, find) => {
  let query = [
    `SELECT`,
        `*`,
    `FROM`,
        `${schema.guild_members} gmembers`,
				`NATURAL LEFT JOIN`,
					`${schema.static_guild_ranks}`,
				`NATURAL LEFT JOIN`,
					`${schema.static_wow_classes}`,
				`NATURAL LEFT JOIN`,
					`${schema.static_wow_races}`, 
				`NATURAL LEFT JOIN`,
					`${schema.static_wow_genders}`
  ]

	if (find) {
		query.push("WHERE");
		query.push(`${find.map((val) => "name LIKE ?").join(' or ')}`);
	}
	query.push("ORDER BY rank ASC, name ASC")
  return query.join(' ');
}