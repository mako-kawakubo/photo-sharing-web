const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://realtime-chat-e1a23-default-rtdb.firebaseio.com'
});

// Firebase Realtime Databaseの参照
const db = admin.database();
const postsRef = db.ref('posts');

// データの更新関数
function updateData(key, createdAt, updatedAt) {
    // データの取得
    const postRef = postsRef.child(key);
    postRef.once('value', (snapshot) => {
      const postData = snapshot.val();
  
      // createdAtとupdatedAtの追加
      postData.createdAt = createdAt;
      postData.updatedAt = updatedAt;
  
      // データの更新
      postRef.set(postData)
        .then(() => {
          console.log('データの更新に成功しました');
        })
        .catch((error) => {
          console.error('データの更新に失敗しました:', error);
        });
    });
  }
  
  // 現在の日付と時刻の取得
  const now = new Date();
  
  // 今日の日付
  const today = now.getTime();
  
  // 昨日の日付
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayTimestamp = yesterday.getTime();
  
  // 一昨日の日付
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(now.getDate() - 2);
  const twoDaysAgoTimestamp = twoDaysAgo.getTime();
  
  // データの更新
  updateData("-NVC2n0pNNeSwCtew-_-", today, today);
  updateData("-NVC2n0sqo9wYgKohb4r", yesterdayTimestamp, yesterdayTimestamp);
  updateData("-NVC2n0teUFoOZe2r_D0", twoDaysAgoTimestamp, twoDaysAgoTimestamp);
  