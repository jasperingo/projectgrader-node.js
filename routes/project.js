'use strict'


var Project = require('../controllers/ProjectController');
var auth = require('../middlewares/AuthMiddleware');

var express = require('express');
var router = express.Router();


router.get('/:id', auth('es', true), Project.index);


//router.get('/login', auth('es', true), ES.getLogin);


//router.post('/login', ES.postLogin);




module.exports = router;






