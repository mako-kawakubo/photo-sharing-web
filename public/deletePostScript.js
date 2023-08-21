document.addEventListener("DOMContentLoaded", () => {
    const deleteButtons = document.querySelectorAll(".delete-button");

    deleteButtons.forEach(button => {
        button.addEventListener("click", async (event) => {
            event.preventDefault();
            const postId = button.getAttribute("data-post-id");
            if (!postId) {
                console.error("Invalid post ID");
                return;
            }

            try {
                // サーバーにデータを送信
                const response = await fetch('sub/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ postId }), // データをJSON形式で送信
                });

                const data = await response.json();

                if (data.message) {

                    // メッセージを表示
                    const messageElement = document.createElement('p');
                    messageElement.textContent = data.message;
                    // メッセージ要素をbutton-containerの上に挿入
                    const buttonContainer = button.closest('.button-container');
                    buttonContainer.insertAdjacentElement('beforebegin', messageElement);

                    // 3秒後にメッセージ要素を非表示にする
                    setTimeout(() => {
                        messageElement.style.display = 'none';

                        // ページをリダイレクト
                        window.location.href = '/sub/'; // サブページにリダイレクト
                    }, 3000);

                    // 削除成功時の処理
                } else if (data.error) {
                    console.error('Error:', data.error);
                    // エラー時の処理
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
});
