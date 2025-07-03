// 반응형 로딩 로고
const loadingLogo = document.querySelector(".loading-logo");

// 인트로 로고 수정
const introLogo = document.querySelector(".intro .intro-row1 .logo");

// 측면 텍스트 정중앙으로 옮김
const lateral1Text = document.querySelector(".lateral1 div");

if (window.innerWidth <= 768) {
  loadingLogo.innerHTML = "Heeyon<br>Kim";
  introLogo.innerHTML = "Heeyon Kim";
  lateral1Text.innerHTML =
    "Welcome to © Interactive 3D Portfolio © Welcome to © Interactive 3D Portfolio";
  document.querySelector(".split1").innerHTML =
    "I Create Interactive,<br>Creative Web Experiences";
  document.querySelector(".split2").innerHTML =
    "Tailored<br>To Our Brand Identity.";
  document.querySelector(".split3").innerHTML =
    "I Pay Close Attention<br>to Detail";
  document.querySelector(".split4").innerHTML =
    "And Communicate Clearly<br>to Deliver the Best Results.";
}

window.addEventListener("load", () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 10); // layout이 안정된 뒤 위치 이동
});

// 리사이즈 후 300ms 동안 멈추면 새로고침 이부분이랑 로딩 페이지 다시 돌려놓기
// let resizeTimer;

// window.addEventListener("resize", () => {
//   clearTimeout(resizeTimer);
//   resizeTimer = setTimeout(() => {
//     location.reload();
//   }, 300);
// });