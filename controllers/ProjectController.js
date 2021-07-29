'use strict'


var Project = require('../models/Project');
var IS = require('../models/IS');
var ES = require('../models/ES');
var Student = require('../models/Student');

var { getPagination, postFlasher, hashPassword, getSectionArray } = require('../Helpers');

var { body, validationResult } = require('express-validator');



exports.index = async function (req, res, next) {

	try {

		var data = await Project.findById(req.params.id);

		if (!data) {
			var ee = new Error(res.__('Project not found'));
			ee.status = 404;
			throw ee;
		}

		if ((req.session.user.type == 'hod' && data.department != req.session.user.department) ||
			(req.session.user.type == 'is' && data.internal_supervisor_id != req.session.user.id) ||
			(req.session.user.type == 'es' && data.external_supervisor_id != req.session.user.id)) {
			var ee = new Error(res.__('Project forbidden'));
			ee.status = 403;
			throw ee;
		}

		res.render('project', {
			title : `${res.__('Project')} ${req.params.id}`,
			user : req.session.user, 
			form_data : req.flash('form_data')[0], 
			data,

		});

	} catch (error) {

		next(error);
	}

}


exports.ISPreGrade = [

	function (req, res, next) {
		
	  	if (!req.body.participation) req.body.participation = 0;

	  	if (!req.body.paper_work) req.body.paper_work = 0;

	    next();
	    
	}, 
	
	body('visitation').trim().isFloat({ min : 0, max : 100 }).withMessage((value, {req}) => req.__('errors-msgs.Score invalid')),

	function (req, res, next) {

	  	var errors = validationResult(req);
	  	
	    if (!errors.isEmpty()) {

	    	req.flash('form_data', postFlasher(req.body, errors.array()));

	    	res.redirect('/project/'+req.params.id+'#grade-form');
	    	
	    } else {

	    	next();
	    }
	},
	
	async function (req, res, next) {
	
		try {

			var data = await Project.findById(req.params.id);

			if (!data) {

				var ee = new Error(res.__('Project not found'));
				ee.status = 404;
				next(ee);

			} else if ((req.session.user.type != 'is' || 
				(req.session.user.type == 'is' && data.internal_supervisor_id != req.session.user.id)) || 
				data.status > 0) {
				
				var ee = new Error(res.__('Project forbidden'));
				ee.status = 403;
				next(ee);
			
			} else {

				var result = await Project.preGrade(
			  		req.params.id, 
			  		req.body.visitation
			  	);

				if (result.affectedRows > 0)
					res.redirect('/project/'+req.params.id);
				else 
					throw new Error();

			}

		} catch (error) {

			req.flash('form_data', postFlasher(req.body, [], { error : req.__('errors-msgs.unknown') }));

			res.redirect('/project/'+req.params.id+'#grade-form');

			console.log(error);
		}

	}
];



exports.ISGrade = [

	body('presentation').trim().isFloat({ min : 0, max : 20 }).withMessage((value, {req}) => req.__('errors-msgs.Score invalid')),
	body('dressing').trim().isFloat({ min : 0, max : 10 }).withMessage((value, {req}) => req.__('errors-msgs.Score invalid')),
	body('relevance').trim().isFloat({ min : 0, max : 10 }).withMessage((value, {req}) => req.__('errors-msgs.Score invalid')),

	function (req, res, next) {

	  	var errors = validationResult(req);
	  	
	    if (!errors.isEmpty()) {

	    	req.flash('form_data', postFlasher(req.body, errors.array()));

	    	res.redirect('/project/'+req.params.id+'#grade-form');
	    	
	    } else {

	    	next();
	    }
	},
	

	async function (req, res, next) {
		
		try {

			var data = await Project.findById(req.params.id);

			if (!data) {

				var ee = new Error(res.__('Project not found'));
				ee.status = 404;
				next(ee);

			} else if ((req.session.user.type != 'is' || 
				(req.session.user.type == 'is' && data.internal_supervisor_id != req.session.user.id)) || 
				data.status < 1) {
				
				var ee = new Error(res.__('Project forbidden'));
				ee.status = 403;
				next(ee);
			
			} else {

				var result = await Project.ISGrade(
			  		req.params.id, 
			  		req.body.presentation,
			  		req.body.dressing,
			  		req.body.relevance
			  	);

				if (result.affectedRows > 0)
					res.redirect('/project/'+req.params.id);
				else 
					throw new Error();

			}

		} catch (error) {

			req.flash('form_data', postFlasher(req.body, [], { error : req.__('errors-msgs.unknown') }));

			res.redirect('/project/'+req.params.id+'#grade-form');

			console.log(error);
		}
	}
];


exports.ESGrade = [

	body('presentation').trim().isFloat({ min : 0, max : 30 }).withMessage((value, {req}) => req.__('errors-msgs.Score invalid')),
	body('dressing').trim().isFloat({ min : 0, max : 15 }).withMessage((value, {req}) => req.__('errors-msgs.Score invalid')),
	body('relevance').trim().isFloat({ min : 0, max : 15 }).withMessage((value, {req}) => req.__('errors-msgs.Score invalid')),

	function (req, res, next) {

	  	var errors = validationResult(req);
	  	
	    if (!errors.isEmpty()) {

	    	req.flash('form_data', postFlasher(req.body, errors.array()));

	    	res.redirect('/project/'+req.params.id+'#grade-form');
	    	
	    } else {

	    	next();
	    }
	},
	

	async function (req, res, next) {
		
		try {

			var data = await Project.findById(req.params.id);

			if (!data) {

				var ee = new Error(res.__('Project not found'));
				ee.status = 404;
				next(ee);

			} else if ((req.session.user.type != 'es' || 
				(req.session.user.type == 'es' && data.external_supervisor_id != req.session.user.id)) || 
				data.status < 2 ||
				(data.grade_at == null || new Date(data.grade_at).getTime() > Date.now())) {
				
				var ee = new Error(res.__('Project forbidden'));
				ee.status = 403;
				next(ee);
			
			} else {

				var result = await Project.ESGrade(
			  		req.params.id, 
			  		req.body.presentation,
			  		req.body.dressing,
			  		req.body.relevance
			  	);

				if (result.affectedRows > 0)
					res.redirect('/project/'+req.params.id);
				else 
					throw new Error();

			}

		} catch (error) {

			req.flash('form_data', postFlasher(req.body, [], { error : req.__('errors-msgs.unknown') }));

			res.redirect('/project/'+req.params.id+'#grade-form');

			console.log(error);
		}
	}
];




exports.getUpdate = function (req, res) {
	
	res.render('project_update', {
	    title : res.__('Project Add'),
	    form_data : req.flash('form_data')[0],
	    sections : getSectionArray()
	});
}


exports.postUpdate = [

	body('email').trim().isEmail().withMessage((value, {req}) => req.__('errors-msgs.Email')).bail()
	.custom(async (value, { req }) => {
	    
	    try {

			var result = await ES.findByEmail(req.body.email); 

		    if (!result) {
		    	throw new Error(req.__('errors-msgs.Email'));
		    }

		    req.body.ESID = result.id;

		    return true;

		} catch (error) {
			throw error;
		}

	}).bail()
	.custom(async (value, { req }) => {

		try {
		    
			var results = await Project.findAllBySectionAndExternalSupervisor(req.body.section, req.body.ESID, [0,1]);

		    if (results.length > 0) {
		    	throw new Error(req.__('errors-msgs.External Supervisor assigned'));
		    }

		    return true;

	    } catch (error) {
			throw error;
		}

	}).escape(),
	
	
    body('department').trim().custom((value, { req }) => {
	    if (!req.__('departments-array')[value]) {
	    	throw new Error(req.__('Choose a department'));
	    }
	    return true;
	}).escape(),

    body('section').trim().isIn(getSectionArray()).withMessage((value, {req}) => req.__('Choose a section')),

    body('grade_date').custom((value, { req }) => {

    	var date = new Date(value);
		if (isNaN(date.getTime()) || date.getTime() <= Date.now()) {
			throw new Error(req.__('errors-msgs.Date is invalid'));
	    }

	    return true;
	}),


	function (req, res, next) {
		
	  	var errors = validationResult(req);
	  	
	    if (!errors.isEmpty()) {

	    	var emailErrs = [req.__('errors-msgs.Email'), req.__('errors-msgs.External Supervisor assigned')];

	    	var errs = errors.array();

	    	var formErr = null;

	    	for (var i=0; i<errs.length; i++) {
	    		if (errs[i].param === 'email' && emailErrs.indexOf(errs[i].msg) < 0) {
	    			errs.splice(i, 1);
	    			formErr = { error : req.__('errors-msgs.unknown') };
	    			break;
	    		}
	    	}

	    	req.flash('form_data', postFlasher(req.body, errs, formErr));

	    	res.redirect('update');
	    	
	    } else {

	    	next();
	    }
	}, 

	async function (req, res, next) {
		
		try {

			var result = await Project.findAllBySectionAndDepartment(
				req.body.section, 
				req.__('departments-array')[req.body.department], 
				[0,1]
			);

			if (result.length > 0 && result[0].projects[0].external_supervisor_id != null) {
		    	req.flash('form_data', postFlasher(req.body, [], { 
		    		error : req.__('errors-msgs.Department - section External Supervisor assigned') 
		    	}));

				res.redirect('update');
		    } else {
		    	next();
		    }

		} catch (error) {

			req.flash('form_data', postFlasher(req.body, [], { error : req.__('errors-msgs.unknown') }));

			res.redirect('update');

		  	console.log(error);
		}

	},

	async function (req, res) {

		try {
		  	
		  	var result = await Project.updateMany(
		  		req.body.ESID, 
		  		req.body.grade_date, 
		  		req.__('departments-array')[req.body.department], 
		  		req.body.section
		  	);

		  	req.flash('form_data', {
		  		form_success : req.__('user.Project has been updated')
		  	});

		} catch (error) {

		  	req.flash('form_data', postFlasher(req.body, [], { error : req.__('errors-msgs.unknown') }));

		  	console.log(error);

		} finally {

	    	res.redirect('update');
		}

	}
];




exports.getAdd = function (req, res) {
	
	res.render('project_add', {
	    title : res.__('Project Add'),
	    form_data : req.flash('form_data')[0],
	    sections : getSectionArray()
	});
}



exports.postAdd = [
	
	body('email').trim().isEmail().withMessage((value, {req}) => req.__('errors-msgs.Email')).bail()
	.custom(async (value, { req }) => {
	    
	    try {

			var result = await IS.findByEmail(req.body.email); 

		    if (!result) {
		    	throw new Error(req.__('errors-msgs.Email'));
		    }

		    req.body.ISID = result.id;

		    req.body.ISDEPT = result.department;

		    return true;

		} catch (error) {
			throw error;
		}

	}).bail()
	.custom(async (value, { req }) => {

		try {
		    
			var students = await Project.findAllBySectionAndInternalSupervisor(req.body.section, req.body.ISID);

		    if (students.length > 0) {
		    	throw new Error(req.__('errors-msgs.Internal Supervisor assigned'));
		    }

		    return true;

	    } catch (error) {
			throw error;
		}

	}).escape(),


    body('section').trim().isIn(getSectionArray()).withMessage((value, {req}) => req.__('Choose a section')),


	function (req, res, next) {
		
	  	var errors = validationResult(req);
	  	
	    if (!errors.isEmpty()) {

	    	var emailErrs = [req.__('errors-msgs.Email'), req.__('errors-msgs.Internal Supervisor assigned')];

	    	var errs = errors.array();

	    	var formErr = null;

	    	for (var i=0; i<errs.length; i++) {
	    		if (errs[i].param === 'email' && emailErrs.indexOf(errs[i].msg) < 0) {
	    			errs.splice(i, 1);
	    			formErr = { error : req.__('errors-msgs.unknown') };
	    			break;
	    		}
	    	}

	    	req.flash('form_data', postFlasher(req.body, errs, formErr));

	    	res.redirect('add');
	    	
	    } else {

	    	next();
	    }
	}, 

	async function (req, res, next) {


		var students = req.body['students[]'], errs = [], formErrs = null;

		if (students.length > 10) {

			formErrs = {
				error : req.__('errors-msgs.Internal Supervisor max students')
			}

		} else {

			req.body.STDIDS = [];

			var filled = 0;

			for (let i=0; i<students.length; i++) {

				if (students[i].length == 0) continue;

				filled++;

				if (students[i].length != 11) {
					errs.push({
						param : `students${i}`,
						msg : req.__('errors-msgs.Matriculation number is invalid')
					});
					continue;
				}

				var result = await Student.findByMatricNumber(students[i]);

				if (!result) {
					errs.push({
						param : `students${i}`,
						msg : req.__('errors-msgs.Matriculation number is invalid')
					});
					continue;
				}

				var project = await Project.findByStudentAndSection(result.id, req.body.section)

				if (project) {
					errs.push({
						param : `students${i}`,
						msg : req.__('errors-msgs.Student max projects')
					});
					continue;
				}

				if (req.body.ISDEPT !== result.department) {
					errs.push({
						param : `students${i}`,
						msg : req.__('errors-msgs.Student IS department')
					});
					continue;
				}

				req.body.STDIDS.push(result.id);

			}

			if (filled == 0) {
				formErrs = {
					error : req.__('errors-msgs.Internal Supervisor min students')
				}
			}
		}

		if (formErrs != null || errs.length > 0) {
			
			req.flash('form_data', postFlasher(req.body, errs, formErrs));

	    	res.redirect('add');

	    } else {

	    	next();
	    }

	},

	async function (req, res) {

		try {
		  	
		  	var values = [];

		  	for (let ID of req.body.STDIDS) {
		  		values.push({
		  			student : ID,
		  			supervisor : req.body.ISID,
		  			department : req.body.ISDEPT,
		  			section : req.body.section
		  		})
		  	}
		  	
		  	var result = await Project.saveMany(values);

		  	req.flash('form_data', {
		  		form_success : req.__('user.Project has been added')
		  	});

		} catch (error) {

		  	req.flash('form_data', postFlasher(req.body, [], { error : req.__('errors-msgs.unknown') }));

		  	console.log(error);

		} finally {

	    	res.redirect('add');
		}

	}
];













