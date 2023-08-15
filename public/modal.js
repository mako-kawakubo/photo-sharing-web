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
      const email = inputForm.email.value;
      // サーバーにデータを送信する処理
      fetch('sub/renameModal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email }),

      })
      .then((response) => response.json())
      .then((data) => {
        messageArea.textContent = data.message; // メッセージを表示エリアにセット
        // TODO: このあとに入力内容を消す
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  
      // モーダルを閉じる
      // TODO; 勝手に閉じないように変更→閉じるボタン付ける
      // modal.style.display = 'none';
    });
  });
  