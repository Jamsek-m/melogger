var express = require('express');
var router = express.Router();
var db = require('../moduli/db');
var auth = require('../moduli/auth');
var formidable = require('formidable');

router.get('/', auth, function (req, res, next) {
	var sql = "SELECT CITIZEN_ID, CITIZEN_NAME,BALANCE,STR,DEX,INTL,CON,CHR,SUM(KOLICINA * MON_VAL) as SUM_MON_VAL FROM donacija d JOIN sif_res sr on d.RESURS=sr.RES_ID JOIN citizen c ON d.CITIZEN=c.CITIZEN_ID GROUP BY CITIZEN";
	db.query(sql, function (err, rows) {
		if (err) console.log("napaka pri GET /list: ", err);
		else res.render('list', { items: rows, user: req.session.user });
	});
});

router.get('/edit/:id', auth, function (req, res, next) {
	var sql = "SELECT * FROM citizen WHERE CITIZEN_ID=" + req.params.id;
	db.query(sql, function (err, rows) {
		if (err) console.log("napaka pri get /list/edit: ", err);
		else res.render('edit_citizen', { citizen: rows[0], user: req.session.user });
	});
});

router.post('/edit/:id', auth, function (req, res, next) {
	var form = formidable.IncomingForm();
	form.parse(req, function (err, polja) {
		if (err) console.log("napaka pri parsanju forme edit citizen", err);
		else {
			var name = polja.CitizenName;
			var str = polja.Str;
			var dex = polja.Dex;
			var con = polja.Con;
			var char = polja.Char;
			var intl = polja.Intl;

			var sql = "UPDATE citizen SET CITIZEN_NAME=?, STR=?, DEX=?, CON=?, INTL=?, CHR=? WHERE CITIZEN_ID=" + req.params.id;

			db.query(sql, [name, str, dex, con, intl, char], function (err, rows) {
				if (err) console.log("napaka pri updateu edit citizen: ", err);
				else res.redirect('/list');
			});
		}
	});
});

router.post('/add', auth, function (req, res, next) {
	var form = formidable.IncomingForm();
	form.parse(req, function (err, polja) {
		if (err) console.log("napaka pri parsanju forme nov citizen: ", err);
		else {
			var name = polja.CitizenName;
			var str = polja.Str;
			var dex = polja.Dex;
			var con = polja.Con;
			var char = polja.Char;
			var intl = polja.Intl;

			var sql = "INSERT INTO citizen(CITIZEN_NAME, STR, DEX, INTL, CON, CHR) VALUES(?,?,?,?,?,?);" +
				"SET @last_id := LAST_INSERT_ID();" +
				"INSERT INTO donacija (VNESEL_USER, DATUM_VNOSA, KOLICINA, RESURS, CITIZEN, TIP) VALUES (?, ?, '0', '256', @last_id, 'P');";

			db.query(sql, [name, str, dex, intl, con, char, req.session.user.id, new Date()], function (err, rows) {
				if (err) console.log("napaka pri vnosu citizena: ", err);
				else res.redirect('/list');
			});
		}
	});
});

router.get('/delete/:id', auth, function (req, res, next) {
	var sql = "DELETE FROM citizen WHERE CITIZEN_ID=" + req.params.id;
	db.query(sql, function (err, rows) {
		if (err) console.log("napaka pri delete citizen: ", err);
		else res.redirect('/list');
	})
});


module.exports = router;