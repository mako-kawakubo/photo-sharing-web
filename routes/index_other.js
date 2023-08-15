// routes/index_other.js

const express = require('express');
const fs = require('fs');
const session = require('express-session');
const router = express.Router();
const { addNewUser } = require('../service/addNewUser.js');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

const admin = require('firebase-admin');




// セッション設定
router.use(session({
  secret: 'your-secret-key', // セッションの署名に使用する秘密キーを指定
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

    // データベースに"user"が存在しているかを確認
    if (allUsersInfo) {
      // "user"の中にusernameが存在するかを比較
      
      if (Object.values(allUsersInfo).some((user) => user.user === username)) {
        // ログインに成功した場合はセッションにログイン情報を保存
        req.session.isLoggedIn = true;
        req.session.username = username;
        // ログイン成功時のリダイレクト先を指定
        res.redirect('/');
      } else {
        // ユーザーがデータベースに存在しない場合
        return res.send('<script>alert("ログインに失敗しました"); window.location.href="/other/";</script>')
      }
    } else {
      // データベースに"user"が存在しない場合
      return res.send('<script>alert("ログインに失敗しました"); window.location.href="/other/";</script>')
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.send('<script>alert("ログインに失敗しました"); window.location.href="/other/";</script>')
  }
});

router.post('/signup', async (req, res) => {
  const { signupUsername } = req.body;
  console.log(signupUsername+":req.body");

      // Firebase Realtime Databaseから"user"を一度すべて取得
      const userInfoSnapshot = await admin.database().ref('userinfo').once('value');
      const allUsersInfo = userInfoSnapshot.val();
      console.log(allUsersInfo);

       if (Object.values(allUsersInfo).some((user) => user.user == signupUsername)) {
        console.log(signupUsername+"は存在します");
        const serverMessage = `${signupUsername} は既に存在します`;
        res.render('other', { serverMessage });
      } else{
      addNewUser(signupUsername)
      console.log(signupUsername+"を登録");
      res.redirect('/');
      }
});

// ボタンが押下されたときに'/'へリダイレクトするルート
router.get('/return-to-top', (req, res) => {
  res.redirect('/');
})

module.exports = router;