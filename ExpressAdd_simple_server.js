const express = require('express');
const fs = require('fs');
const ejs = require('ejs');


const app = express();
const port = 3000;

// Firebase Admin SDKの初期化
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// 画像アップロード用
const multer = require('multer');
const upload = multer();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://realtime-chat-e1a23-default-rtdb.firebaseio.com'
});





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


// instagramUtils.ejsを直接読み込んでレンダリングする関数
function renderInstagramUtilsEjs(imageData) {
  return new Promise((resolve, reject) => {
    const templatePath = './instagramUtils.ejs';
    const options = { imageData };

    ejs.renderFile(templatePath, options, (err, renderedHtml) => {
      if (err) {
        reject(err);
      } else {
        resolve(renderedHtml);
      }
    });
  });
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

// テキストボックスに入力した任意の投稿文をFirebaseに保存する
app.post('/uploadImage', upload.single('image'), (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  const bucket = admin.storage().bucket('gs://realtime-chat-e1a23.appspot.com');
  const randomId = Math.random().toString(32).substring(2);
  const fileRef = bucket.file(`posts/${randomId}.jpg`);

  const uploadTask = fileRef.save(file.buffer, {
    metadata: {
      contentType: 'image/jpeg',
    },
  });

  uploadTask
    .then(() => {
      return fileRef.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });
    })
    .then((urls) => {
      const downloadUrl = urls[0];

      const imageInfo = {
        name: req.body.postText, // テキストボックスに入力された任意の投稿文を保存
        url: downloadUrl,
      };

      // Firebase Realtime Databaseに画像情報を保存
      return admin.database().ref('/images').push(imageInfo);
    })
    .then(() => {
      res.status(200).send('Image uploaded successfully');
    })
    .catch((error) => {
      console.error('Image upload failed:', error);
      res.status(500).send('An error occurred while uploading the image.');
    });
});


app.get('/sub', (req, res) => {
  const ref = admin.database().ref('images');

  ref.once('value')
    .then((snapshot) => {
      const images = snapshot.val();

      // 画像と名前のデータを取得
      const imageData = Object.entries(images).map(([key, value]) => {
        return {
          url: value.url,
          name: value.name
        };
      });
      
      // instagramUtils.ejsを直接読み込んでレンダリングする
      renderInstagramUtilsEjs(imageData)
        .then((renderedHtml) => {
          const userDataList = '<ul id="userDataList"></ul>'; // userDataList変数を定義
          const finalHtml = subPage.replace('<div id="app">', '<div id="app">' + userDataList + renderedHtml); // プレースホルダーを実際のデータに置換
          res.send(finalHtml);
        })
        .catch((error) => {
          console.error('Failed to render instagramUtils.ejs:', error);
          res.status(500).send('Failed to render instagramUtils.ejs');
        });
    })
    .catch((error) => {
      console.error('Failed to retrieve data:', error);
      res.status(500).send('Failed to retrieve data');
    });
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
