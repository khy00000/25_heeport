gsap.registerPlugin(ScrollTrigger);

const urlParams = new URLSearchParams(window.location.search);
const projectId = parseInt(urlParams.get("id"));

fetch("./data/projectData.json")
  .then((res) => res.json())
  .then((data) => {
    const project = data.find((p) => p.id === projectId);
    if (!project) {
      document.getElementById("project").innerHTML =
        "<p>Project not found.</p>";
      return;
    }

    const projectEl = document.getElementById("project");

    // 1. Intro 영역
    const intro = document.createElement("div");
    intro.className = "intro";
    intro.innerHTML = `
        <div class="home">
          <a href="/" class="project-logo">Heeyon Kim</a>
        </div>
        <div class="intro-bottom">
          <div class="intro-bottom-wrap">
            <div class="project-date">${project.date}</div>
            <div class="project-tool-wrap">
              ${project.stack.map((tool) => `<p>${tool}</p>`).join("")}
            </div>
          </div>
          <div class="project-title">
            <a href="${project.url}" class="pt-mask" target="_blank" rel="noopener noreferrer">
              <div class="old">${project.title}</div>
              <div class="new">${project.subtitle}</div>
            </a>
          </div>
        </div>
    `;
    projectEl.appendChild(intro);

    // 2. 이미지 영역
    const imgSection = document.createElement("div");
    imgSection.className = "project-img";
    imgSection.innerHTML = `
  <a href="${project.url}" target="_blank" rel="noopener noreferrer"><img src="${project.image}" alt="${project.title}" /></a>
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
              const icons = ["a", "b", "c", "d"];

              function escapeHTML(str) {
                return str
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;")
                  .replace(/'/g, "&#039;");
              }

              return `
              <div class="ts-title icon-${icons[index]}">${ts.title}</div>
              <div class="ts-problem">문제</div>
              <div class="ts-problem-discrip">${ts.problem}</div>
              <div class="ts-fix">해결 방법</div>
              <ul class="ts-fix-discrip">
                ${ts.solution.map((s) => `<li>${s}</li>`).join("")}
              </ul>
              <div class="ts-banda">
                <div class="ts-before">
                  ${ts.beforecode
                    .map((b) => `<pre><code>${escapeHTML(b)}</code></pre>`)
                    .join("")}
                </div>
                <div class="ts-banda-arrow"></div>
                <div class="ts-after">
                  ${ts.aftercode
                    .map((a) => `<pre><code>${escapeHTML(a)}</code></pre>`)
                    .join("")}
                </div>
              </div>
          `;
            })
            .join("")}
        </div>
      </div>
    `;
    projectEl.appendChild(info);

    // 페이드인 애니메이션 실행
    document.fonts.ready.then(() => {
      const plogoSplit = new SplitText(".project-logo", {
        type: "chars",
        linesClass: "char",
        mask: "chars",
      });

      const pdateSplit = new SplitText(".project-date", {
        type: "chars",
        linesClass: "char",
        mask: "chars",
      });

      const ptoolSplit = new SplitText(".project-tool-wrap p", {
        type: "chars",
        linesClass: "char",
        mask: "chars",
      });

      const ptitleSplit = new SplitText(".old", {
        type: "chars",
        linesClass: "char",
        mask: "chars",
      });

      const mask = document.querySelector(".pt-mask");
      const maintitle = document.querySelector(".old");
      const subtitle = document.querySelector(".new");

      gsap.set(subtitle, { yPercent: 100, opacity: 0 });

      gsap.fromTo(
        [plogoSplit.chars, pdateSplit.chars, ptoolSplit.chars],
        { xPercent: 100, opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          duration: 1,
          ease: "power1.out",
        }
      );

      gsap.fromTo(
        [ptitleSplit.chars],
        { xPercent: 100, opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power1.out",
        }
      );

      gsap.fromTo(
        ".project-img a",
        {
          borderRadius: "100px",
        },
        {
          borderRadius: 0,
          duration: 1,
          ease: "power2.out",
        }
      );

      mask.addEventListener("mouseenter", () => {
        const hoverTl = gsap.timeline();
        hoverTl
          .to(
            maintitle,
            {
              yPercent: -100,
              duration: 0.5,
            },
            0
          )
          .to(
            subtitle,
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.5,
            },
            0
          );
      });

      mask.addEventListener("mouseleave", () => {
        const leaveTl = gsap.timeline();
        leaveTl
          .to(
            maintitle,
            {
              yPercent: 0,
              duration: 0.5,
            },
            0
          )
          .to(
            subtitle,
            {
              yPercent: 100,
              duration: 0.5,
            },
            0
          );
      });
    });

    // 하단 next-project progress
    const totalProjects = data.length;

    // 다음 id 계산
    const nextId = projectId < totalProjects ? projectId + 1 : null;
    const nextUrl = nextId ? `project.html?id=${nextId}` : "index.html";
    const bar = document.querySelector(".bar");

    ScrollTrigger.create({
      trigger: ".next-project",
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        bar.style.width = `${progress * 100}%`;

        if (progress >= 0.997 && !bar.dataset.completed) {
          // 중복 실행 체크
          bar.dataset.completed = "true";
          setTimeout(() => {
            window.location.href = nextUrl;
          }, 400);
        }
      },
    });

    //
    const txt = document.querySelector(".left");
    txt.textContent = nextId ? "Next Project" : "Back to Home";

    // 데이터 모두 로딩되고 보여진 후 보이기
    const nextProjectEl = document.querySelector(".next-project");
    nextProjectEl.style.display = "block";

    initProjectAnimation();
    ScrollTrigger.refresh();
  });

// 프로젝트 인트로 고정 애니메이션
function initProjectAnimation() {
  ScrollTrigger.create({
    trigger: ".intro",
    start: "top top",
    end: "bottom top",
    pin: true,
    pinSpacing: false,
  });
}