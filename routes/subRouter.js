// サブページの処理：subRouter.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');
const admin = require('firebase-admin');
// const { bucketURL } = require('../firebase/firebase'); // firebase.jsからbucketURLをインポート
const { bucketURL } = require('../firebase/firebase_insta'); // firebase.jsからbucketURLをインポート


/*
// CSSの読み込み
const substyleCss = fs.readFileSync('./css/substyle.css', 'UTF-8');
// /styleCss へのルート
router.get('/substyleCss', (req, res) => {
    res.set('Content-Type', 'text/css'); // コンテンツタイプを設定
    res.send(substyleCss); // CSSファイルを送信
  });
*/
const multer = require('multer');
const upload = multer();

// const subPage = fs.readFileSync('./sub/index.html', 'UTF-8');

// テキストボックスに入力した任意の投稿文をFirebaseに保存する
router.post('/uploadImage', upload.single('image'), (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(400).send('No file uploaded.');
      return;
    }
  
    const bucket = admin.storage().bucket(bucketURL);
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
       const imagesRef = admin.database().ref('/images');
       imagesRef.once('value', (snapshot) => {
         if (!snapshot.exists()) {
           // /imagesノードが存在しない場合、新規作成する
           imagesRef.set(true)
             .then(() => {
               return imagesRef.push(imageInfo);
             })
             .then(() => {
               res.status(200).send('Image uploaded successfully');
             })
             .catch((error) => {
               console.error('Image upload failed:', error);
               res.status(500).send('An error occurred while uploading the image.');
             });
         } else {
           // /imagesノードが既に存在する場合
           return imagesRef.push(imageInfo)
             .then(() => {
               res.status(200).send('Image uploaded successfully');
             })
             .catch((error) => {
               console.error('Image upload failed:', error);
               res.status(500).send('An error occurred while uploading the image.');
             });
         }
       });
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
        
        /*
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
      */

            // instagramUtils.ejsを直接読み込んでレンダリングする
            renderInstagramUtilsEjs(imageData)
            .then((renderedHtml) => {
              res.send(renderedHtml);
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
