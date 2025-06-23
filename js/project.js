fetch("./data/projectData.json")
  .then((res) => res.json())
  .then((data) => {
    const project = data[0]; // 첫 번째 프로젝트만 예시로 사용

    const projectEl = document.getElementById("project");

    // 1. Intro 영역
    const intro = document.createElement("div");
    intro.className = "intro";
    intro.innerHTML = `
      <div class="intro-wrap">
        <div class="project-date">${project.date}</div>
        <div class="project-tool-wrap">
          ${project.stack.map((tool) => `<p>${tool}</p>`).join("")}
        </div>
      </div>
      <div class="project-title">
        <a href="#" class="pt-mask">
          <div class="old">${project.title}</div>
          <div class="new">${project.subtitle}</div>
        </a>
      </div>
    `;
    projectEl.appendChild(intro);

    // 2. 이미지 영역
    const imgSection = document.createElement("div");
    imgSection.className = "project-img";
    imgSection.innerHTML = `
  <a href="#"><img src="${project.image}" alt="${project.title}" /></a>
`;
    projectEl.appendChild(imgSection);

    // 3. 정보 섹션
    const info = document.createElement("div");
    info.className = "project-info";
    info.innerHTML = `
      <div class="project-container">
        <h1>Description</h1>
        <p>${project.description}</p>
      </div>

      <div class="project-container">
        <h1>Technologies & Tools</h1>
        <ul class="tool-wrap">
          ${project.technologies.map((t) => `<li>${t}</li>`).join("")}
        </ul>
      </div>

      <div class="project-container">
        <h1>Function Description</h1>
        <ul class="function-wrap">
          ${project.functions.map((f) => `<li>${f}</li>`).join("")}
        </ul>
      </div>

      <div class="project-container">
        <h1>Trouble Shootings</h1>
        <div class="ts-wrap">
          ${project.troubleshooting
            .map((ts, index) => {
              const icons = ["a", "b", "c"];
              return `
              <div class="ts-title icon-${icons[index]}">${ts.title}</div>
              <div class="ts-problem">문제</div>
              <div class="ts-problem-discrip">${ts.problem}</div>
              <div class="ts-fix">해결 방법</div>
              <ul class="ts-fix-discrip">
                ${ts.solution.map((s) => `<li>${s}</li>`).join("")}
              </ul>
          `;
            })
            .join("")}
        </div>
      </div>
    `;
    projectEl.appendChild(info);

    initProjectAnimation();
  });

gsap.registerPlugin(ScrollTrigger);

function initProjectAnimation() {
  ScrollTrigger.create({
    trigger: ".intro",
    start: "top top",
    end: "+=100%",
    pin: true,
    pinSpacing: false,
  });
}
