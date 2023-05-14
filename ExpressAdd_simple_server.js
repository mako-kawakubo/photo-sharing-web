const express = require('express');
const fs = require('fs');
const ejs = require('ejs');

// Firebase Admin SDKの初期化
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://realtime-chat-e1a23-default-rtdb.firebaseio.com'
});


const app = express();
const port = 3000;


const otherPage = fs.readFileSync('./other.html', 'UTF-8');
const subPage = fs.readFileSync('./sub/index.html', 'UTF-8');
const styleCss = fs.readFileSync('./css/style.css', 'UTF-8');

const username = ["", "sample_username1", "sample_username2", "sample_username3"];
const texts = [
  "",
  "素敵なシャネルのバッグです。シャネルのバッグは数十万円から百万円以上の値段で取引されており、その人気が伺える商品になっております。\nなんて素敵なんだろう。いやー素晴らしい。\nこんな素晴らしいものがこの世にあるだろうか？いやない。あるはずがない。なぜならシャネルだから。シャネルは素晴らしい。なんて素晴らしいのだろう\nそう思いませんか？",
  "すっご〜〜い！インスタグラムのパクリが作れるフレンドなんだね！",
  "そら　きれい"
];

function formatDate(createdAt) {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}


app.get('/', (req, res) => {
  


  // Firebase Realtime Databaseからデータを取得する処理
  const ref = admin.database().ref('/posts');
  ref.orderByChild('createdAt').once('value', snapshot => {
    const postsData = snapshot.val();
    const sortedPosts = Object.values(postsData).sort(
      (post1, post2) => post1.createdAt - post2.createdAt
    );

    // index.ejsの読み込みとレンダリング
    const indexPage = fs.readFileSync('./index.ejs', 'utf-8');
    const renderedIndex = ejs.render(indexPage, { sortedPosts,username, texts, formatDate 
 });

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(renderedIndex);
    res.end();
  });
});

app.get('/img/:imageName', (req, res) => {

  

  const imagePath = req.params.imageName; // "/img/2.jpg"
  const imageName = imagePath.slice(0, -4); // "/img/2"

  // Firebase Realtime Databaseから画像データを取得する処理
  const ref = admin.database().ref(`/img/${imageName}`); // imagesノードへの参照パスを設定
  ref.once('value', snapshot => {
    const imageData = snapshot.val();
    if (imageData) {
      const img = Buffer.from(imageData, 'base64');
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(img);
    } else {
      res.status(404).send('Image not found');
    }
  });
});


app.get('/styleCss', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/css' });
  res.write(styleCss);
  res.end();
});

app.get('/other.html', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(otherPage);
  res.end();
});

app.get('/sub/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(subPage);
  res.end();
});

app.get('/sub/index.html', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(subPage);
  res.end();
});

app.use((req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(404).send('お探しのページは見つかりません。');
});

app.listen(port, () => {
  console.log(`The server has started and is listening on port number: ${port}`);
});
