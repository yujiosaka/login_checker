var config = require('../config.js'),
    querystring = require('querystring'),
    mailer = require('nodemailer'),
    async = require('async'),
    client = require('twilio')(config.twilio.sid, config.twilio.token);

/**
 * Mailer Class
 */
var Mailer = (function() {
  Mailer.prototype.options = {};
  function Mailer(options) {
    this.options = options;
  }
  // SMTP Transport
  Mailer.prototype.getTransport = function() {
    var smtpOptions = {
      host: 'smtp.securemx.jp',
      secureConnection: false,
      port: 25
    };
    return mailer.createTransport("SMTP", smtpOptions);
  };
  // SMTP Send
  Mailer.prototype.send = function(callback) {
    var message = {
      from: this.options.from,
      to: this.options.to,
      subject: this.options.subject,
      text: this.options.text
    };
    return this.getTransport().sendMail(message, callback);
  };
  return Mailer;
})();

exports.createMailText = function(err, body, shop, login_successful) {
  var text = '';
  if (!login_successful) {
    text += 'サーバーが応答していないか、ログイン状態のチェックに失敗しています。\r\n';
    text += '\r\n';
  }
  text += '【監視設定】\r\n';
  text += 'SHOP： ' + shop.name + '\r\n';
  text += 'ログインURL: ' + shop.login_url + '\r\n';
  text += 'ユーザー名: ' + shop.form.userId + '\r\n';
  text += 'パスワード： ' + shop.form.password + '\r\n';
  text += 'タイムアウト設定（ミリ秒）： ' + shop.timeout + '\r\n';
  if (!login_successful) {
    text += '\r\n';
    if (err) {
      text += '【エラーメッセージ】\r\n';
      text += err;
    } else {
      text += '【レスポンスボディ】\r\n';
      text += body;
    }
  }
  return text;
};

exports.sendMail = function(from, to, subject, text, done) {
  var mailer = new Mailer({
    from: from,
    to: to,
    subject: subject,
    text: text
  });
  mailer.send(function(err) {
    done(err);
  });
};

exports.makeCall = function(from, to, message, done) {
  var url = 'http://twimlets.com/echo?';
  url += querystring.stringify({Twiml: '<Response><Say>' + message + '</Say></Response>'});
  async.forEach(to, function(to, done) {
    client.makeCall({
      from: from,
      to: to,
      url: url
    }, function(err) {
      done(err);
    });
  }, function(err) {
    done(err);
  });
};