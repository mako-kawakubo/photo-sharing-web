const { renderPageWithImages } = require('../service/renderPageUtils');
// Firebase Admin SDKの初期化
const admin = require('firebase-admin');


// imagesテーブルから全データを取得する関数
async function getAllImages(templatePath, loggedInUserName) {
    const imagesRef = admin.database().ref('images');
    const imagesSnapshot = await imagesRef.once('value');
    const imagesData = imagesSnapshot.val();
    let filteredImagesData = null;

   
// ログインしている状態かつサブページ表示の場合は、ログインユーザーのみに表示を絞る
    if (loggedInUserName && templatePath == './views/instagramUtils.ejs') {
        filteredImagesData = Object.entries(imagesData).filter(([key, value]) => value.user === loggedInUserName);          
        }

        const imageData = (filteredImagesData ? filteredImagesData : Object.entries(imagesData)).map(([key, value]) => ({
            url: value.url,
            name: value.name,
            user: value.user,
            id: key
        }));
        return imageData;

}


// userInfoテーブルから指定したuserのtopimgを取得する関数
async function getUserTopImg(user) {

    // 'userinfo'ノードからデータを取得して整形する
    const userInfoRef = admin.database().ref('userinfo');
    const userInfoSnapshot = await userInfoRef.once('value');
    const userInfoData = userInfoSnapshot.val();
    const userInfoDatas = Object.entries(userInfoData).map(([key, value]) => ({
        topimg: value.topimg,
        user: value.user,
    }));

    // userInfoDatasから引数のuserに一致するデータを探す
    const matchingUserInfo = userInfoDatas.find(info => info.user === user);

    // マッチするデータがあればそのtopimgを返す
    if (matchingUserInfo) {
        return matchingUserInfo.topimg || null;
    } else {
        return null; // マッチするデータがない場合はnullを返す
    }
}



// imagesテーブルの全データを取得して表示する関数
async function displayImagesWithTopImg(req, res, templatePath) {
    try {

        const loggedInUserName = req.session.username; // ログインユーザーの情報を取得
        const imagesData = await getAllImages(templatePath ,loggedInUserName);
        const imagesWithTopImg = [];

        //for (const imageData of Object.values(imagesData)) {
            for (const imageData of imagesData) {
            const { user } = imageData;
            const topimg = await getUserTopImg(user);
            imagesWithTopImg.push({ ...imageData, topimg });
        }

        // renderPageWithImages()関数を呼び出す
        renderPageWithImages(
            req,
            res,
            imagesWithTopImg, // imageData を imagesWithTopImg に置き換え
            req.session.uploadMessage, // message はそのまま使用
            templatePath           
        );

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
}

module.exports = displayImagesWithTopImg;
