var express = require('express');
var router = express.Router();
var db = require('../moduli/db');
var auth = require('../moduli/auth');
var formidable = require('formidable');

router.get('/', auth, function (req, res, next) {
	var sql = "SELECT DATE_FORMAT(DATUM_VNOSA,'%d.%m.%Y, %H:%m' ) as DATUM_IN, round(KOLICINA * MON_VAL) as VREDNOST, CITIZEN_NAME, NAZIV, KOLICINA, USERNAME FROM donacija d JOIN citizen c on d.CITIZEN=c.CITIZEN_ID JOIN sif_res sr ON sr.RES_ID=d.RESURS JOIN user u ON u.USER_ID=d.VNESEL_USER WHERE KOLICINA!=0 ORDER BY DATUM_VNOSA DESC";
	db.query(sql, function (err, rows) {
		if (err) console.log("napaka pri /donations: ", err);
		else res.render('overview_donation', { items: rows, user: req.session.user });
	});
});

router.get('/new', auth, function (req, res, next) {
	var sql = "SELECT CITIZEN_NAME, CITIZEN_ID FROM citizen where STATUS != 'D' ORDER BY CITIZEN_NAME;" +
		"SELECT RES_ID, NAZIV from sif_res ORDER BY NAZIV;";
	db.query(sql, function (err, rows) {
		if (err) console.log("napaka pri novi donaciji: ", err);
		else res.render('add_donation', { citizens: rows[0], resources: rows[1], user: req.session.user });
	});
});

router.post('/new', auth, function (req, res, next) {
	var form = formidable.IncomingForm();
	form.parse(req, function (err, polja) {
		if (err) {
			console.log("napaka pri formi: ", err);
		} else {
			var datum = new Date();
			var citizen = polja.Citizen;
			var kol = polja.Tip+""+polja.Kolicina;
			var resurs = polja.Resurs;
			var vnesel = req.session.user.id;
			
			var sql = "INSERT INTO donacija(DATUM_VNOSA, CITIZEN, KOLICINA, RESURS, VNESEL_USER) VALUES (?,?,?,?,?)";
			db.query(sql, [datum, citizen, kol, resurs, vnesel], function (err, rows) {
				if (err) console.log("napaka pri insertu nove donacije", err);
				else res.redirect('/donations');
			});
		
		}
	});
});

router.get('/:id', auth, function (req, res, next) {
	var sql = "SELECT DATE_FORMAT(DATUM_VNOSA,'%d.%m.%Y, %H:%m' ) as DATUM_IN, round(KOLICINA * MON_VAL) as VREDNOST, CITIZEN_NAME, NAZIV, KOLICINA, USERNAME FROM donacija d JOIN citizen c on d.CITIZEN=c.CITIZEN_ID JOIN sif_res sr ON sr.RES_ID=d.RESURS JOIN user u ON u.USER_ID=d.VNESEL_USER WHERE KOLICINA!=0 AND CITIZEN_ID=" + req.params.id + " ORDER BY DATUM_VNOSA DESC";
	db.query(sql, function (err, rows) {
		if (err) console.log("napaka pri /donations/id: ", err);
		else res.render('citizen_donations', { items: rows, user: req.session.user });
	});
});



module.exports = router;