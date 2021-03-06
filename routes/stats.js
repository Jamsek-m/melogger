var express = require('express');
var router = express.Router();
var auth = require('../moduli/auth');
var db = require('../moduli/db');
var formidable = require('formidable');

router.get('/', auth, function (req, res, next) {
	res.render('stats', { items: [], user: req.session.user });
});
router.post('/role', auth, function (req, res, next) {
	var form = formidable.IncomingForm();
	form.parse(req, function (err, polja) {
		if (err) console.log("napaka pri query stats/role: ", err);
		else {
			var tip = polja.Roles;
			var meja = 0;
			var skil = "";
			switch (tip) {
				case "V":
					meja = 14;
					skil = "CHR";
					break;
				case "GC":
					meja = 12;
					skil = "STR";
					break;
				case "DM":
					meja = 12;
					skil = "STR";
					break;
				case "AD":
					meja = 12;
					skil = "INTL";
					break;
				case "TG":
					meja = 11;
					skil = "STR";
					break;
				case "J":
					meja = 12;
					skil = "CHR";
					break;
				case "R2":
					meja = 14;
					skil = "CHR";
					break;
				case "R3":
					meja = 12;
					skil = "CHR";
					break;
				case "R4":
					meja = 10;
					skil = "CHR";
					break;
			}

			var izpis = {
				tip: tip,
				skil: skil,
				meja: meja
			};

			var sql = "SELECT CITIZEN_NAME, STR, DEX, CON, INTL, CHR FROM citizen WHERE STATUS!='D' AND " + skil + ">=" + meja;
			db.query(sql, function (err, rows) {
				if (err) console.log("napaka pri poizvedbi role: ", err);
				else res.render('stats', { items: rows, user: req.session.user, info: izpis });
			})
		}
	});
});


module.exports = router;