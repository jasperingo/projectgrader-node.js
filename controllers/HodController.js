'use strict'

var HOD = require('../models/HOD');
var Project = require('../models/Project');
var { getPagination, postFlasher, hashPassword } = require('../Helpers');

var { body, validationResult } = require('express-validator');



exports.index = async function (req, res, next) {
	
	try {

		var sections = await Project.findAllDistinct('section');

		var section = sections[0];

		if (req.query.fsection && sections.indexOf(req.query.fsection) > -1) {
			section = req.query.fsection;
			var pageUrl = `${req.baseUrl}${req.path}?fsection=${section}&page=`;
		} else {
			var pageUrl = `${req.baseUrl}${req.path}?page=`;
		}

		// filter by hod department

		var data = await Project.findAllBySection(section, req.myPager[1]);

		var count = await Project.countAllBySection(section);

		//console.log(req.myPager);
		
		res.render('hod_dashboard', {
		    title: res.__('user.Head of Department'),
		    user : { name : 'Prof. Biscuit Half' },
		    sections: sections,
		    section: section,
		    data: data,
		    pagination: getPagination(req.myPager[0], Math.ceil(count/req.myPager[1][1]), pageUrl),
		});

	} catch (error) {
		next(error);
	}
}


exports.getLogin = function (req, res) {
	
	res.render('hod_login', {
	    title : res.__('user.{{ name }} Login', { name : res.__('user.Head of Department')}),
	    input_errors : req.flash('login_errors')
	});
}

// send back user input
// flash errors and input values in function.
exports.postLogin = async function (req, res) {
	
  	var department = req.__('departments-array')[req.body.department];

  	try {
  		
  		var result = await HOD.findByDepartment(department);

  		if (!result || result.password !== req.body.password) {
  			
  			req.flash('login_errors', res.__('errors-msgs.credentials'));
  	 		res.redirect('login');
  	 	
  	 	} else {

  	 		req.session.hod = { 
  	 			id : result.id,
  	 			name : result.name
  	 		};

  	 		res.redirect('./');

  			console.log(result);
  	 	}

  	} catch (error) {

  		req.flash('login_errors', res.__('errors-msgs.unknown'));
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








