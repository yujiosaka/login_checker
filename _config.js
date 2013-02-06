var USER_AGENTS = require('./const.js').USER_AGENTS;

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
    login_url: 'https://example.com/Login', // ログイン処理のURL（≠ログインフォームのURL）
    form: {
      userId: 'test01@example.com',
      password: 'test01'
    },
    headers: {
      'User-Agent': USER_AGENTS.PC.FIRE_FOX_10 // const.jsを参照
    },
    canSendMail: true,
    timeout: 3000 * 10, // タイムアウト設定（ミリ秒）
    regexp: /\"ログアウト\"/, // ログイン後のページでこの正規表現に一致するテキストが存在する場合にログイン成功と認識されます
    mail: { // メール送信設定
      from: 'alert@example.com',
      to: ['test01@example.com', 'test02@example.com']
    },
    canMakeCall: true,
    call: {
      from: '+81000000000', // Twilioで取得（購入）した電話番号
      to: '+81000000000',
      url: "Emergency! Emergency! An login attempt failed at Demo Site. Please check your email for more details. Thanks!" // In English
    }
  }
];