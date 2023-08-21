document.addEventListener("DOMContentLoaded", () => {
  const openModalButton = document.getElementById("openModalButton");
  const modal = document.getElementById("modal");
  const closeModalButton = document.getElementById("closeModalButton");
  const closeButton = document.querySelector(".close-button");
  const saveButton = document.getElementById("saveButton");
  const inputForm = document.getElementById("inputForm");

  const formData = new FormData(); // FormDataを作成

  // モーダルを開く
  openModalButton.addEventListener("click", () => {
    modal.style.display = "block";
  });


  // モーダルを閉じる
  const closeModal = () => {
    modal.style.display = "none";
  };

  // 閉じるボタンをクリックしたときの処理
  closeButton.addEventListener("click", closeModal);

  // 閉じるボタンをクリックしたときの処理（もう一つの場所で使用）
  closeModalButton.addEventListener("click", closeModal);

  // プロフィール画像変更
  function previewImage(input) {
    if (input.files && input.files[0]) {
      var fileReader = new FileReader();
      fileReader.onload = function () {
        document.getElementById("preview").src = fileReader.result;
      };
      fileReader.readAsDataURL(input.files[0]);
    }
  }

    const profileImageInput = document.getElementById("profileImage");
    profileImageInput.addEventListener("change", () => {
      previewImage(profileImageInput);
    });
  

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
