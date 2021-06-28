'use strict'

var { db } = require('../db');


module.exports = class Project {

	
	constructor(student, internalSupervisor, section, department) {
		this.student = student;
		this.internalSupervisor = internalSupervisor;
		this.section = section;
		this.department = department;
	}

	save() {
		return new Promise((resolve, reject) => {
			db.query("INSERT INTO project (student_id, internal_supervisor_id, department, section) VALUES (?,?,?,?)", 
				[this.student , this.internalSupervisor, this.department, this.section], 
				(err, result) => {

				if (err) reject(err);
				else resolve(result);
			});
		});
	}

	static saveMany(values) {

		var params = [];
		var placeholders = '';

		for (let i=0; i<values.length; i++) {
			if (i > 0) placeholders += ', (?,?,?,?)';
			params.push(values[i].student);
			params.push(values[i].supervisor);
			params.push(values[i].department);
			params.push(values[i].section);
		}

		return new Promise((resolve, reject) => {
			db.query(`INSERT INTO project (student_id, internal_supervisor_id, department, section) VALUES (?,?,?,?)${placeholders}`, 
				params, 
				(err, result) => {

				if (err) reject(err);
				else resolve(result);
			});
		});
	}

	static updateMany(supervisor, date, department, section) {

		return new Promise((resolve, reject) => {
			db.query(`UPDATE project SET external_supervisor_id = ?, grade_at = ? WHERE department = ? AND section = ?`, 
				[supervisor, date, department, section], 
				(err, result) => {

				if (err) reject(err);
				else resolve(result);
				console.log(result)
			});
		});
	}


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

	static findById(id) {

		return new Promise((resolve, reject) => {

			db.query(`SELECT a.id, 
							a.student_id, 
							b.name AS student_name, 
							b.matric_number AS student_matric_number, 
							b.level AS student_level,
							a.external_supervisor_id, 
							a.grade_at, a.section, 
							a.department, 
							a.internal_score,
							a.external_score,
							a.visitation_score, 
							a.paper_work_score, 
							a.participation_score,
							c.name AS internal_supervisor_name,
							d.name AS external_supervisor_name
					FROM project AS a 
						JOIN student AS b 
							ON a.student_id = b.id 
						JOIN internal_supervisor AS c 
							ON a.internal_supervisor_id = c.id 
						LEFT JOIN external_supervisor AS d 
							ON a.external_supervisor_id = d.id
					WHERE a.id = ?`, [id], (err, results) => {


				if (err) {

					reject(err);
				
				} else {

					Project.getStatus(results[0]);
							
					console.log(results);
					
					resolve(results[0]);
				}

			});
				

		});
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
				else resolve(results.map(r=> r[column]));
			});
		});
	}

	static findSectionsByInternalSupervisor(supervisor, limit) {
		var sql = `SELECT DISTINCT section FROM project WHERE internal_supervisor_id = ? ORDER BY created_at DESC`;
		return Project.findSections(sql, [supervisor], limit);
	}

	static findSectionsByExternalSupervisor(supervisor, limit) {
		var sql = `SELECT DISTINCT section FROM project WHERE external_supervisor_id = ? ORDER BY created_at DESC`;
		return Project.findSections(sql, [supervisor], limit);
	}

	static findSectionsByDepartment(department, limit) {
		var sql = `SELECT DISTINCT section FROM project WHERE department = ? ORDER BY created_at DESC`;
		return Project.findSections(sql, [department], limit);
	}

	static findSections(sql, params, limit) {

		if (limit) {
			sql += ' LIMIT ?, ?';
			params = [params, ...limit];
		}

		return new Promise((resolve, reject) => {
			db.query(sql, params, (err, results) => {
				if (err) reject(err);
				else resolve(results.map(r=> r.section));
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

			if (results.length == 0) {
				resolve(results);
			} else {

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

			}

		});
	}


	static findAllBySectionAndInternalSupervisor(section, supervisor) {

		return new Promise((resolve, reject) => {

				
			db.query(`SELECT a.id, a.student_id, b.name AS student_name, b.matric_number AS student_matric_number, 
							a.external_supervisor_id, a.grade_at, a.section, a.department, a.visitation_score, 
							a.paper_work_score, a.participation_score
					FROM project AS a JOIN student AS b 
					ON a.student_id = b.id
					WHERE a.section = ? AND a.internal_supervisor_id = ?`, [section, supervisor], (err, results) => {


				if (err) {

					reject(err);
				
				} else {

					for (let k=0; k<results.length; k++) {
						Project.getStatus(results[k]);
					}
							
					//console.log(results);
					
					resolve(results);
				}

			});
				

		});

	}

	static findByStudentAndSection(student, section) {

		return new Promise((resolve, reject) => {

			db.query(`SELECT id FROM project WHERE section = ? AND student_id = ?`, [student, section], (err, results) => {

				if (err) reject(err);
				
				else resolve(results[0]);

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

		//console.log(params);

		return new Promise((resolve, reject) => {

			db.query(sql, params, (err, results) => {
				if (err) reject(err);
				else resolve(results);
				//console.log(results)
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
				else resolve(result.length);
			});

		});
		
	}

}










