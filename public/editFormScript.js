document.addEventListener("DOMContentLoaded", () => {
  const editButtons = document.querySelectorAll(".edit-button");
  const editForm = document.querySelectorAll(".edit-form");



  editButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      editForm[index].style.display = "block";
//      const editInput = editForm[index].querySelector(".editInput");


      // 保存ボタン
      const saveEditButtons = document.querySelectorAll(".saveEditButton");

      saveEditButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          event.preventDefault();
          const editedText = button.closest(".frame").querySelector(".editInput").value;
          const imageId = button.closest(".frame").querySelector("input[name='imageId']").value;

          // サーバーにデータを送信
          fetch('sub/edit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageId, editedText }),

          })
            .then((response) => response.json())
            .then((data) => {

              if (data.message) {

                const messageElement = document.createElement('p');
                messageElement.textContent = data.message;

                formContainer = editForm[index].querySelector('.editInput');
                formContainer.insertAdjacentElement('beforebegin', messageElement);

                // 3秒後にメッセージ要素を非表示にする
                setTimeout(() => {
                  messageElement.style.display = 'none';

                  // ページをリダイレクト
                  window.location.href = '/sub/'; // サブページにリダイレクト
                }, 3000);

              } else if (data.error) {
                console.error('Error:', data.error);
              }

            })
            .catch((error) => {
              console.error('Error:', error);
            });
        });
      });

      // 閉じるボタン
      const editForms = document.querySelectorAll(".edit-form");
      editForms.forEach(form => {
        const closeButton = form.querySelector(".closeFormButton");
        closeButton.addEventListener("click", () => {
          form.style.display = "none"; // フォームを非表示にする
        });
      });;

    });
  });
});