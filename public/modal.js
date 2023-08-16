document.addEventListener('DOMContentLoaded', () => {
  const openModalButton = document.getElementById('openModalButton');
  const modal = document.getElementById('modal');
  const closeModalButton = document.getElementById('closeModalButton');
  const saveButton = document.getElementById('saveButton');
  const inputForm = document.getElementById('inputForm');

  // モーダルを開く
  openModalButton.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  // モーダルを閉じる
  closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // 保存ボタンが押されたときの処理
  saveButton.addEventListener('click', () => {
    const username = inputForm.username.value;
    // const email = inputForm.email.value;
   // const profileImage = profileImageInput.files[0];
    const formData = new FormData(); // FormDataを作成

    if (username) formData.append('username', username);
   // if (email) formData.append('email', email);
   // if (profileImage) formData.append('profileImage', profileImage);


    // ユーザー名変更の処理
    if (username) {
      fetch('sub/renameModal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username /* email */ }),

      })
        .then((response) => response.json())
        .then((data) => {
          messageArea.textContent = data.message; // メッセージを表示エリアにセット
          // テキストボックスの内容をクリア
          inputForm.username.value = '';
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

      // プロフィール画像変更の処理
      /*
  if (profileImage) {
    fetch('sub/updateProfileImage', {
      method: 'POST',
      body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
      // プロフィール画像変更処理の結果を表示
      console.log(data.message);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  */

  });
});
