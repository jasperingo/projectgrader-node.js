'use strict'

var { db } = require('../db');


module.exports = class Admin {

	constructor() {

	}

	static findById(id) {

		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM app_admin WHERE id = ?", [id], (err, result) => {
				if (err) reject(err);
				if (result) 
					resolve(result[0]);
				else 
					resolve(result);
			});
		});

	}

}





