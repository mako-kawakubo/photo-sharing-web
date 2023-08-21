
// 「新規登録」ページへ遷移
const showSignupFormButton = document.getElementById("showSignupForm");

if (showSignupFormButton) {
showSignupFormButton.addEventListener("click", function () {
    window.location.href = "/other/Regist"; // 指定のURLにリダイレクト
});
}

// 「ログイン」ページへ遷移
const showSigninFormButton =  document.getElementById("showSignInForm");;
if (showSigninFormButton) {
showSigninFormButton.addEventListener("click", function () {
    window.location.href = "/other/";
});
}