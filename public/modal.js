document.addEventListener('DOMContentLoaded', () => {
  const openModalButton = document.getElementById('openModalButton');
  const modal = document.getElementById('modal');
  const closeModalButton = document.getElementById('closeModalButton');
  const saveButton = document.getElementById('saveButton');
  const inputForm = document.getElementById('inputForm');

  const formData = new FormData(); // FormDataを作成

  // モーダルを開く
  openModalButton.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  // モーダルを閉じる
  closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // 保存ボタンが押されたときの処理
  // TODO: ユーザー変更とプロフィール写真変更のボタンを分ける
  saveButton.addEventListener('click', () => {

    // ユーザー名が入力されていれば、変更後のユーザー名をサーバー側に送る
    const username = inputForm.username.value;
    
    if (username) formData.append('username', username);

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

          // 「再度ログインしてください」の文字列でログインページへのリンク追加
          if (data.message === 'データが正常に更新されました') {
            const loginLink = document.createElement('a');
            loginLink.href = '/other/'; // ログインページのURLを設定
            loginLink.textContent = '再度ログインしてください';
            messageArea.appendChild(loginLink); // リンクを表示エリアに追加
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

    // プロフィール画像変更の処理

        // プロフィール画像が選択されていれば画像もサーバー側に送る
        const profileImageInput = document.getElementById('profileImage');  // プロフィール画像のファイルオブジェクトを取得
        const  profileImageFile  = profileImageInput.files[0];
        if (profileImageFile) formData.append('profileImage', profileImageFile);

        fetch('sub/updateProfileImage', {
          method: 'POST',
          body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
          messageArea.textContent = data.message; // メッセージを表示エリアにセット
          // プロフィール画像フォームをリセット
          profileImageInput.value = '';
        })
        .catch((error) => {
          console.error('Error:', error);
        });

  });
});
