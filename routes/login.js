var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var db = require('../moduli/db');
var crypto = require('crypto');
var auth = require('../moduli/auth');

router.get('/', function (req, res, next) {
	req.session.user = null;
	res.render('login');
});

router.post('/', function (req, res, next) {

	var upime = req.body.upime;
	var geslo = crypto.createHash('sha256').update(req.body.geslo).digest("hex");

	db.query("SELECT USERNAME, PASSWORD, USER_ID, TIP FROM user", function (err, rows) {
		if (err) throw err;
		var logged = false;
		for (var i = 0; i < rows.length; i++) {
			if (rows[i].USERNAME === upime && rows[i].PASSWORD === geslo) {
				req.session.user = {
					username: rows[i].USERNAME,
					id: rows[i].USER_ID,
					tip: rows[i].TIP
				};
				logged = true;
			}
		}
		res.json({data : logged});
	});
});

router.get('/logout', function (req, res, next) {
	//req.session.user = null;
	req.session.destroy();
	res.redirect('/login');
});

module.exports = router;
