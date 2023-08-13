async function renderPageWithImages(req, res, imageData, message, templatePath) {

    // mainページの場合はログイン情報を渡す
    if (templatePath === './views/instagramUtils_main.ejs') {
        let isLoggedIn = req.session.isLoggedIn;
        let username = req.session.username;
        if(!isLoggedIn){
             isLoggedIn = null;
             username = null;
        }

        renderInstagramUtilsEjsMain(imageData, message, templatePath, isLoggedIn, username)
          .then((renderedHtml) => {
            res.send(renderedHtml);
          })
          .catch((error) => {
            console.error('Failed to render instagramUtils.ejs:', error);
            res.status(500).send('Failed to render instagramUtils.ejs');
          });
      } else { 
        // マイページの場合
        renderInstagramUtilsEjs(imageData, message, templatePath)
          .then((renderedHtml) => {
            res.send(renderedHtml);
          })
          .catch((error) => {
            console.error('Failed to render instagramUtils.ejs:', error);
            res.status(500).send('Failed to render instagramUtils.ejs');
          });
      }
  }

  // マイページ
function renderInstagramUtilsEjs(imageData, message, templatePath) {
  return new Promise((resolve, reject) => {
    const ejs = require('ejs');
    const options = { imageData, message };

    ejs.renderFile(templatePath, options, (err, renderedHtml) => {
      if (err) {
        reject(err);
      } else {
        resolve(renderedHtml);
      }
    });
  });
}

// メインページ
function renderInstagramUtilsEjsMain(imageData, message, templatePath, isLoggedIn, username) {
    return new Promise((resolve, reject) => {
      const ejs = require('ejs');
      console.log(isLoggedIn);
      const options = { imageData, message, isLoggedIn, username};
      if (isLoggedIn && username && templatePath === './main/instagramUtils_main.ejs') {
        options.isLoggedIn = isLoggedIn;
        options.username = username;
      }
  
      ejs.renderFile(templatePath, options, (err, renderedHtml) => {
        if (err) {
          reject(err);
        } else {
          resolve(renderedHtml);
        }
      });
    });
  }

  module.exports = {
    renderPageWithImages: renderPageWithImages
};