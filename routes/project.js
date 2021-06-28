'use strict'


var Project = require('../controllers/ProjectController');
var auth = require('../middlewares/AuthMiddleware');

var express = require('express');
var router = express.Router();



router.get('/add', auth('admin', false), Project.getAdd);

router.post('/add', auth('admin', false), Project.postAdd);

router.get('/update', auth('admin', false), Project.getUpdate);

router.post('/update', auth('admin', false), Project.postUpdate);


router.get('/:id', auth(['hod', 'is', 'es'], false), Project.index);

router.post('/:id/isgrade', auth('is', false), Project.ISGrade);

router.post('/:id/ispregrade', auth('is', false), Project.ISPreGrade);

router.post('/:id/esgrade', auth('es', false), Project.ESGrade);


module.exports = router;





