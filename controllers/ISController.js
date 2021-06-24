'use strict'


var IS = require('../models/IS');
var Project = require('../models/Project');
var { getPagination } = require('../Helpers');



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

		var data = await Project.findAllBySection(section, req.myPager[1]);

		var count = await Project.countAllBySection(section);

		//console.log(req.myPager);
		
		res.render('hod_dashboard', {
		    title: res.__('user.Head of Department'),
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
	
	res.render('supervisor_login', {
	    title : res.__('user.{{ name }} Login', { name : res.__('user.Internal Supervisor')}),
	    input_errors : req.flash('login_errors')
	});
}


exports.postLogin = async function (req, res) {

  	try {
  		
  		var result = await IS.findByEmail(req.body.email);

  		if (!result || result.password !== req.body.password) {
  			
  			req.flash('login_errors', res.__('errors-msgs.credentials'));
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
  		res.redirect('login');
  		console.log(error);
  	}

}








