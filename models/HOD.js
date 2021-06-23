'use strict'

var { db } = require('../db');


module.exports = class HOD {

	constructor() {

	}

	static findById(id) {

		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM hod WHERE id = ?", [id], (err, [result]) => {
				resolve(result);
			});
		});

	}

	static findByDepartment(department) {

		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM hod WHERE department = ?", [department], (err, [result]) => {
				resolve(result);
			});
		});

	}

}





