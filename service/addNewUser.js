// 新しいユーザーを追加する関数
async function addNewUser(username) {

   

    try {
      const admin = require('firebase-admin');
      const db = admin.database();
      const userinfoRef = db.ref('userinfo');
  
      // 新しいユーザー情報を生成
      const newUser = {
        user: username
      };
  
      // userinfoテーブルに新しいユーザーを追加
      const newUserRef = userinfoRef.push();
      await newUserRef.set(newUser);
  
      console.log('New user added successfully!');
    } catch (error) {
      console.error('Error adding new user:', error);
    }
  }

  module.exports = {
    addNewUser:addNewUser
  };