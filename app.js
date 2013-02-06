var shops = require('./config.js').shops,
    lib = require('./lib'),
    request = require('request'),
    cronJob = require('cron').CronJob;

shops.forEach(function(shop) {
  shop.prevLoginSuccessful = true;
  job = new cronJob({
    cronTime: shop.cronTime,
    onTick: function() {
      request.post({
        url: shop.login_url,
        form: shop.form,
        headers: { 'User-Agent': shop.userAgent },
        timeout: shop.timeout,
        followRedirect: true,
        followAllRedirects: true
      }, function (err, res, body) {
        var loggedin = shop.regexp.exec(body);
        if (loggedin) {
          console.log('【' + shop.name + '】ログイン処理に成功しました');
          if (!shop.prevLoginSuccessful) {
            var subject = '【' + shop.name + '】ログイン障害から復旧しました';
            var text = lib.createMailText(err, body, shop, true)
            lib.sendMail(shop.mail.from, shop.mail.to, subject, text, function(err) {
              if (err) {
                console.log('メールの送信に失敗しました。詳細は以下のログをご確認ください');
                console.log(err);
              }
            });
          }
          shop.prevLoginSuccessful = true;
        } else {
          console.log('【' + shop.name + '】ログイン処理に失敗しました');
          if (shop.prevLoginSuccessful) {
            var subject = '【' + shop.name + '】ログイン障害が発生しました';
            var text = lib.createMailText(err, body, shop, false);
            lib.sendMail(shop.mail.from, shop.mail.to, subject, text, function(err) {
              if (err) {
                console.log('メールの送信に失敗しました。詳細は以下のログをご確認ください');
                console.log(err);
              }
            });
            if (shop.canMakeCall) {
              lib.makeCall(shop.call.from, shop.call.to, shop.call.message, function(err) {
                if (err) {
                  console.log('電話の呼び出しに失敗しました。詳細は以下のログをご確認ください');
                  console.log(err);
                }
              });
            }
          }
          shop.prevLoginSuccessful = false;
        }
      });
    }
  });
  job.start();
});