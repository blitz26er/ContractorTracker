var sendgrid  = require('sendgrid')('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');
var email     = new sendgrid.Email({
  to:       'blitz26er@gmx.com',
  from:     'blitz26er@gmail.com',
  subject:  'Subject goes here',
  html:     '<h1>Hello world<h1><a href="asdfasdfasdf">aaaa</a>'
});

sendgrid.send(email, function(err, json) {
  if (err) { return console.error(err); }
  console.log(json);
});