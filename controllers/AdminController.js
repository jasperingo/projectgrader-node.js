'use strict'

var Admin = require('../models/Admin');
var Student = require('../models/Student');
var { postFlasher, comparePassword, sessionSetter } = require('../Helpers');

var { body, validationResult } = require('express-validator');



exports.index = function (req, res) {

	res.render('admin_dashboard', {
		title: res.__('user.Administrator'),
		user : req.session.user,
	});
}


exports.getLogin = function (req, res) {

	res.render('admin_login', {
	    title : res.__('user.{{ name }} Login', { name : res.__('user.Administrator')}),
	    form_data : req.flash('form_data')[0]
	});
}


exports.postLogin = async function (req, res) {

  	try {
  		
  		var result = await Admin.findById(req.body.admin_id);

  		if (!result || !await comparePassword(req.body.password, result.password)) {

  			req.flash('form_data', postFlasher(req.body, [], { error : res.__('errors-msgs.credentials') }));
  	 		res.redirect('login');
  	 	
  	 	} else {

  	 		sessionSetter(req, 'admin', result);
  	 		
  	 		res.redirect('./');

  			console.log(result);
  	 	}

  	} catch (error) {

  		req.flash('form_data', postFlasher(req.body, [], { error : res.__('errors-msgs.unknown') }));
  		res.redirect('login');
  		console.log(error);
  	}

}



exports.getAddStudent = async function (req, res) {

	res.render('student_add', {
	    title : res.__('user.{{ name }} Add', { name : res.__('user.Student')}),
	    form_data : req.flash('form_data')[0]
	});
}


exports.postAddStudent = [
	
	body('name').trim().isLength({ min: 1 }).withMessage((value, {req}) => req.__('errors-msgs.required')).escape(),
    
    body('department').trim().custom((value, { req }) => {
	    if (!req.__('departments-array')[value]) {
	    	throw new Error(req.__('Choose a department'));
	    }
	    return true;
	}).escape(),

    body('matric_number').isLength({ min: 11 }).withMessage((value, {req}) => req.__('errors-msgs.Matriculation number is invalid')),

    body('level').trim().custom((value, { req }) => {
	    if (value < 100 || value%100 !== 0) {
	    	throw new Error(req.__('errors-msgs.Level is invalid'));
	    }
	    return true;
	}),

	async function (req, res) {
		
	  	var errors = validationResult(req);
	  	
	    if (!errors.isEmpty()) {

	    	req.flash('form_data', postFlasher(req.body, errors.array()));

	    	res.redirect('add-student');
	    	
	    } else {

		  	try {
		  		
		  		var student = new Student(
		  			req.body.name, 
		  			req.body.matric_number, 
		  			req.__('departments-array')[req.body.department], 
		  			req.body.level
		  		);

		  		var result = await student.upsert();

		  		req.flash('form_data', {
		  			form_success : req.__('user.Student has been added')
		  		});

		  	} catch (error) {

		  		req.flash('form_data', postFlasher(req.body, [], { error : req.__('errors-msgs.unknown') }));

		  		console.log(error);

		  	} finally {

	    		res.redirect('add-student');
		  	}

		}

	}
];






















