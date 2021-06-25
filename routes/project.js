'use strict'


var Project = require('../controllers/ProjectController');
var auth = require('../middlewares/AuthMiddleware');

var express = require('express');
var router = express.Router();



router.get('/add', auth('admin', false), Project.getAdd);

router.post('/add', auth('admin', false), Project.postAdd);


router.get('/:id', auth('es', true), Project.index);


module.exports = router;






