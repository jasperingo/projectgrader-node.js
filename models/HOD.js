'use strict'

var { db } = require('../db');


module.exports = class HOD {

	constructor(name, department, password) {
		this.name = name;
		this.department = department;
		this.password = password;
	}

	save() {
		return new Promise((resolve, reject) => {
			db.query("INSERT INTO hod (name, department, password) VALUES (?,?,?)", [this.name,  this.department, this.password], (err, result) => {
				if (err) reject(err);
				resolve(result);
			});
		});
	}

	update() {

		return new Promise((resolve, reject) => {
			db.query("UPDATE hod SET name = ?, password = ? WHERE department = ?", [this.name, this.password, this.department], (err, result) => {
				if (err) reject(err);
				resolve(result);
			});
		});
	}

	upsert() {

		return HOD.findByDepartment(this.department).then(result => {
			if (result) {
				return this.update();
			} else {
				return this.save();
			}
		}).catch(err => err);
		
	}

	static findDepartments() {

		return new Promise((resolve, reject) => {
			db.query("SELECT department FROM hod", (err, result) => {
				if (err) reject(err);
				else resolve(result.map(i => i.department));
			});
		});
	}
	
	static findById(id) {

		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM hod WHERE id = ?", [id], (err, result) => {
				if (err) reject(err);
				if (result) 
					resolve(result[0]);
				else 
					resolve(result);
			});
		});

	}

	static findByDepartment(department) {

		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM hod WHERE department = ?", [department], (err, result) => {
				if (err) reject(err);
				if (result) 
					resolve(result[0]);
				else 
					resolve(result);
			});
		});

	}

}





