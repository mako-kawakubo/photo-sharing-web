// routes/index_other.js

const express = require('express');
const fs = require('fs');
const session = require('express-session');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

const admin = require('firebase-admin');
const firebaseInsta = require('../firebase/firebase_insta.js');



// セッション設定
router.use(session({
  secret: 'your-secret-key', // セッションの署名に使用する秘密キーを指定
  resave: false,
  saveUninitialized: true
}));

const otherPage = fs.readFileSync('./other/other.html', 'UTF-8');

// /other.html へのルート
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(otherPage);
  res.end();
});

router.post('/login', async (req, res) => {
  const { username } = req.body;

  try {
    // TODO:後で書き換え→Firebase Realtime Databaseから"user"を一度すべて取得
    const userInfoSnapshot = await admin.database().ref('userinfo').once('value');
    const allUsersInfo = userInfoSnapshot.val();
    console.log(allUsersInfo);

    // もしデータベースに"user"が存在しているかを確認
    if (allUsersInfo) {
      // "user"の中にusernameが存在するかを比較
      
      if (Object.values(allUsersInfo).some((user) => user.user === username)) {
        console.log(user.user);
        console.log(username);
        // ログインに成功した場合はセッションにログイン情報を保存
        req.session.isLoggedIn = true;
        req.session.username = username;
        // ログイン成功時のリダイレクト先を指定
        res.redirect('/');
      } else {
        console.log(username+":else1");
        // ユーザーがデータベースに存在しない場合
        res.render('login', { errorMessage: 'ログインに失敗しました' });
      }
    } else {
      console.log(username+":else");
      // データベースに"user"が存在しない場合
      res.render('login', { errorMessage: 'ログインに失敗しました' });
    }
  } catch (error) {
    console.log(username+":error");
    console.error('Error fetching user data:', error);
    res.render('login', { errorMessage: 'ログインに失敗しました' });
  }
});


module.exports = router;