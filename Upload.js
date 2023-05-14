const fs = require('fs');


const image1 = fs.readFileSync('./img/1.jpg');
const base64Image1 = image1.toString('base64');

const image2 = fs.readFileSync('./img/1.jpg');
const base64Image2 = image2.toString('base64');

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://realtime-chat-e1a23-default-rtdb.firebaseio.com'
});

const ref = admin.database().ref('/img');

ref.child("1").set(base64Image1)
ref.child("2").set(base64Image2)


  .then(() => {
    console.log('Image uploaded successfully');
  })
  .catch(error => {
    console.error('Image upload failed:', error);
  });