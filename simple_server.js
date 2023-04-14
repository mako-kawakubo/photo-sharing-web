"use strict";

const port = 3000;
const http = require("http");
const fs = require('fs');
const url = require('url');
const ejs = require('ejs');


const indexPage = fs.readFileSync('./index.ejs', 'UTF-8');
const otherPage = fs.readFileSync('./other.html', 'UTF-8');
const subPage = fs.readFileSync('./sub/index.html', 'UTF-8');
const styleCss = fs.readFileSync('./css/style.css', 'UTF-8');
const server = http.createServer(RouteSetting);


server.listen(port);
console.log(`The server has started and is listening on port number: ${port}`);

function RouteSetting(req, res) {
  const url_parts = url.parse(req.url);
  switch (url_parts.pathname) {
    case '/':
      const username = 'sample_username'; // 仮のユーザー名
      const texts = [
        "",
        "素敵なシャネルのバッグです。シャネルのバッグは数十万円から百万円以上の値段で取引されており、その人気が伺える商品になっております。\nなんて素敵なんだろう。いやー素晴らしい。\nこんな素晴らしいものがこの世にあるだろうか？いやない。あるはずがない。なぜならシャネルだから。シャネルは素晴らしい。なんて素晴らしいのだろう\nそう思いませんか？",
        "すっご〜〜い！インスタグラムのパクリが作れるフレンドなんだね！",
        "そら　きれい"
      ];
      const renderedIndex = ejs.render(indexPage, { username, texts });
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(renderedIndex);
      res.end();
      break;

    case '/styleCss':
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.write(styleCss);
      res.end();
      break;

    case '/other.html':
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(otherPage);
      res.end();
      break;

    case '/sub/':
    case '/sub/index.html':
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(subPage);
      res.end();
      break;

    default:
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.write('お探しのページは見つかりません。');
      res.end();
      break;
  }
}