document.addEventListener("DOMContentLoaded", () => {
  const openModalButton = document.getElementById("openModalButton");
  const modal = document.getElementById("modal");
  const closeModalButton = document.getElementById("closeModalButton");
  const saveButton = document.getElementById("saveButton");
  const inputForm = document.getElementById("inputForm");

  const formData = new FormData(); // FormDataを作成

  // モーダルを開く
  openModalButton.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // モーダルを閉じる
  closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // 保存ボタンが押されたときの処理
  // TODO: sub/updateProfileImageからのレスポンスとsub/renameModalからのレスポンスを分ける
  /*
  saveButton.addEventListener("click", () => {
    // ユーザー名が入力されていれば、変更後のユーザー名をサーバー側に送る
    const username = inputForm.username.value;

    // 入力されている場合のみリクエスト送信
    if (username) formData.append("username", username);

    let flg = false;

    // ユーザー名変更の処理
    //let renameModalPromise = Promise.resolve(); // プロミスの初期化

    if (username) {
      //renameModalPromise =
      fetch("sub/renameModal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      })
        .then((response) => response.json())
        .then((data) => {
          messageArea1.textContent = data.message; // メッセージを表示エリアにセット
          // テキストボックスの内容をクリア
          inputForm.username.value = "";

          // 「再度ログインしてください」の文字列でログインページへのリンク追加
          if (data.message === "ユーザー名が更新されました") {
            const loginLink = document.createElement("a");
            loginLink.href = "/other/"; // ログインページのURLを設定
            loginLink.textContent = "再度ログインしてください";
            messageArea1.appendChild(loginLink); // リンクを表示エリアに追加
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    // プロフィール画像変更の処理

    // プロフィール画像が選択されていれば画像もサーバー側に送る

    const profileImageInput = document.getElementById("profileImage"); // プロフィール画像のファイルオブジェクトを取得
    const profileImageFile = profileImageInput.files[0];
    if (profileImageFile) formData.append("profileImage", profileImageFile);

    if (profileImageFile){
    // プロフィール画像変更のリクエストを送信
    //const updateProfileImagePromise =
    fetch("sub/updateProfileImage", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        messageArea2.textContent = data.message; // メッセージを表示エリアにセット
        // プロフィール画像フォームをリセット
        profileImageInput.value = "";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }

    //Promise.all([renameModalPromise, updateProfileImagePromise])
  });
*/

  // 保存ボタンが押されたときの処理

  saveButton.addEventListener("click", () => {
    const username = inputForm.username.value;
    if (username) formData.append("username", username);

    const profileImageInput = document.getElementById("profileImage");
    const profileImageFile = profileImageInput.files[0];
    if (profileImageFile) formData.append("profileImage", profileImageFile);

    const updateProfileImagePromise = profileImageFile
      ? fetch("sub/updateProfileImage", {
          method: "POST",
          body: formData,
        }).then((response) => response.json())
      : Promise.resolve(); // プロフィール画像がない場合は即座に完了するPromise

    const renameModalPromise = username
      ? fetch("sub/renameModal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }).then((response) => response.json())
      : Promise.resolve(); // ユーザー名がない場合は即座に完了するPromise

    Promise.all([renameModalPromise, updateProfileImagePromise])
      .then((results) => {
        const renameModalResult = results[0];
        const updateProfileImageResult = results[1];

        if (renameModalResult) {
          messageArea1.textContent = renameModalResult.message;
          if (renameModalResult.message === "ユーザー名が更新されました") {
            const loginLink = document.createElement("a");
            loginLink.href = "/other/";
            loginLink.textContent = "再度ログインしてください";
            messageArea1.appendChild(loginLink);
          }
        }

        if (updateProfileImageResult) {
          messageArea2.textContent = updateProfileImageResult.message;
          profileImageInput.value = "";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
