const fs = require('fs');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://realtime-chat-e1a23-default-rtdb.firebaseio.com'
  });
const ref = admin.database().ref('/img');

// 画像データのアップロード
function uploadImage(imagePath, imageName) {
  const image = fs.readFileSync(imagePath);
  const base64Image = image.toString('base64');
  
  return ref.child(imageName).set(base64Image);
}

// アップロードする画像データの情報
const images = [
  { path: './img/3.jpg', name: '3' },
  { path: './img/2.jpg', name: '2' },
  // さらに追加の画像データをここに追記
];

// 画像データの一括アップロード
Promise.all(
  images.map((imageInfo) => uploadImage(imageInfo.path, imageInfo.name))
)
  .then(() => {
    console.log('Images uploaded successfully');
  })
  .catch((error) => {
    console.error('Image upload failed:', error);
  });
