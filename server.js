const express = require('express');
const app = express();
const port = 3000;

// メインページ
const indexRouter = require('./routes/index');
app.use('/', indexRouter); // / へのルート

// otherページ
const indexOtherRouter = require('./routes/index_other');
app.use('/other.html', indexOtherRouter);

// subページ
const subRouter = require('./routes/subRouter'); 
// /sub ページに関するルーティングはsubRouter.jsを使うように設定
app.use('/sub/', subRouter); 
// アップロード処理
app.post('/uploadImage', subRouter); 


// 他のルートの登録...

app.use((req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(404).send('お探しのページは見つかりません。');
});

app.listen(port, () => {
  console.log(`The server has started and is listening on port number: ${port}`);
});
