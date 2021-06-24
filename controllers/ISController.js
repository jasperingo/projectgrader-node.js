'use strict'


var IS = require('../models/IS');
var Project = require('../models/Project');
var { getPagination } = require('../Helpers');



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








