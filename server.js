const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');

app.set('view engine', 'ejs'); // EJSをビューエンジンとして設定

// Firebase Admin SDKの初期化
require('./firebase/firebase_insta.js');

// メインページ
const indexRouter = require('./routes/index');
app.use('/', indexRouter); // / へのルート

// otherページ
const indexOtherRouter = require('./routes/index_other');
app.use('/other/', indexOtherRouter);

// subページ
const subRouter = require('./routes/subRouter'); 
// /sub ページに関するルーティングはsubRouter.jsを使うように設定
app.use('/sub/', subRouter); 
app.use('/sub/edit', subRouter);

// 他のルートの登録...

app.use((req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(404).send('お探しのページは見つかりません。');
});

app.listen(port, () => {
  console.log(`The server has started and is listening on port number: ${port}`);
});
