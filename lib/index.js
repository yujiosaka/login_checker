var mailer = require('nodemailer');

/**
 * Mailer
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
exports.Mailer = Mailer;

exports.createMailText = function(err, body, shop) {
  var text = '下記のログイン処理に失敗しました。\r\n';
  text += '\r\n';
  text += 'SHOP： ' + shop.name + '\r\n';
  text += 'URL: ' + shop.uri + '\r\n';
  text += 'ユーザー名: ' + shop.form.userId + '\r\n';
  text += 'パスワード： ' + shop.form.password + '\r\n';
  text += 'タイムアウト設定（ミリ秒）： ' + shop.timeout + '\r\n';
  text += '\r\n';
  if (err) {
    text += 'エラーメッセージ：\r\n';
    text += err;
  } else {
    text += 'レスポンスボディ：\r\n';
    text += body;
  }
  return text;
};