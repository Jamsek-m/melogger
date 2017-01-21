var mysql = require('mysql');
var conf = require('./db_config.json');

var conn = mysql.createPool({
	connectionLimit : conf.connLimit,
	multipleStatements : conf.multStmt,
	host : conf.host,
	user : conf.user,
	password : conf.pass,
	database : conf.database
});

conn.getConnection(function(err){
	if(err) throw err;
});

module.exports = conn;