var express = require('express');
var router = express.Router();
var db = require('../moduli/db');
var formidable = require('formidable');
var crypto = require('crypto');

function adminAvt(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login');
    } else if (req.session.user.tip != 'A') {
        res.redirect('/');
    } else {
        next();
    }
}


router.get('/', adminAvt, function(req, res, next) {
    var sql = "SELECT USERNAME, USER_ID, TIP FROM user";
    db.query(sql, function(err, rows) {
        if (err) console.log("napaka pri GET /admin: ", err);
        else {
            res.render('admin', { items: rows, user: req.session.user });
        }
    });
});

router.get('/edit/:id', adminAvt, function(req, res, next) {
    var sql = "SELECT USERNAME, USER_ID, TIP FROM user WHERE USER_ID=" + req.params.id;
    db.query(sql, function(err, rows) {
        if (err) console.log("napaka pri GET /admin/get/" + req.params.id + ": ", err);
        else res.render('admin_user', { person: rows[0], user: req.session.user });
    })
});

router.post('/edit/:id', adminAvt, function(req, res, next) {
    var form = formidable.IncomingForm();
    form.parse(req, function(err, polja) {
        if (err) console.log("napaka pri parsanju forme na /adminedit/:id: ", err);
        else {
            var upime = polja.Upime;
            var tip = polja.Tip;
            var geslo = polja.pass1;

            if (req.params.id == req.session.user.id) {
                req.session.user.tip = tip;
                req.session.user.username = upime;
            }
            if (geslo) {
                geslo = crypto.createHash('sha256').update(geslo).digest("hex");
                var sql = "UPDATE user SET USERNAME=?, TIP=?, PASSWORD=? WHERE USER_ID=" + req.params.id;
                db.query(sql, [upime, tip, geslo], function(err, rows) {
                    if (err) console.log("napaka pri update user: ", err);
                    else res.redirect('/admin');
                });
            } else {
                var sql = "UPDATE user SET USERNAME=?, TIP=? WHERE USER_ID=" + req.params.id;
                db.query(sql, [upime, tip], function(err, rows) {
                    if (err) console.log("napaka pri update user: ", err);
                    else res.redirect('/admin');
                });
            }
        }
    });

});

router.post('/new', adminAvt, function(req, res, next) {
    var form = formidable.IncomingForm();
    form.parse(req, function(err, polja) {
        if (err) console.log("napaka pri parsanju forme na /admin/new: ", err);
        else {
            var upime = polja.Upime;
            var geslo = crypto.createHash('sha256').update(polja.Geslo).digest("hex");
            var tip = polja.Tip;

            var sql = "INSERT INTO user(USERNAME, PASSWORD, TIP) VALUES(?,?,?)";
            db.query(sql, [upime, geslo, tip], function(err, rows) {
                if (err) console.log("napaka pri /admin/new: ", err);
                else res.redirect('/admin');
            });
        }
    });
});

router.get('/delete/:id', adminAvt, function(req, res, next) {
    var sql = "DELETE FROM user WHERE USER_ID=" + req.params.id;
    db.query(sql, function(err, rows) {
        if (err) console.log("napaka pri brisanju userja: ", err);
        else res.redirect('/admin');
    });
});


module.exports = router;