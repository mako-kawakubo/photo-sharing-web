const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const router = express.Router(); // ルータを定義
const session = require('express-session'); // express-sessionをインポート


// セッション設定
router.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));


// ログイン状態を確認する
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

// 静的なCSSファイルを提供するためのルート
router.use('/main', express.static('css'));
// publicへのアクセス
router.use(express.static('public')); 

const displayImagesWithTopImgModule = require('../service/displayImagesWithTopImg');
const displayImagesWithTopImg = displayImagesWithTopImgModule;

const fetchDataAndRenderPageModule = require('../service/fetchDataAndRenderPage');
const fetchDataAndRenderPage = fetchDataAndRenderPageModule; 

router.get('/', async (req, res) => {

await displayImagesWithTopImg(req, res ,'./views/instagramUtils_main.ejs');
});

module.exports = router;




// /logout へのルート
router.get('/logout', (req, res) => {
  req.session.isLoggedIn = false; // ログアウト状態をセッションに設定

  // ログアウト成功後のリダイレクト先を指定
  res.redirect('/');
});

module.exports = router; // ルータをエクスポート
