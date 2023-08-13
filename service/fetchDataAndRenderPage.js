async function fetchDataAndRenderPage(req, res, templatePath) {
    try {

        const { renderPageWithImages } = require('../service/renderPageUtils');
        // Firebase Admin SDKの初期化
        const admin = require('firebase-admin');

        // 'userinfo'ノードからデータを取得して整形する
        const userInfoRef = admin.database().ref('userinfo');
        const userInfoSnapshot = await userInfoRef.once('value');
        const userInfoData = userInfoSnapshot.val();
        const userInfoDatas = Object.entries(userInfoData).map(([key, value]) => ({
            topimg: value.topimg,
            user: value.user,
        }));


        // 'images'ノードからデータを取得して整形する
        const imagesRef = admin.database().ref('images');
        const imagesSnapshot = await imagesRef.once('value');
        const imagesData = imagesSnapshot.val();
        const message = req.session.uploadMessage;
        delete req.session.uploadMessage;

        // ログインしている状態かつサブページ表示の場合は、ログインユーザーのみに表示を絞る
        const loggedInUserName = req.session.username;
        let filteredImagesData = null;

        if (loggedInUserName && templatePath == './views/instagramUtils.ejs') {
        filteredImagesData = Object.entries(imagesData).filter(([key, value]) => value.user === loggedInUserName);          
        }

        
        const imageData = (filteredImagesData ? filteredImagesData : Object.entries(imagesData)).map(([key, value]) => ({
            url: value.url,
            name: value.name,
            user: value.user,
            id: key
        }));
        


        // renderPageWithImages()関数を呼び出す
        renderPageWithImages(
            req,
            res,
            imageData,
            message,
            templatePath,
            userInfoDatas
        );


    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
}

module.exports = fetchDataAndRenderPage;
