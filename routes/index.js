const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const router = express.Router(); // ルータを定義


// Firebase Admin SDKの初期化
const admin = require('firebase-admin');
  
// CSSの読み込み
const styleCss = fs.readFileSync('./css/style.css', 'UTF-8');

// / へのルート
router.get('/', (req, res) => {
  // Firebase Realtime Databaseからデータを取得する処理
  const ref = admin.database().ref('/images');
  ref.once('value', snapshot => {
    const imagesData = snapshot.val();
    // imagesDataをそのまま配列に変換
    const imagesArray = Object.values(imagesData);

    // index.ejsの読み込みとレンダリング
    const indexPage = fs.readFileSync('./main/index.ejs', 'utf-8');
    const renderedIndex = ejs.render(indexPage, { postsArray: imagesArray });

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(renderedIndex);
    res.end();
  });
});

// /styleCss へのルート
router.get('/styleCss', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/css' });
  res.write(styleCss);
  res.end();
});

module.exports = router; // ルータをエクスポート
