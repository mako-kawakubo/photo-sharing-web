const admin = require('firebase-admin');
const { bucketURL } = require('../firebase/firebase_insta'); // firebase.jsからbucketURLをインポート

const uploadImage = async (fileBuffer, postText, username) => {    
        const bucket = admin.storage().bucket(bucketURL);
        const randomId = Math.random().toString(32).substring(2);
        const fileRef = bucket.file(`posts/${randomId}.jpg`);
      
        const uploadTask = fileRef.save(fileBuffer, {
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
          name: postText,
          url: downloadUrl,
          user: username,
        };
      
        const imagesRef = admin.database().ref('/images');
        const snapshot = await imagesRef.once('value');
      
        if (!snapshot.exists()) {
          await imagesRef.set(true);
        }
      
        await imagesRef.push(imageInfo);       
};

module.exports = {
  uploadImage,
};
