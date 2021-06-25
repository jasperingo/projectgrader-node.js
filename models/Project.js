'use strict'

var { db } = require('../db');


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

	static findSectionsByExternalSupervisor(supervisor, limit) {
		return Project.findSectionsBySupervisor('external_supervisor_id', supervisor, limit);
	}

	static findSectionsByInternalSupervisor(supervisor, limit) {
		return Project.findSectionsBySupervisor('internal_supervisor_id', supervisor, limit);
	}

	static findSectionsBySupervisor(type, supervisor, limit) {

		var sql = `SELECT DISTINCT section FROM project WHERE ${type} ORDER BY created_at DESC`;
		var params = [supervisor];

		if (limit) {
			sql += ' LIMIT ?, ?';
			params = [supervisor, ...limit];
		}

		return new Promise((resolve, reject) => {
			db.query(sql, params, (err, results) => {
				if (err) reject(err);
				resolve(results.map(r=> r.section));
			});
		});
	}


	static findAllBySectionAndDepartment(section, department, limit) {
		return Project.findInternalSupervisors({section, department}, limit)
			.then((results) => Project.findByInternalSupervisors(section, results));
	}


	static findAllBySectionAndExternalSupervisor(section, externalSupervisor, limit) {
		return Project.findInternalSupervisors({section, externalSupervisor}, limit)
			.then((results) => Project.findByInternalSupervisors(section, results));
	}

	static findByInternalSupervisors(section, results) {

		return new Promise((resolve, reject) => {

			for (let i=0; i<results.length; i++) {
				Project.findAllBySectionAndInternalSupervisor(section,  results[i].supervisor_id)
					.then((projects) => {

						results[i].projects = projects;

						if (i == results.length-1) {
							resolve(results);
						}
					})
					.catch(err=>err);		
			}

		});
	}


	static findAllBySectionAndInternalSupervisor(section, supervisor) {

		return new Promise((resolve, reject) => {

				
			db.query(`SELECT a.id, a.student_id, b.name AS student_name, b.matric_number AS student_matric_number, 
							a.department, a.visitation_score, a.paper_work_score, a.participation_score
					FROM project AS a JOIN student AS b 
					ON a.student_id = b.id
					WHERE a.section = ? AND a.internal_supervisor_id = ?`, [section,supervisor], (err, results) => {


				if (err) reject(err);

				for (let k=0; k<results.length; k++) {
					Project.getStatus(results[k]);
				}
						
				//console.log(results);

				
				resolve(results);
						
			});
				

		});

	}


	static findInternalSupervisors(by, limit) {

		var where = 'a.section = ?';
		var params = [by.section];

		if (by.hasOwnProperty('department')) {
			where += ' AND a.department = ?';
			params.push(by.department);
		}

		if (by.hasOwnProperty('externalSupervisor')) {
			where += ' AND a.external_supervisor_id = ?';
			params.push(by.externalSupervisor);
		}


		var sql = `SELECT a.internal_supervisor_id AS supervisor_id, b.name AS supervisor_name 
					FROM project AS a JOIN internal_supervisor AS b
					ON a.internal_supervisor_id = b.id   
					WHERE ${where} 
					GROUP BY a.internal_supervisor_id`;


		if (limit) {
			sql += ' LIMIT ?, ?';
			params = [...params, ...limit];
		}

		console.log(params);

		return new Promise((resolve, reject) => {

			db.query(sql, params, (err, results) => {
				if (err) reject(err);
				resolve(results);
			});

		});
	}


	static countAll(by) {

		var where = 'section = ?';
		var params = [by.section];

		if (by.hasOwnProperty('department')) {
			where += ' AND department = ?';
			params.push(by.department);
		}

		if (by.hasOwnProperty('externalSupervisor')) {
			where += ' AND external_supervisor_id = ?';
			params.push(by.externalSupervisor);
		}

		var sql = `SELECT COUNT(id) AS size
					FROM project
					WHERE ${where}
					GROUP BY internal_supervisor_id`;

		return new Promise((resolve, reject) => {

			db.query(sql, params, (err, result) => {
				//console.log(result.length);
				if (err) reject(err);
				resolve(result.length);
			});

		});
		
	}

}










