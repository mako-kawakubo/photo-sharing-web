const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://realtime-chat-e1a23-default-rtdb.firebaseio.com'
  });

// 投稿データ
const posts = [
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
const postsRef = db.ref('posts');

// データの追加
posts.forEach((post) => {
  const imagePath = `./img/${post.imageName}`; // 画像のパス
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
