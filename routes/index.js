const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const router = express.Router(); // ルータを定義
const session = require('express-session'); // express-sessionをインポート


// Firebase Admin SDKの初期化
const admin = require('firebase-admin');


// セッション設定
router.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));


// ログイン状態を確認するミドルウェア
const checkLoggedIn = (req, res, next) => {
  if (req.session.isLoggedIn) {
    // もしログイン状態がセッションに保存されている場合
    // req.session.isLoggedInがtrueの場合はログイン状態を保持
    req.isLoggedIn = true;
  } else {
    // ログインしていない場合はisLoggedInをfalseにしておく
    req.isLoggedIn = false;
  }
  next();
};



// / へのルートおよび /success へのルート
router.get('/', (req, res) => {

  // Firebase Realtime Databaseからデータを取得する処理
  const ref = admin.database().ref('/images');
  ref.once('value', snapshot => {
    const imagesData = snapshot.val();
    // imagesDataをそのまま配列に変換
    const imagesArray = Object.values(imagesData);

    // index.ejsの読み込みとレンダリング
    const indexPage = fs.readFileSync('./main/index.ejs', 'utf-8');
    // TODO: 変数を複数EJSに渡す処理を簡潔にしたい
    const renderedIndex = ejs.render(indexPage, { postsArray: imagesArray, isLoggedIn: req.session.isLoggedIn,isUsername:req.session.username });
    console.log(req.session.isLoggedIn); // ログイン状態

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(renderedIndex);
    res.end();
  });
});

// /logout へのルート
router.get('/logout', (req, res) => {
  req.session.isLoggedIn = false; // ログアウト状態をセッションに設定

  // ログアウト成功後のリダイレクト先を指定（例：ログインページのルートを'/login'と仮定）
  res.redirect('/');
});

// CSSの読み込み
const styleCss = fs.readFileSync('./css/style.css', 'UTF-8');

// /styleCss へのルート
router.get('/styleCss', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/css' });
  res.write(styleCss);
  res.end();
});

module.exports = router; // ルータをエクスポート
