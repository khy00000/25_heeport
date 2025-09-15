// 반응형 로딩 로고
const loadingLogo = document.querySelector(".loading-logo");

// 인트로 로고 수정
const introLogo = document.querySelector(".intro .intro-row1 .logo");

// 측면 텍스트 정중앙으로 옮김
const lateral1Text = document.querySelector(".lateral1 div");

const isMobile = window.innerWidth <= 768;
const isPortrait = window.matchMedia("(orientation: portrait)").matches;

if (isMobile && isPortrait) {
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