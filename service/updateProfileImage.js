const admin = require('firebase-admin');
const db = admin.database();
const userInfoRef = db.ref('userinfo');
const { bucketURL } = require('../firebase/firebase_insta'); // firebase.jsからbucketURLをインポート

const UpdateProfileImage = async (filebuffer,req,res) => {  

  // プロフィール画像をStrageへアップロード
  const bucket = admin.storage().bucket(bucketURL);
  const randomId = Math.random().toString(32).substring(2);
  const fileRef = bucket.file(`topimg/${randomId}.jpg`);

  const uploadTask = fileRef.save(filebuffer, {
    metadata: {
      contentType: 'image/jpeg',
    },
  });

  await uploadTask;

  const urls = await fileRef.getSignedUrl({
    action: 'read',
    expires: '03-01-2500',
  });

  const downloadUrl = urls[0];  // 更新する画像URL

  // userinfoテーブルのtopimg更新
const snapshot = await userInfoRef.once('value');
const userInfoData = snapshot.val();

// ログイン中のユーザー名
const loggedInUsername = req.session.username;

// ログイン中のユーザー名に一致するキーを取得（userInfoData テーブルの更新）
let loggedInUserKey = null;
let userFound = false;

for (const [key, value] of Object.entries(userInfoData)) {
  if (value.user === loggedInUsername) {
    loggedInUserKey = key;
    await userInfoRef.child(loggedInUserKey).update({ topimg: downloadUrl });
    userFound = true;
    break;
  }
}

if (!userFound) {
  res.json({ message: '該当するユーザーが見つかりませんでした' });
  return;
}

res.json({ message: 'データが正常に更新されました' });
};

module.exports = {
  UpdateProfileImage,
};

