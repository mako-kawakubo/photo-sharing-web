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

// ログイン中のユーザー名とそのキー情報
const loggedInUsername = req.session.username; // プロフィール画像と共に名前も変更した場合は変更前の情報
const loggedInUserKey = req.session.loggedInUserKey; // キー情報は変更なし

// ログイン中のユーザー名に一致するキーを取得（userInfoData テーブルの更新）
//let loggedInUserKey = null;
let userFound = false;

for (const [key,_] of Object.entries(userInfoData)) {
  if (key === loggedInUserKey) {
    await userInfoRef.child(loggedInUserKey).update({ topimg: downloadUrl });
    userFound = true;
    break;
  }
}

if (!userFound) {
  res.json({ message: 'プロフィール画像の更新に失敗しました' });
  return;
}

res.json({ message: 'プロフィール画像が更新されました' });
};

module.exports = {
  UpdateProfileImage,
};

