

var HOD = require('../controllers/HodController');
var auth = require('../middlewares/AuthMiddleware');
var pager = require('../middlewares/PaginationMiddleware');

var express = require('express');
var router = express.Router();


router.get('/', auth('hod', true), pager(), HOD.index);


router.get('/login', auth('hod', true), HOD.getLogin);


router.post('/login', HOD.postLogin);




module.exports = router;




