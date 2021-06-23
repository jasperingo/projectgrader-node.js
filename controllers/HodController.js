

var HOD = require('../models/HOD');
var Project = require('../models/Project');



/*function getPagesBox(page, maxPages, url, id) {
	
	$box = "";
	if ($page-1 <= 1 || $page-1 >= $maxPages) {
		$box .= "<span>".$icons['previous']."</span> ";
	} else {
		$box .= "<a href=\"".$url.($page-2).$id."\" >".$icons['previous']."</a> ";
	}
	
	if ($page == 1) {
		$start = 1; 
	} elseif ($page >= $maxPages) {
		if ($maxPages > 2) {
			$start = $maxPages-2;
		} elseif ($maxPages == 2 || $maxPages == 1) {
			$start = 1;
		} else {
			$start = 0;
		}
	} else {
		$start = $page-1;
	}
	
	if ($maxPages == 0) {
		$len = 0;
	} elseif ($maxPages < 3) {
		$len = $maxPages+1;
	} else {
		$len = $start+3;
	}
	
	for ($i=$start;$i<$len;$i++) {
		$box .= "<a href=\"".$url.$i.$id."\" class=\"".($page == $i ? "active" : "")."\">".$i."</a> ";
	}
	
	if ($page+1 >= $maxPages) {
		$box .= "<span>".$icons['next']."</span> ";
	} else {
		$box .= "<a href=\"".$url.($page+2).$id."\" >".$icons['next']."</a> ";
	}
	
	return $box;
}*/



exports.index = async function (req, res, next) {
	
	try {

		var sections = await Project.findAllDistinct('section');

		var section = sections[0];

		if (req.query.fsection) {
			for (let s of sections) {
				if (s == req.query.fsection) {
					section = s;
					break;
				}
			}
		}

		var data = await Project.findAllBySection(section, req.myPager);

		var count = await Project.countAllBySection(section, req.myPager);

		console.log(req.myPager);
		
		res.render('hod_dashboard', {
		    title: res.__('user.Head of Department'),
		    sections: sections,
		    section: section,
		    data: data,
		    data_page: req.query.page?req.query.page:1,
		    data_count: 10//Math.ceil(count/req.myPager[1]),
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

  		if (result.password !== req.body.password) {
  			
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





