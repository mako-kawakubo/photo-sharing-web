// サブページの処理：subRouter.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');
const admin = require('firebase-admin');
const { bucketURL } = require('../firebase/firebase_insta'); // firebase.jsからbucketURLをインポート
const fetchDataAndRenderPageModule = require('../service/fetchDataAndRenderPage');
const fetchDataAndRenderPage = fetchDataAndRenderPageModule; // オブジェクトのメソッドとして使用するための代入



const multer = require('multer');
const upload = multer();


// 静的なCSSファイルを提供するためのルート
router.use('/sub', express.static('css'));
// publicへのアクセス
router.use(express.static('public')); 



// テキストボックスに入力した任意の投稿文をFirebaseに保存する
router.post('/sub/uploadImage', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      req.session.uploadMessage = 'ファイルが選択されていません';
      res.redirect('/sub/'); // エラーメッセージをセッションに保存してサブページにリダイレクト
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
      user: req.session.username
    };

    const imagesRef = admin.database().ref('/images');
    const snapshot = await imagesRef.once('value');

    if (!snapshot.exists()) {
      await imagesRef.set(true);
    }

    await imagesRef.push(imageInfo);

    req.session.uploadMessage = '投稿が完了しました'; // 成功メッセージをセッションに保存
    res.redirect('/sub/'); // サブページにリダイレクト
  } catch (error) {
    console.error('Image upload failed:', error);
    req.session.uploadMessage = 'エラーが発生しました'; // エラーメッセージをセッションに保存
    res.redirect('/sub/'); // サブページにリダイレクト
  }
});


// /sub ページのルート
/*
router.get('/', (req, res) => {
  
    const ref = admin.database().ref('images');
    
    ref.once('value')
      .then((snapshot) => {
        const imagesData = snapshot.val();

        const loggedInUserName = req.session.username;
        let filteredImagesData = imagesData;
  
        if (loggedInUserName) {
          // ログインしている場合、ログインユーザー名に一致する投稿のみをフィルタリング
          filteredImagesData = Object.entries(imagesData).filter(([key, value]) => value.user === loggedInUserName);
          console.log(filteredImagesData);
        } else {
          // ログインしていない場合は他のページにリダイレクト
          res.redirect('/other/');
          return;
        }
        const message = req.session.uploadMessage; 
        delete req.session.uploadMessage; 

        renderPageWithImages(req, res, filteredImagesData, message, './views/instagramUtils.ejs');
  });
  
});
*/

router.get('/', async (req, res) => {
  try {

    // ログインしていなければログインページへ
    const loggedInUserName = req.session.username;
    if (!loggedInUserName) {      
      res.redirect('/other/');
      return;
    }

    await fetchDataAndRenderPage(req, res,  './views/instagramUtils.ejs');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
});



  // 投稿の編集処理
  router.use(express.json());
  router.post('/sub/edit', (req, res) => {
  
  const imageId = req.body.imageId;
    const editedText = req.body.editedText;

    // データベース参照
    const db = admin.database();
    const imagesRef = db.ref('images');
  
    // 特定の投稿を更新
    const imageRef = imagesRef.child(imageId);
    imageRef.update({ name: editedText })
      .then(() => {
        console.log('Data updated successfully');
        res.json({ message: 'データが正常に更新されました' }); 
      })
      .catch((error) => {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'データの更新に失敗しました' });
      });
  });

  // 投稿の削除処理
router.post('/sub/delete', (req, res) => {
  const postId = req.body.postId; // クライアントから送られてきた投稿のID

  if (!postId) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  // データベース参照
  const db = admin.database();
  const imagesRef = db.ref('images');

  // 特定の投稿を削除
  const imageRef = imagesRef.child(postId);
  imageRef.remove()
    .then(() => {
      console.log('Post deleted successfully');
      res.json({ message: '投稿が削除されました' });
    })
    .catch((error) => {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: '投稿の削除に失敗しました' });
    });
});

  

module.exports = router;
