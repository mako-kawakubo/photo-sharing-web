/*
function renderInstagramUtilsEjs(options, templatePath) {
   return new Promise((resolve, reject) => {
    const ejs = require('ejs');

    ejs.renderFile(templatePath, options, (err, renderedHtml) => {
      if (err) {
        reject(err);
      } else {
        resolve(renderedHtml);
      }
    });
   });
   
}
*/

function renderInstagramUtilsEjs(options, templatePath, callback) {
  const ejs = require('ejs');

  ejs.renderFile(templatePath, options, (err, renderedHtml) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, renderedHtml);
    }
  });
}


async function renderPageWithImages(req, res, imageData, message, templatePath ) {
  let options = { imageData, message};
  

    options.isLoggedIn = req.session.isLoggedIn || null;
    options.username = options.isLoggedIn ? req.session.username : null;


  try {
  //  const renderedHtml = await renderInstagramUtilsEjs(options, templatePath);
  //  res.send(renderedHtml);

  renderInstagramUtilsEjs(options, templatePath, (err, renderedHtml) => {
    if (err) {
      console.error('Error:', err);
    } else {
      // renderedHtmlを使って何か処理を行う
      res.send(renderedHtml);
    }
  });
  

  } catch (error) {
    console.error('Failed to render instagramUtils.ejs:', error);
    res.status(500).send('Failed to render instagramUtils.ejs');
  }
}

module.exports = {
  renderPageWithImages: renderPageWithImages
};

