var express = require('express');
var router = express.Router();
var auth = require('../moduli/auth');
var db = require('../moduli/db');

/* GET home page. */
router.get('/', auth, function (req, res, next) {
	var sql = "SELECT DATE_FORMAT(DATUM_VNOSA,'%d.%m.%Y, %H:%m' ) as DATUM_VNOSA, d.TIP, CITIZEN_NAME, NAZIV, KOLICINA, USERNAME FROM donacija d JOIN citizen c on d.CITIZEN=c.CITIZEN_ID JOIN sif_res sr ON sr.RES_ID=d.RESURS JOIN user u ON u.USER_ID=d.VNESEL_USER WHERE KOLICINA>0 ORDER BY DATUM_VNOSA DESC LIMIT 10";
	db.query(sql, function (err, rows) {
		if (err) console.log("napaka pri indexu: ", err);
		else res.render('index', { items: rows, user: req.session.user });
	})
});



module.exports = router;
