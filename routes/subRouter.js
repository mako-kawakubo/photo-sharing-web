// サブページの処理：subRouter.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');
const admin = require('firebase-admin');


const serviceAccount = require('../serviceAccountKey.json');

// 初期化するFirebaseアプリの名前を指定
const appName = 'https://realtime-chat-e1a23-default-rtdb.firebaseio.com'

// 既に同じ名前のFirebaseアプリが初期化されているか確認
const existingApp = admin.apps.find(app => app.name === appName);

if (!existingApp) {
    // 指定した名前のFirebaseアプリが初期化されていない場合のみ、initializeApp()を呼び出す
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://realtime-chat-e1a23-default-rtdb.firebaseio.com'
    }, appName);
  }
  

const multer = require('multer');
const upload = multer();

const subPage = fs.readFileSync('./sub/index.html', 'UTF-8');

// テキストボックスに入力した任意の投稿文をFirebaseに保存する
router.post('/uploadImage', upload.single('image'), (req, res) => {
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

// /sub ページのルート
router.get('/', (req, res) => {
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


// instagramUtils.ejsを直接読み込んでレンダリングする関数
function renderInstagramUtilsEjs(imageData) {
    return new Promise((resolve, reject) => {
      const templatePath = './sub/instagramUtils.ejs';
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

module.exports = router;