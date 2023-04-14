"use strict";

const port = 3000;
const http = require("http");
const fs = require('fs');

const server = http.createServer((request, response) => {

  fs.readFile('index.html', 'UTF-8',
    (error, data) => {
      response.writeHead(200, {
        "Content-Type": "text/html"
      });
      response.write(data);
      response.end();
    }
  );
  /*
    const responseMessage = "<h1>Hello Node.js!</h1>";
    response.write(responseMessage);
    response.end();
    console.log(`Sent a response : ${responseMessage}`);
    */
});

server.listen(port);
console.log(`The server has started and is listening on port number: ${port}`);