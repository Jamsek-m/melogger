var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var db = require('../moduli/db');
var crypto = require('crypto');
var auth = require('../moduli/auth');

router.get('/', function (req, res, next) {
	res.render('login', { msg: "" });
});

router.post('/', function (req, res, next) {
	var form = formidable.IncomingForm();
	form.parse(req, function (err, polja) {
		if (err) console.log("napaka pri loginu: ", err);
		else {
			var upime = polja.Upime;
			var geslo = crypto.createHash('sha256').update(polja.Geslo).digest("hex");

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
						res.redirect('/');
					}
				}
				if (!logged) {
					res.render('login', { msg: "Napačno uporabniško ime ali geslo" })
				}
			});
		}
	});
});

router.get('/logout', function (req, res, next) {
	req.session.user = null;
	res.redirect('/login');
});








module.exports = router;
