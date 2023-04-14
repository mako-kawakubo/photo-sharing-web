window.addEventListener('DOMContentLoaded', function(){

	var img_element = document.createElement("img");
	img_element.src = "./img/puppies-bg-large.png";
	img_element.alt = "Bear";
	img_element.width = 200;

	var article_element = document.querySelector("article");
	article_element.appendChild(img_element);
});

'use strict';
{
document.write('<img src="./img/puppies-bg-large.png">');
}

// 新しいdiv要素を作成
var post2 = document.createElement("div");
post2.innerHTML = document.getElementById("post1").innerHTML;

// ユーザー名と投稿文を変更
post2.querySelector(".card-title").textContent = "@ユーザー2";
post2.querySelector(".card-text").textContent = "投稿文2";

// ページに追加
document.querySelector("#posts-container").appendChild(post2);