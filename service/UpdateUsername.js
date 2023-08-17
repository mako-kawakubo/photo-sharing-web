// const username = req.body.username;

// データベース参照
const admin = require('firebase-admin');
const db = admin.database();
const userInfoRef = db.ref('userinfo');

const UpdateUsername = async (req,res,username) => {

// userinfoテーブルの更新
const snapshot = await userInfoRef.once('value');
const userInfoData = snapshot.val();
    
const userInfos = Object.entries(userInfoData).map(([key, value]) => ({
  key: key,
  topimg: value.topimg,
  user: value.user,
}));

// 同じユーザー名が存在するかチェック
const existingUser = userInfos.find(info => info.user === username);
if (existingUser) {
  res.json({ message: '同じユーザー名が既に存在します' });
  return;
}

// ログイン中のユーザー名
const loggedInUsername = req.session.username;

// ログイン中のユーザー名に一致するキーを取得（userInfoData テーブルの更新）
let loggedInUserKey = null;
let userFound = false;

for (const [key, value] of Object.entries(userInfoData)) {
  if (value.user === loggedInUsername) {
    loggedInUserKey = key;
    await userInfoRef.child(loggedInUserKey).update({ user: username });
    userFound = true;
    break;
  }
}

if (!userFound) {
  res.json({ message: '該当するユーザーが見つかりませんでした' });
  return;
}

// images テーブルの更新処理
const imagesRef = admin.database().ref('images');
const imagesnapshot = await imagesRef.once('value');

imagesnapshot.forEach((childSnapshot) => {
  const childData = childSnapshot.val();
  if (childData.user === loggedInUsername) {
    const childKey = childSnapshot.key;
    const newChildData = { ...childData, user: username }; // ユーザー名を更新した新しいデータ
    imagesRef.child(childKey).update(newChildData);
  }
});
res.json({ message: 'ユーザー名が更新されました' });
};



module.exports = {
UpdateUsername
};