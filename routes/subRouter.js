// サブページの処理：subRouter.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');
const admin = require('firebase-admin');
// TODO: テストコード const { bucketURL } = require('../firebase/firebase'); // firebase.jsからbucketURLをインポート
const { bucketURL } = require('../firebase/firebase_insta'); // firebase.jsからbucketURLをインポート


const multer = require('multer');
const upload = multer();


  // CSSの読み込み
  const substyleCss = fs.readFileSync('./css/substyle.css', 'UTF-8');
  // /styleCss へのルート
  router.get('/sub/substyleCss', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/css' }); // コンテンツタイプを設定
    res.write(substyleCss); // CSSファイルを送信
    res.end();
    });



// テキストボックスに入力した任意の投稿文をFirebaseに保存する
router.post('/uploadImage', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      req.session.uploadMessage = 'ファイルが選択されていません';
      res.redirect('/sub'); // エラーメッセージをセッションに保存してサブページにリダイレクト
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

    await uploadTask;

    const urls = await fileRef.getSignedUrl({
      action: 'read',
      expires: '03-01-2500',
    });

    const downloadUrl = urls[0];

    const imageInfo = {
      name: req.body.postText,
      url: downloadUrl,
    };

    const imagesRef = admin.database().ref('/images');
    const snapshot = await imagesRef.once('value');

    if (!snapshot.exists()) {
      await imagesRef.set(true);
    }

    await imagesRef.push(imageInfo);

    req.session.uploadMessage = '投稿が完了しました'; // 成功メッセージをセッションに保存
    res.redirect('/sub'); // サブページにリダイレクト
  } catch (error) {
    console.error('Image upload failed:', error);
    req.session.uploadMessage = 'エラーが発生しました'; // エラーメッセージをセッションに保存
    res.redirect('/sub'); // サブページにリダイレクト
  }
});



// /sub ページのルート
router.get('/', (req, res) => {
  const imageDir = './img'; // 画像が格納されているディレクトリのパス

  // 画像ファイルの一覧を取得
  fs.readdir(imageDir, (err, files) => {
    if (err) {
      console.error('Failed to read image directory:', err);
      res.status(500).send('Failed to read image directory');
      return;
    }

    // 画像ファイルの一覧を元に imageData を作成
    
    const imageData = files.map((file, index) => {


      const filePath = `./img/${file}`;
      // ファイルを非同期的に読み込む
      const data = fs.readFileSync(filePath);
      // バイナリデータをbase64エンコード
      const image = data.toString('base64');
      
      // 画像情報を返す
      return {
        url: `data:image/jpeg;base64,${image}`, // 画像ファイルのbase64エンコードされたデータをURLとして指定
        name: `画像${index + 1}`, // 画像の名前（例：画像1, 画像2, ...）
      };

    });
    

    

    const message = req.session.uploadMessage; // セッションからメッセージを取得
    delete req.session.uploadMessage; // セッションからメッセージを削除

    // instagramUtils.ejsを直接読み込んでレンダリングする
    renderInstagramUtilsEjs(imageData, message)
      .then((renderedHtml) => {
        res.send(renderedHtml);
      })
      .catch((error) => {
        console.error('Failed to render instagramUtils.ejs:', error);
        res.status(500).send('Failed to render instagramUtils.ejs');
      });
  });
});

// instagramUtils.ejsを直接読み込んでレンダリングする関数
function renderInstagramUtilsEjs(imageData, message) {
    return new Promise((resolve, reject) => {
      const templatePath = './sub/instagramUtils.ejs';
      const options = { imageData, message };
  
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
