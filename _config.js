// Twilioのアカウント情報を保持するオブジェクト。電話をかける際に使用します。
exports.twilio = {
  sid: 'ACCOUNT SID',
  token: 'AUTH TOKEN'
};

// SHOPごとの設定を保持するオブジェクト
exports.shops = [
  {
    name: 'デモサイト',
    cronTime: '*/5 * * * *', // 5分毎にログインをチェック
    uri: 'https://example.com/Login',
    form: {
      userId: 'test01@example.com',
      password: 'test01'
    },
    canSendMail: true,
    timeout: 3000 * 10, // タイムアウト設定（ミリ秒）
    regexp: /\"ログアウト\"/, // ログイン後のページでこの正規表現に一致するテキストが存在する場合にログイン成功と認識されます
    mailer: { // メール送信設定
      from: 'alert@example.com',
      to: ['test01@example.com', 'test02@example.com']
    },
    canMakeCall: true,
    call: {
      from: '+81000000000', // Twilioで取得（購入）した電話番号
      to: '+81000000000',
      url: 'http://twimlets.com/echo?Twiml=%3CResponse%3E%3CSay%3EEmergency%21+Emergency%21%3C%2FSay%3E%3C%2FResponse%3E' // "Emergency! Emergency!"
    }
  }
];