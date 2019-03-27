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
					`${schema.static_wow_genders}`,
		`WHERE`,
  ]

	switch(find) {
		case 'm':
			query.push(`gmembers.rank < 5 OR gmembers.rank = 7`);
			break;
		case 'h':
			query.push(`gmembers.rank = 6`);
			break;		
	}
	
	query.push("ORDER BY gmembers.rank ASC, gmembers.name ASC")
  return query.join(' ');
}