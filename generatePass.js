var crypto = require('crypto');

var izberiGeslo = "jerman";

var geslo = crypto.createHash('sha256').update(izberiGeslo).digest("hex");

console.log(geslo);