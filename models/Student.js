'use strict'

var { db } = require('../db');



module.exports = class Student {

	constructor(name, matricNumber, department, level) {
		this.name = name;
		this.matricNumber = matricNumber;
		this.department = department;
		this.level = level;
	}

	save() {
		return new Promise((resolve, reject) => {
			db.query("INSERT INTO student (name, matric_number, department, level) VALUES (?,?,?,?)", 
				[this.name, this.matricNumber, this.department, this.level], 
				(err, result) => {

				if (err) reject(err);
				resolve(result);
			});
		});
	}

	update() {

		return new Promise((resolve, reject) => {
			db.query("UPDATE student SET name = ?, department = ?, level = ? WHERE matric_number = ?", 
				[this.name, this.department, this.level, this.matricNumber], 
				(err, result) => {

				if (err) reject(err);
				resolve(result);
			});
		});
	}

	upsert() {

		return Student.findByMatricNumber(this.matricNumber).then(result => {
			if (result) {
				return this.update();
			} else {
				return this.save();
			}
		}).catch(err => err);
		
	}

	static findByMatricNumber(number) {

		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM student WHERE matric_number = ?", [number], (err, result) => {
				if (err) reject(err);
				if (result) 
					resolve(result[0]);
				else 
					resolve(result);
			});
		});

	}

}





