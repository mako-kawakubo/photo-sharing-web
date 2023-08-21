// routes/index_other.js

const express = require('express');
const fs = require('fs');
const session = require('express-session');
const admin = require('firebase-admin');
const router = express.Router();
const { addNewUser } = require('../service/addNewUser.js');


const bodyParser = require('body-parser');
const sessionConfig = require('../config/sessionConfig'); // 新しい行を追加

router.use(bodyParser.urlencoded({ extended: true }));
router.use(sessionConfig);


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

router.post('/NewRegist', async (req, res) => {
  const { signupUsername } = req.body;
  console.log(signupUsername + ":req.body");

  // Firebase Realtime Databaseから"user"を一度すべて取得
  const userInfoSnapshot = await admin.database().ref('userinfo').once('value');
  const allUsersInfo = userInfoSnapshot.val();


  if (Object.values(allUsersInfo).some((user) => user.user == signupUsername)) {
    console.log(signupUsername + "は存在します");
    req.session.serverMessage =`${signupUsername} は既に存在します`;
    res.redirect('/other/Regist');
  } else {
    addNewUser(signupUsername)
    console.log(signupUsername + "を登録");
    req.session.serverMessage = `${signupUsername} を登録しました`;
    res.redirect('/other/Regist');
  }
});

// ボタンが押下されたときに'/'へリダイレクトするルート
router.get('/return-to-top', (req, res) => {
  res.redirect('/');
})

// 新規登録用ページを表示
router.get('/Regist', (req, res) => {

  const serverMessage = req.session.serverMessage; // セッションからメッセージを取得
  req.session.serverMessage = null; // メッセージを取得したらセッションから削除

  // テンプレートのパス
  const templatePath = './views/NewRegist.ejs';

  // サーバーサイドでレンダリング
  ejs.renderFile(templatePath, { serverMessage}, (err, renderedHtml) => {
    if (err) {
      console.error('Failed to render EJS template:', err);
      res.status(500).send('Failed to render EJS template');
    } else {
      res.send(renderedHtml);
    }
    res.end();
  });
});


module.exports = router;