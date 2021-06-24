'use strict'

var HOD = require('../models/HOD');
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





