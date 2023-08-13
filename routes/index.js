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

// 静的なCSSファイルを提供するためのルート
router.use('/main', express.static('css'));
// publicへのアクセス
router.use(express.static('public')); 

// router.get('/', (req, res) => {
 // router.get('/', async (req, res) => {
  /*
  fetchDataAndRenderPage(req, res)


  // 'userinfo'ノードからデータを取得して整形する
const userInfoRef = admin.database().ref('userinfo');
return userInfoRef.once('value')
  .then((userInfoSnapshot) => {
    const userInfoData = userInfoSnapshot.val();
    console.log(userInfoData);
    console.log(Object.entries(userInfoData));
    const userInfoDatas = Object.entries(userInfoData).map(([key, value]) => ({
      topimg: value.topimg,
      user: value.user,
    }));
    console.log("確認0");
    console.log(userInfoDatas);
    return userInfoDatas;
  })
  .then((userInfoDatas) => {
    // ここからimagesの取得処理・画像データを取得して整形する
    const imagesRef = admin.database().ref('images');
    return imagesRef.once('value')
      .then((imagesSnapshot) => {
        const imagesData = imagesSnapshot.val();
        const message = req.session.uploadMessage; 
        delete req.session.uploadMessage;

        console.log("imagesData確認");
        console.log(imagesData);
        // renderPageWithImages()関数を呼び出す際に、userInfoDataも渡す
        renderPageWithImages(req, res, Object.entries(imagesData), message, './views/instagramUtils_main.ejs',userInfoDatas);
        console.log(Object.entries(imagesData));

      });
  })
  .catch((error) => {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  });
*/


/*
async function fetchDataAndRenderPage(req, res) {
  try {
    // 'userinfo'ノードからデータを取得して整形する
    const userInfoRef = admin.database().ref('userinfo');
    const userInfoSnapshot = await userInfoRef.once('value');
    const userInfoData = userInfoSnapshot.val();
    const userInfoDatas = Object.entries(userInfoData).map(([key, value]) => ({
      topimg: value.topimg,
      user: value.user,
    }));

    console.log("確認0");
    console.log(userInfoDatas);

    // 'images'ノードからデータを取得して整形する
    const imagesRef = admin.database().ref('images');
    const imagesSnapshot = await imagesRef.once('value');
    const imagesData = imagesSnapshot.val();
    const message = req.session.uploadMessage;
    delete req.session.uploadMessage;

    console.log("imagesData確認");
    console.log(imagesData);

    // renderPageWithImages()関数を呼び出す際に、userInfoDataも渡す
    renderPageWithImages(
      req,
      res,
      Object.entries(imagesData),
      message,
      './views/instagramUtils_main.ejs',
      userInfoDatas
    );

    console.log(Object.entries(imagesData));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
}
*/

const fetchDataAndRenderPageModule = require('../service/fetchDataAndRenderPage');
const fetchDataAndRenderPage = fetchDataAndRenderPageModule; // オブジェクトのメソッドとして使用するための代入

router.get('/', async (req, res) => {
  await fetchDataAndRenderPage(req, res ,'./views/instagramUtils_main.ejs'); // fetchDataAndRenderPageを呼び出し
});

module.exports = router;



//});



// /logout へのルート
router.get('/logout', (req, res) => {
  req.session.isLoggedIn = false; // ログアウト状態をセッションに設定

  // ログアウト成功後のリダイレクト先を指定
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
