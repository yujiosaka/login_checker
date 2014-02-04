// Twilioのアカウント情報を保持するオブジェクト。電話をかける際に使用します。
exports.twilio = {
  sid: 'ACCOUNT SID',
  token: 'AUTH TOKEN'
};

// サーバーごとの設定を保持するオブジェクト
exports.servers = [
  {
    name: 'デモサイト',
    cronTime: '* * * * *', // 分毎
    url: 'https://example.com/', // URL
    timeout: 10000, // タイムアウト設定（ミリ秒）
    failLimit: 2,
    call: {
      from: '+81000000000', // Twilioで取得（購入）した電話番号
      tos: '+81000000000',
      message: "Emergency! Emergency! An login attempt failed at Demo Site. Please check your email for more details. Thanks!" // In English
    }
  }
];
