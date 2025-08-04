// 마우스 커서
const cursor = document.querySelector(".cursor");
const cursorText = cursor.querySelector(".cursor-text");

let mouseX = 0;
let mouseY = 0;
let scale = 1;
let color = "transparent";
let opacity = 0;
let text = ""; 

// 마우스 좌표 저장
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// 호버 효과
document.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    scale = 3;
    color = "white";
    opacity = 1;

    if (el.classList.contains("logo")) {
      text = "";
    } else {
      text = "Open";
    }
  });

  el.addEventListener("mouseleave", () => {
    scale = 1;
    color = "transparent";
    opacity = 0;
  });
});

gsap.ticker.add(() => {
  cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(${scale})`;
  cursor.style.backgroundColor = color;
  cursorText.style.opacity = opacity;
  cursorText.textContent = text;
});
