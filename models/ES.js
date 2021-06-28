'use strict'

var { db } = require('../database/db');


module.exports = class ES {
	
	constructor(name, email, password) {
		this.name = name;
		this.email = email;
		this.password = password;
	}

	save() {
		return new Promise((resolve, reject) => {
			db.query("INSERT INTO external_supervisor (name, email, password) VALUES (?,?,?)", 
				[this.name, this.email, this.password], 
				(err, result) => {

				if (err) reject(err);
				resolve(result);
			});
		});
	}

	update() {

		return new Promise((resolve, reject) => {
			db.query("UPDATE external_supervisor SET name = ?, password = ? WHERE email = ?", 
				[this.name, this.password, this.email], 
				(err, result) => {

				if (err) reject(err);
				resolve(result);
			});
		});
	}

	upsert() {

		return ES.findByEmail(this.email).then(result => {
			if (result) {
				return this.update();
			} else {
				return this.save();
			}
		}).catch(err => err);
		
	}

	static findById(id) {

		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM external_supervisor WHERE id = ?", [id], (err, result) => {
				if (err) reject(err);
				if (result) 
					resolve(result[0]);
				else 
					resolve(result);
			});
		});

	}

	static findByEmail(email) {

		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM external_supervisor WHERE email = ?", [email], (err, result) => {
				if (err) reject(err);
				if (result) 
					resolve(result[0]);
				else 
					resolve(result);
			});
		});

	}


}







