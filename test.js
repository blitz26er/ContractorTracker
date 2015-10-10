var arc4 = require('arc4');
 
var cipher = arc4('arc4', '2012-04-21');
var d = cipher.encodeString('Eric Riley');
console.log(d);
var decipher = arc4('arc4', '2012-04-21');
var e = decipher.decodeString(d);
console.log(e);

