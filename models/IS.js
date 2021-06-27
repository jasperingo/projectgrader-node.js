'use strict'

var { db } = require('../db');


module.exports = class IS {

	constructor(name, email, department, password) {
		this.name = name;
		this.email = email;
		this.department = department;
		this.password = password;
	}

	save() {
		return new Promise((resolve, reject) => {
			db.query("INSERT INTO internal_supervisor (name, email, department, password) VALUES (?,?,?,?)", 
				[this.name, this.email, this.department, this.password], 
				(err, result) => {

				if (err) reject(err);
				else resolve(result);
			});
		});
	}

	update() {

		return new Promise((resolve, reject) => {
			db.query("UPDATE internal_supervisor SET name = ?, password = ?, department = ? WHERE email = ?", 
				[this.name, this.password, this.department, this.email], 
				(err, result) => {

				if (err) reject(err);
				else resolve(result);
			});
		});
	}

	upsert() {

		return IS.findByEmail(this.email).then(result => {
			if (result) {
				return this.update();
			} else {
				return this.save();
			}
		}).catch(err => err);
		
	}

	static findById(id) {

		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM internal_supervisor WHERE id = ?", [id], (err, result) => {
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
			db.query("SELECT * FROM internal_supervisor WHERE email = ?", [email], (err, result) => {
				if (err) reject(err);
				if (result) 
					resolve(result[0]);
				else 
					resolve(result);
			});
		});

	}

}







