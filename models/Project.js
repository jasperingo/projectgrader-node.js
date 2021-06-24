'use strict'

var { db } = require('../db');

//var Student = require('./Student');


module.exports = class Project {

	static getStatus(project) {
		let v = project.visitation_score;
		let pw = project.paper_work_score;
		let p = project.participation_score;
		if (v == null && pw == null && p == null) {
			project.status = 0;
		} else if (v < 75 || pw == 0 || p == 0) {
			project.status = 1;
		} else {
			project.status = 2;
		}
	}


	static findAllDistinct(column, limit) {

		var sql = 'SELECT DISTINCT ?? FROM project ORDER BY created_at DESC';
		var params = [column];

		if (limit) {
			sql += ' LIMIT ?, ?';
			params = [column, ...limit];
		}

		return new Promise((resolve, reject) => {
			db.query(sql, params, (err, results) => {
				if (err) reject(err);
				resolve(results.map(r=> r[column]));
			});
		});
	}



	static findAllBySection(section, limit) {

		var sql = `SELECT a.internal_supervisor_id AS supervisor_id, b.name AS supervisor_name 
					FROM project AS a JOIN internal_supervisor AS b
					ON a.internal_supervisor_id = b.id   
					WHERE a.section = ? 
					GROUP BY a.internal_supervisor_id`;

		var params = [section];

		if (limit) {
			sql += ' LIMIT ?, ?';
			params = [section, ...limit];
		}

		return new Promise((resolve, reject) => {

			db.query(sql, params, (err, results) => {
				if (err) reject(err);
				resolve(results);
			});

		}).then((results) => {

			if (results.length == 0) return results;

			return new Promise((resolve, reject) => {

				for (let i=0; i<results.length; i++) {
					db.query(`SELECT a.id, a.student_id, b.name AS student_name, b.matric_number AS student_matric_number, 
							a.visitation_score, a.paper_work_score, a.participation_score
						FROM project AS a JOIN student AS b 
						ON a.student_id = b.id
						WHERE a.section = ? AND a.internal_supervisor_id = ?`, [section, results[i].supervisor_id], (err, results2) => {


						if (err) reject(err);

						for (let k=0; k<results2.length; k++) {
							Project.getStatus(results2[k]);
						}
						
						console.log(results2)

						results[i].projects = results2;

						if (i == results.length-1)
							resolve(results);
					});
				}

			});

		});
		
	}


	static countAllBySection(section) {

		var sql = `SELECT COUNT(id) AS size
					FROM project
					WHERE section = ?
					GROUP BY internal_supervisor_id`;

		return new Promise((resolve, reject) => {

			db.query(sql, [section], (err, result) => {
				//console.log(result.length);
				if (err) reject(err);
				resolve(result.length);
			});

		});
		
	}

}










