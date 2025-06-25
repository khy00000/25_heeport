// 마우스 커서
const cursor = document.querySelector(".cursor");
const ripple = document.querySelector(".cursor-ripple");

let mouseX = 0;
let mouseY = 0;
let scale = 1;
let color = "transparent";

// 마우스 좌표 저장
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

gsap.ticker.add(() => {
  cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(${scale})`;
  cursor.style.backgroundColor = color;
});

// 호버 효과
document.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    scale = 3;
    color = "white";
  });
  el.addEventListener("mouseleave", () => {
    scale = 1;
    color = "transparent";
  });
});