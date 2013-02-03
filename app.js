var config = require('./config.js'),
    shops = config.shops,
    lib = require('./lib'),
    Mailer = lib.Mailer,
    request = require('request'),
    cronJob = require('cron').CronJob,
    client = require('twilio')(config.twilio.sid, config.twilio.token);

var req = request.defaults({'proxy':'http://localhost:8081'}); // おまじない
shops.forEach(function(shop) {
  job = new cronJob({
    cronTime: shop.cronTime,
    onTick: function() {
      req.post({
        uri: shop.uri,
        form: shop.form,
        timeout: shop.timeout,
        followRedirect: true,
        followAllRedirects: true
      },
      function (err, res, body) {
        var loggedin = shop.regexp.exec(body);
        if (loggedin) {
          return console.log('【' + shop.name + '】ログイン処理に成功しました');
        }
        console.log('【' + shop.name + '】ログイン処理に失敗しました');
        //send an email
        if (shop.canSendMail) {
          var mailer = new Mailer({
            from: shop.mailer.from,
            to: shop.mailer.to,
            subject: '【' + shop.name + '】ログイン処理に失敗しました',
            text: lib.createMailText(err, body, shop)
          });
          mailer.send(function(err) {
            if (err) {
              console.log(err);
            }
          });
        }
        // make a phone call
        if (shop.canMakeCall) {
          client.makeCall({
            from: shop.call.from,
            to: shop.call.to,
            url: shop.call.url
          }, function(err) {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    }
  });
  job.start();
});