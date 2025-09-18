const customCursor = document.querySelector(".cursor");
const cursorText = customCursor.querySelector(".cursor-text");
let mouseX = -100,
    mouseY = -100;
let scale = 1,
  color = "transparent",
  opacity = 0;
// 커서 텍스트 효과
let hoverTarget = null;

// 커서 텍스트 효과 대상
const cursorTargets = document.querySelectorAll(
  ".project-list-wrap, .logo, .top-button-hover, .goProject, .projects-hover"
);

// 마우스 움직여야 커서 보이게
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  customCursor.style.opacity = 1;
});

// 커서 텍스트 효과 베이직
cursorTargets.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    scale = 2.5;
    color = "white";
    opacity = 1;
    hoverTarget = el;
  });
  el.addEventListener("mouseleave", () => {
    scale = 1;
    color = "transparent";
    opacity = 0;
    hoverTarget = null;
  });
});

gsap.ticker.add(() => {
  customCursor.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(${scale})`;
  customCursor.style.backgroundColor = color;
  cursorText.style.opacity = opacity;

  if (!hoverTarget) {
    cursorText.textContent = "";
  } else if (hoverTarget.classList.contains("logo")) {
    cursorText.textContent = "";
  } else if (hoverTarget.classList.contains("top-button-hover")) {
    cursorText.textContent = "ToTop";
  } else if (hoverTarget.classList.contains("project-list-wrap")) {
    cursorText.textContent = window.openOff ? "Open" : "";
  } else {
    cursorText.textContent = "Open";
  }
});