'use strict'


var ES = require('../controllers/ESController');
var auth = require('../middlewares/AuthMiddleware');
var pager = require('../middlewares/PaginationMiddleware');

var express = require('express');
var router = express.Router();


router.get('/', auth('es', true), pager(), ES.index);


router.get('/login', auth('es', true), ES.getLogin);


router.post('/login', ES.postLogin);




module.exports = router;






