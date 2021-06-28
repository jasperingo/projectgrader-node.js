'use strict'

var HOD = require('../models/HOD');
var Project = require('../models/Project');
var { getPagination, postFlasher, hashPassword, comparePassword, sessionSetter } = require('../Helpers');

var { body, validationResult } = require('express-validator');



exports.index = async function (req, res, next) {
	
	try {

		var sections = await Project.findSectionsByDepartment(req.session.user.department);

		var section = (!req.query.fsection) ? sections[0] : req.query.fsection;

		var data = await Project.findAllBySectionAndDepartment(section, req.session.user.department, req.pager.pagination);

		var count = await Project.countAll({ section, department : req.session.user.department });
		
		res.render('hod_dashboard', {
		    title: res.__('user.Head of Department'),
		    user : req.session.user,
		    sections: sections,
		    section: section,
		    data: data,
		    pagination: getPagination(req, count),
		});

	} catch (error) {
		next(error);
	}
}


exports.getLogin = async function (req, res) {
	
	try {

		res.render('hod_login', {
		    title : res.__('user.{{ name }} Login', { name : res.__('user.Head of Department')}),
		    form_data : req.flash('form_data')[0],
		    departments : await HOD.findDepartments()
		});

	} catch (error) {
		throw error;
	}
}


exports.postLogin = async function (req, res) {

  	try {
  		
  		var result = await HOD.findByDepartment(req.body.department);

  		if (!result || !await comparePassword(req.body.password, result.password)) {
  			
  			req.flash('form_data', postFlasher(req.body, [], { error : res.__('errors-msgs.credentials') }));
  	 		res.redirect('login');
  	 	
  	 	} else {

  	 		sessionSetter(req, 'hod', result);

  	 		res.redirect('./');

  			//console.log(result);
  	 	}

  	} catch (error) {

  		req.flash('form_data', postFlasher(req.body, [], { error : res.__('errors-msgs.unknown') }));
  		res.redirect('login');
  		console.log(error);
  	}

}



exports.getAdd = function (req, res) {
	
	res.render('hod_add', {
	    title : res.__('user.{{ name }} Add', { name : res.__('user.Head of Department')}),
	    form_data : req.flash('form_data')[0]
	});
}


exports.postAdd = [
	
	body('name').trim().isLength({ min: 1 }).withMessage((value, {req}) => req.__('errors-msgs.required')).escape(),
    
    body('department').trim().custom((value, { req }) => {
	    if (!req.__('departments-array')[value]) {
	    	throw new Error(req.__('Choose a department'));
	    }
	    return true;
	}).escape(),

    body('password').isLength({ min: 6 }).withMessage((value, {req}) => req.__('errors-msgs.Password length')),

	async function (req, res) {
		
	  	var errors = validationResult(req);
	  	
	    if (!errors.isEmpty()) {

	    	req.flash('form_data', postFlasher(req.body, errors.array()));

	    	res.redirect('add');
	    	
	    } else {

		  	try {
		  		
		  		var hod = new HOD(
		  			req.body.name, 
		  			req.__('departments-array')[req.body.department], 
		  			await hashPassword(req.body.password)
		  		);

		  		
		  		var result = await hod.upsert();

		  		req.flash('form_data', {
		  			form_success : req.__('user.Head of Department has been added')
		  		});

		  	} catch (error) {

		  		req.flash('form_data', postFlasher(req.body, [], { error : req.__('errors-msgs.unknown') }));

		  		console.log(error);

		  	} finally {

	    		res.redirect('add');
		  	}

		}

	}
];








