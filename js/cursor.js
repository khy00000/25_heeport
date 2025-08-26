// 마우스 커서
const cursor = document.querySelector(".cursor");
const cursorText = cursor.querySelector(".cursor-text");

let mousemoved = false;
let mouseX = 0;
let mouseY = 0;
let scale = 1;
let color = "transparent";
let opacity = 0;
let text = "";
let pjTLTarget = null;

// 마우스 좌표 저장
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (!mousemoved) {
    cursor.style.opacity = 1;
    mousemoved = true;
  }
});

// 호버 효과
document.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    scale = 3;
    color = "white";
    opacity = 1;
    text = "Open";
    pjTLTarget = el;
  });

  el.addEventListener("mouseleave", () => {
    scale = 1;
    color = "transparent";
    opacity = 0;
    text = "";
    pjTLTarget = null;
  });
});

gsap.ticker.add(() => {
  if (!mousemoved) return;

  cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(${scale})`;
  cursor.style.backgroundColor = color;
  cursorText.style.opacity = opacity;

  if (pjTLTarget) {
    if (pjTLTarget.classList.contains("logo")) {
      text = "";
    } else if (pjTLTarget.classList.contains("top-button-hover")) {
      text = "ToTop";
    } else if (pjTLTarget.classList.contains("cursor-effect")) {
      text = window.imgWrap1Ready ? "Open" : "";
    } else {
      text = "Open";
    }
  }

  cursorText.textContent = text;
});