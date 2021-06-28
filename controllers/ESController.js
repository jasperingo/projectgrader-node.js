'use strict'


var ES = require('../models/ES');
var Project = require('../models/Project');
var { getPagination, postFlasher, hashPassword, comparePassword, sessionSetter  } = require('../Helpers');

var { body, validationResult } = require('express-validator');



exports.index = async function (req, res, next) {
	
	try {

		var sections = await Project.findSectionsByExternalSupervisor(req.session.user.id);

		var section = (!req.query.fsection) ? sections[0] : req.query.fsection;

		var data = await Project.findAllBySectionAndExternalSupervisor(section, req.session.user.id, req.pager.pagination);

		var count = await Project.countAll({ section, externalSupervisor: req.session.user.id });
		
		res.render('es_dashboard', {
		    title: res.__('user.External Supervisor'),
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


exports.getLogin = function (req, res) {

	res.render('supervisor_login', {
	    title : res.__('user.{{ name }} Login', { name : res.__('user.External Supervisor')}),
	    supervisor_type : res.__('user.External Supervisor'),
	   	form_data : req.flash('form_data')[0],
	});
}


exports.postLogin = async function (req, res) {

  	try {
  		
  		var result = await ES.findByEmail(req.body.email);

  		if (!result || !await comparePassword(req.body.password, result.password)) {
  			
  			req.flash('form_data', postFlasher(req.body, [], { error : res.__('errors-msgs.credentials') }));
  	 		res.redirect('login');
  	 	
  	 	} else {

  	 		sessionSetter(req, 'es', result);

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
	
	res.render('es_add', {
	    title : res.__('user.{{ name }} Add', { name : res.__('user.Internal Supervisor')}),
	    form_data : req.flash('form_data')[0]
	});
}



exports.postAdd = [
	
	body('name').trim().isLength({ min: 1 }).withMessage((value, {req}) => req.__('errors-msgs.required')).escape(),

	body('email').trim().isEmail().withMessage((value, {req}) => req.__('errors-msgs.Email')).escape(),

    body('password').isLength({ min: 6 }).withMessage((value, {req}) => req.__('errors-msgs.Password length')),

	async function (req, res) {
		
	  	var errors = validationResult(req);
	  	
	    if (!errors.isEmpty()) {

	    	req.flash('form_data', postFlasher(req.body, errors.array()));

	    	res.redirect('add');
	    	
	    } else {

		  	try {
		  		
		  		var esup = new ES(
		  			req.body.name, 
		  			req.body.email,
		  			await hashPassword(req.body.password)
		  		);

		  		
		  		var result = await esup.upsert();

		  		req.flash('form_data', {
		  			form_success : req.__('user.External Supervisor has been added')
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










