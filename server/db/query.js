const db = require('./db');
function Query(sql, info) {
	return new Promise((resolve, reject) => {
		db.query(sql, info, async (err, results) => {
			if (err) return reject(err);
			resolve({ err, results });
		});
	});
}
module.exports = {
	Query
};
