// routes/index_other.js

const express = require('express');
const fs = require('fs');
const session = require('express-session');
const router = express.Router();
const { addNewUser } = require('../service/addNewUser.js');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

const admin = require('firebase-admin');



// TODO: 別ファイルに移し、ignore の設定ディレクトリに配置,secretkey生成処理
// セッション設定
router.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));




const ejs = require('ejs');

router.get('/', (req, res) => {
  // テンプレートのパス
  const templatePath = './views/other.ejs';

  // サーバーサイドでレンダリング
  ejs.renderFile(templatePath, { serverMessage: null }, (err, renderedHtml) => {
    if (err) {
      console.error('Failed to render EJS template:', err);
      res.status(500).send('Failed to render EJS template');
    } else {
      res.send(renderedHtml);
    }
    res.end();
  });
});





// 静的なCSSファイルを提供するためのルート
router.use('/other', express.static('css'));

router.post('/login', async (req, res) => {
  const { username } = req.body;

  try {
    // Firebase Realtime Databaseから"user"を一度すべて取得
    const userInfoSnapshot = await admin.database().ref('userinfo').once('value');
    const allUsersInfo = userInfoSnapshot.val();
    console.log(allUsersInfo);

    let userFound = false;

    for (const [key, value] of Object.entries(allUsersInfo)) {
      if (value.user === username) {
        // ログインに成功した場合はセッションにログイン情報を保存
        req.session.isLoggedIn = true;
        req.session.username = username;
        // ログイン中ユーザーのキー情報もセッションに保存 
        const loggedInUserKey = key;
        req.session.loggedInUserKey = loggedInUserKey;
        // 該当ユーザが見つかった場合
        userFound = true;
        break;
      }
    }

    if (userFound) {
      // ログイン成功時のリダイレクト先を指定
      res.redirect('/');
    } else {
      // ユーザーがデータベースに存在しない場合
      return res.send('<script>alert("ユーザーが存在しません"); window.location.href="/other/";</script>')
    }

  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.send('<script>alert("ログインに失敗しました"); window.location.href="/other/";</script>')
  }
});

router.post('/signup', async (req, res) => {
  const { signupUsername } = req.body;
  console.log(signupUsername + ":req.body");

  // Firebase Realtime Databaseから"user"を一度すべて取得
  const userInfoSnapshot = await admin.database().ref('userinfo').once('value');
  const allUsersInfo = userInfoSnapshot.val();
  console.log(allUsersInfo);

  if (Object.values(allUsersInfo).some((user) => user.user == signupUsername)) {
    console.log(signupUsername + "は存在します");
    const serverMessage = `${signupUsername} は既に存在します`;
    res.render('other', { serverMessage });
  } else {
    addNewUser(signupUsername)
    console.log(signupUsername + "を登録");
    res.redirect('/');
  }
});

// ボタンが押下されたときに'/'へリダイレクトするルート
router.get('/return-to-top', (req, res) => {
  res.redirect('/');
})

module.exports = router;