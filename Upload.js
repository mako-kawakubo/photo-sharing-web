const fs = require('fs');
const image = fs.readFileSync('./img/1.jpg');
const base64Image = image.toString('base64');

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://realtime-chat-e1a23-default-rtdb.firebaseio.com'
});

const ref = admin.database().ref('/img');
ref.child("1").set(base64Image)
  .then(() => {
    console.log('Image uploaded successfully');
  })
  .catch(error => {
    console.error('Image upload failed:', error);
  });