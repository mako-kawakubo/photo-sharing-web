const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('./.env/firebase_instalike.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://instalike-17bef-default-rtdb.firebaseio.com/'
  });

// 投稿データ
const img = [
  {
    imageName: "1.jpg",
    username: "sample_username1",
    text: "投稿のテキスト"
  },
  {
    imageName: "2.jpg",
    username: "sample_username2",
    text: "投稿のテキスト"
  },
  {
    imageName: "3.jpg",
    username: "sample_username3",
    text: "投稿のテキスト"
  }
];

// Firebase Realtime Databaseの参照
const db = admin.database();
const postsRef = db.ref('img');

// データの追加
img.forEach((post) => {
  const imagePath = `./img/${post.imageName}`; // 画像のパス
    // 画像フォルダを作成
    const imgFolder = path.dirname(imagePath);
    if (!fs.existsSync(imgFolder)) {
      fs.mkdirSync(imgFolder, { recursive: true });
    }
  const image = fs.readFileSync(imagePath);
  const base64Image = image.toString('base64');

  const newPostRef = postsRef.push();
  newPostRef.set({
    ...post,
    image: base64Image // 画像データをbase64形式で保存
  })
    .then(() => {
      console.log('投稿が追加されました');
    })
    .catch((error) => {
      console.error('投稿の追加に失敗しました:', error);
    });
});
