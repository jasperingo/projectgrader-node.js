'use strict'


var Project = require('../models/Project');
var { getPagination, postFlasher, hashPassword } = require('../Helpers');

var { body, validationResult } = require('express-validator');



exports.index = function (req, res) {

	res.send('e go b');
}



exports.getAdd = function (req, res) {
	
	res.render('project_add', {
	    title : res.__('user.{{ name }} Add', { name : res.__('user.Head of Department')}),
	    form_data : req.flash('form_data')[0],
	    year : new Date().getFullYear()
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





