'use strict'

var { db } = require('../db');


module.exports = class IS {

	constructor() {

	}

	static findById(id) {

		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM internal_supervisor WHERE id = ?", [id], (err, [result]) => {
				if (err) reject(err);
				resolve(result);
			});
		});

	}

	static findByEmail(email) {

		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM internal_supervisor WHERE email = ?", [email], (err, [result]) => {
				if (err) reject(err);
				resolve(result);
			});
		});

	}

}







