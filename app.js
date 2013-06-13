var servers = require('./config.js').servers,
    lib = require('./lib'),
    request = require('request'),
    cronJob = require('cron').CronJob;

servers.forEach(function(server) {
  server.prevLoginSuccessful = true;
  job = new cronJob({
    cronTime: server.cronTime,
    onTick: function() {
      request.get({
        url: server.url,
        timeout: server.timeout
      }, function (err, res, body) {
        if (err) {
          if (server.prevLoginSuccessful) {
            console.log('電話の呼び出し中です。');
            lib.makeCall(server.call.from, server.call.tos, server.call.message, function(err) {
              if (err) {
                console.log('電話の呼び出しに失敗しました。詳細は以下のログをご確認ください');
                console.log(err);
              }
            });
            server.prevLoginSuccessful = false;
          }
        } else {
          server.prevLoginSuccessful = true;
          console.log(body);
        }
      });
    }
  });
  job.start();
});