'use strict'


var IS = require('../models/IS');
var Project = require('../models/Project');
var { getPagination, postFlasher, hashPassword } = require('../Helpers');

var { body, validationResult } = require('express-validator');


exports.index = async function (req, res) {
	
	try {

		var sections = await Project.findAllDistinct('section');

		var section = sections[0];

		if (req.query.fsection && sections.indexOf(req.query.fsection) > -1) {
			section = req.query.fsection;
		}

		var data = await Project.findAllBySectionAndSupervisor(section, 1);

		
		res.render('is_dashboard', {
		    title: res.__('user.Internal Supervisor'),
		    user : { name : 'Prof. Biscuit Half' },
		    sections: sections,
		    section: section,
		    data: data,
		});

	} catch (error) {
		next(error);
	}
}


exports.getLogin = function (req, res) {
	
	var input_values = req.flash('login_values')[0];

	res.render('supervisor_login', {
	    title : res.__('user.{{ name }} Login', { name : res.__('user.Internal Supervisor')}),
	    supervisor_type : res.__('user.Internal Supervisor'),
	    input_errors : req.flash('login_errors'),
	    input_values : input_values ? input_values : ''
	});
}


exports.postLogin = async function (req, res) {

  	try {
  		
  		var result = await IS.findByEmail(req.body.email);

  		if (!result || result.password !== req.body.password) {
  			
  			req.flash('login_errors', res.__('errors-msgs.credentials'));
  			req.flash('login_values', { email: req.body.email });
  	 		res.redirect('login');
  	 	
  	 	} else {

  	 		req.session.is = { 
  	 			id : result.id,
  	 			name : result.name
  	 		};

  	 		res.redirect('./');

  			//console.log(result);
  	 	}

  	} catch (error) {

  		req.flash('login_errors', res.__('errors-msgs.unknown'));
  		req.flash('login_values', { email: req.body.email });
  		res.redirect('login');
  		console.log(error);
  	}

}



exports.getAdd = function (req, res) {
	
	res.render('is_add', {
	    title : res.__('user.{{ name }} Add', { name : res.__('user.Internal Supervisor')}),
	    form_data : req.flash('form_data')[0]
	});
}



exports.postAdd = [
	
	body('name').trim().isLength({ min: 1 }).withMessage((value, {req}) => req.__('errors-msgs.required')).escape(),

	body('email').trim().isEmail().withMessage((value, {req}) => req.__('errors-msgs.Email')).escape(),
    
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
		  		
		  		var isup = new IS(
		  			req.body.name, 
		  			req.body.email,
		  			req.__('departments-array')[req.body.department], 
		  			await hashPassword(req.body.password)
		  		);

		  		
		  		var result = await isup.upsert();

		  		req.flash('form_data', {
		  			form_success : req.__('user.Internal Supervisor has been added')
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









