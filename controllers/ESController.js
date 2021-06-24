'use strict'


var ES = require('../models/ES');
var Project = require('../models/Project');
var { getPagination } = require('../Helpers');



exports.index = async function (req, res, next) {
	
	try {

		var sections = await Project.findSectionsByExternalSupervisor(1);

		var section = sections[0];

		if (req.query.fsection && sections.indexOf(req.query.fsection) > -1) {
			section = req.query.fsection;
			var pageUrl = `${req.baseUrl}${req.path}?fsection=${section}&page=`;
		} else {
			var pageUrl = `${req.baseUrl}${req.path}?page=`;
		}

		var data = await Project.findAllBySectionAndExternalSupervisor(section, 1, req.myPager[1]);

		var count = await Project.countAll({section});
		
		res.render('es_dashboard', {
		    title: res.__('user.External Supervisor'),
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

	var input_values = req.flash('login_values')[0];

	res.render('supervisor_login', {
	    title : res.__('user.{{ name }} Login', { name : res.__('user.External Supervisor')}),
	    supervisor_type : res.__('user.External Supervisor'),
	    input_errors : req.flash('login_errors'),
	    input_values : input_values ? input_values : ''
	});
}


exports.postLogin = async function (req, res) {

  	try {
  		
  		var result = await ES.findByEmail(req.body.email);

  		if (!result || result.password !== req.body.password) {
  			
  			req.flash('login_errors', res.__('errors-msgs.credentials'));
  			req.flash('login_values', { email: req.body.email });
  	 		res.redirect('login');
  	 	
  	 	} else {

  	 		req.session.es = { 
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











