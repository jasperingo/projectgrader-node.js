'use strict'


var ES = require('../controllers/ESController');
var auth = require('../middlewares/AuthMiddleware');
var pager = require('../middlewares/PaginationMiddleware');

var express = require('express');
var router = express.Router();



router.get('/add', auth('admin', false), ES.getAdd);

router.post('/add', auth('admin', false), ES.postAdd);


router.get('/', auth('es', false), pager(), ES.index);


router.get('/login', auth('es', true), ES.getLogin);


router.post('/login', auth('es', true), ES.postLogin);




module.exports = router;






