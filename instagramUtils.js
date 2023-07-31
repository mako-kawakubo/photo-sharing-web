// インスタ風の投稿画面を構築する関数
// instagramUtils.js
const ejs = require('ejs');
const fs = require('fs');

function buildInstagramLikePage(imageData) {
    const instagramUtilsTemplate = fs.readFileSync('./instagramUtils.ejs', 'utf-8');
    return ejs.render(instagramUtilsTemplate, { imageData });
  }
  
  // buildInstagramLikePage関数を他のファイルでも使用できるようにエクスポート
  module.exports = buildInstagramLikePage;
  