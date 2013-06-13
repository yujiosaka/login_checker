var config = require('../config.js'),
    querystring = require('querystring'),
    async = require('async'),
    client = require('twilio')(config.twilio.sid, config.twilio.token);

exports.makeCall = function(from, tos, message, done) {
  var url = 'http://twimlets.com/echo?';
  url += querystring.stringify({Twiml: '<Response><Say>' + message + '</Say></Response>'});
  tos.forEach(function(to) {
    client.makeCall({
      from: from,
      to: to,
      url: url
    }, function(err) {
      done(err);
    });
  });
};