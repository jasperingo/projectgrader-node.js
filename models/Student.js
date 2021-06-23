'use strict'

var { db } = require('../db');



module.exports = class Student {

	
	static findAllByISId(id) {

		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM student WHERE id = ?", [id], (err, [result]) => {
				resolve(result);
			});
		});

	}

}





