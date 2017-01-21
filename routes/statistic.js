var express = require('express');
var router = express.Router();
var auth = require('../moduli/auth');
var db = require('../moduli/db');

router.get('/', auth, function(req, res, next){

	var sql = "select TRUNCATE(avg(STR), 1) as AVG_STR, TRUNCATE(avg(DEX), 1) as AVG_DEX, TRUNCATE(avg(CON), 1) as AVG_CON, TRUNCATE(avg(INTL), 1) as AVG_INTL, TRUNCATE(avg(CHR), 1) as AVG_CHR from citizen WHERE STATUS='A';"+
		"select count(*)as WARRIORS from citizen where STR >= 15 AND DEX >= 15 AND STATUS='A';" +
		"select count(*) as CRAFTERS from citizen where INTL>=15 AND STATUS='A';" +
		"select count(*) as NUM_CITIZENS from citizen where STATUS='A';";
	db.query(sql, function(err, rows){
		if(err) console.log("napaka pri statistic");
		else res.render('statistic', {avgs: rows[0][0], war: rows[1][0], craf: rows[2][0], cit: rows[3][0], user : req.session.user});
	});
});


module.exports = router;