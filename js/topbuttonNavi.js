// 인트로 탑 로고 마우스엔터 효과
const logo = document.querySelector(".logo");
const letters = document.querySelectorAll(".hover-k, .hover-m");
let hoverCount = 0;

logo.addEventListener("mouseenter", () => {
  hoverCount++;

  const isOdd = hoverCount % 2 === 1;

  const mTransform = isOdd ? `translateX(-25px)` : `translateX(25px)`;
  const kTransform = isOdd ? `translateX(25px)` : `translateX(-25px)`;

  letters.forEach((el) => el.classList.add("moving"));

  letters.forEach((el) => {
    if (el.classList.contains("hover-m")) {
      el.style.transform = mTransform;
    } else {
      el.style.transform = kTransform;
    }
  });

  setTimeout(() => {
    letters.forEach((el) => {
      el.style.transform = "translateX(0px)";
    });
  }, 300);

  setTimeout(() => {
    letters.forEach((el) => el.classList.remove("moving"));
  }, 600);
});

// 탑버튼, 내비 활성
const topButton = document.querySelector(".top-button");
const navi = document.querySelector(".navi");
const footerOpen = document.querySelector(".footer");
const projectsSection = document.querySelector(".projects");

window.addEventListener("scroll", () => {
  // footer 요소의 Viewport 안에서의 위치 정보
  const footerTop = footerOpen.getBoundingClientRect().top;
  const projectsTop = projectsSection.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;

  if (footerTop <= windowHeight) {
    topButton.classList.add("show");
  } else {
    topButton.classList.remove("show");
  }

  if (projectsTop <= windowHeight) {
    navi.classList.add("hide");
  } else {
    navi.classList.remove("hide");
  }
});

topButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});