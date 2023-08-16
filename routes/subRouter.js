// サブページの処理：subRouter.js

const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
// TODO; 下二つ後で消す
const fetchDataAndRenderPageModule = require('../service/fetchDataAndRenderPage');
const fetchDataAndRenderPage = fetchDataAndRenderPageModule; // オブジェクトのメソッドとして使用するための代入

const { uploadImage } = require('../service/NewUploadImageUtils');
const { UpdateUsername }  = require('../service/UpdateUsername');
const { UpdateProfileImage} = require('../service/updateProfileImage');

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
await uploadImage(file.buffer, req.body.postText, req.session.username);

    req.session.uploadMessage = '投稿が完了しました'; // 成功メッセージをセッションに保存
    res.redirect('/sub/'); // サブページにリダイレクト
  } catch (error) {
    console.error('Image upload failed:', error);
    req.session.uploadMessage = 'エラーが発生しました'; // エラーメッセージをセッションに保存
    res.redirect('/sub/'); // サブページにリダイレクト
  }
});


// 初期表示
router.get('/', async (req, res) => {
  try {

    // ログインしていなければログインページへ
    const loggedInUserName = req.session.username;
    if (!loggedInUserName) {
      res.redirect('/other/');
      return;
    }

    const displayImagesWithTopImgModule = require('../service/displayImagesWithTopImg');
    const displayImagesWithTopImg = displayImagesWithTopImgModule;


    // TODO:fetchDataAndRenderPageは後で消す await fetchDataAndRenderPage(req, res,  './views/instagramUtils.ejs');
    await displayImagesWithTopImg(req, res, './views/instagramUtils.ejs');
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



// ユーザー名変更
router.use(express.json());
router.post('/sub/renameModal',  async(req, res) => {

/*データベース更新処理 */
  try {
    await UpdateUsername(req,res,req.body.username);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
  
});

// プロフィール画像の変更
router.post('/sub/updateProfileImage', upload.single('profileImage'), async (req, res) => {
  try {
    const file = req.file;
await UpdateProfileImage(file.buffer,req,res);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
});


module.exports = router;
