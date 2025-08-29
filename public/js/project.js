import { config } from "./config.js";

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("DOMContentLoaded", () => {
  loadData();
});

const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/${config.collectionName}?key=${config.apiKey}`;

// Firestore 데이터 가져오기
async function fetchProjectsFromFirestore() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.documents) return [];

    return data.documents.map((doc) => {
      const f = doc.fields;
      return {
        id: doc.name.split("/").pop(),
        title: unwrap(f.title),
        subtitle: unwrap(f.subtitle),
        description: unwrap(f.description),
        image: unwrap(f.image),
        url: unwrap(f.url),
        date: unwrap(f.date),
        stack: unwrap(f.stack) || [],
        technologies: unwrap(f.technologies) || [],
        functions: unwrap(f.functions) || [],
        troubleshooting: unwrap(f.troubleshooting) || [],
      };
    });
  } catch (err) {
    console.error("Firestore fetch error:", err);
    return [];
  }
}

async function loadData() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("id");

  const data = await fetchProjectsFromFirestore();

  const project = data.find((p) => p.id === projectId);

  if (!project) {
    document.getElementById("project").innerHTML = "<p>Project not found.</p>";
    return;
  }

  // 프로젝트 페이지 돔 렌더링
  renderProject(project);

  await waitForResources();
  
  // 애니메이션
  initIntroAnimation();
  initProjectAnimation();
  initNextProjectAnimation(data, projectId);

  ScrollTrigger.refresh();
}

// 프로젝드 페이지 돔 렌더링
function renderProject(project) {
  const projectEl = document.getElementById("project");

  renderIntro(project, projectEl);
  renderImage(project, projectEl);
  renderInfo(project, projectEl);
}

// 인트로 영역
function renderIntro(project, container) {
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
            <a href="${
              project.url
            }" class="pt-mask" target="_blank" rel="noopener noreferrer">
              <div class="old">${project.title}</div>
              <div class="new">${project.subtitle}</div>
            </a>
          </div>
        </div>
    `;
  container.appendChild(intro);
}

// 이미지 영역
function renderImage(project, container) {
  const imgSection = document.createElement("div");
  imgSection.className = "project-img";
  imgSection.innerHTML = `
  <a href="${project.url}" target="_blank" rel="noopener noreferrer"><img src="${project.image}" alt="${project.title}" /></a>
`;
  container.appendChild(imgSection);
}

// 인포 영역
function renderInfo(project, container) {
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

  container.appendChild(info);
}

// 애니메이션
// 인트로 스프릿 텍스트
function initIntroAnimation() {
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

    // 링크 호버
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
}

// 인트로 고정
function initProjectAnimation() {
  ScrollTrigger.matchMedia({
    "(min-width: 769px)": function () {
      ScrollTrigger.create({
        trigger: ".intro",
        start: "top top",
        endTrigger: ".project-img",
        pin: true,
        pinSpacing: false,
      });
    },
    "(max-width: 768px)": function () {
      // 모바일에서는 pin 제거
    },
  });
}

// 하단 다음 프로젝트 스코롤 트리거
function initNextProjectAnimation(data, projectId) {
  const totalProjects = data.length;
  const currentId = parseInt(projectId, 10);

  // 다음 id 계산
  const nextId = currentId < totalProjects ? currentId + 1 : null;
  const nextUrl = nextId ? `project.html?id=${nextId}` : "index.html";
  const bar = document.querySelector(".bar");

  const txt = document.querySelector(".left");
  txt.textContent = nextId ? "Next Project" : "Back to Home";

  // 데이터 모두 로딩되고 보여진 후 보이기
  const nextProjectEl = document.querySelector(".next-project");
  nextProjectEl.style.display = "block";

  ScrollTrigger.create({
    trigger: ".next-project",
    start: "center bottom",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;

      gsap.to(bar, {
        width: `${progress * 100}%`,
        duration: 3,
        ease: "power1.out",
      });

      if (progress >= 0.997 && !bar.dataset.completed) {
        // 중복 실행 체크
        bar.dataset.completed = "true";
        setTimeout(() => {
          window.location.href = nextUrl;
        }, 1300);
      }
    },
  });
}

// 파이어베이스 데이터 언래핑 함수
function unwrap(field) {
  if (!field) return null;

  if (field.stringValue !== undefined) return field.stringValue;
  if (field.integerValue !== undefined) return Number(field.integerValue);
  if (field.doubleValue !== undefined) return Number(field.doubleValue);
  if (field.booleanValue !== undefined) return field.booleanValue;
  if (field.arrayValue !== undefined)
    return (field.arrayValue.values || []).map(unwrap);
  if (field.mapValue !== undefined) {
    const obj = {};
    for (const [k, v] of Object.entries(field.mapValue.fields || {})) {
      obj[k] = unwrap(v);
    }
    return obj;
  }
  return null;
}

// 리소스 로딩 체크 함수
function waitForResources() {
  return new Promise(resolve => {
    // 1. 이미지 로딩 체크
    const images = Array.from(document.images);
    const imagesLoaded = images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(r => (img.onload = r));
    });

    // 2. 폰트 로딩 체크
    document.fonts.ready.then(() => {
      Promise.all(imagesLoaded).then(resolve);
    });
  });
}

// // 데이터 로딩
// const urlParams = new URLSearchParams(window.location.search);
// const projectId = parseInt(urlParams.get("id"));

// fetch("./data/projectData.json")
//   .then((res) => res.json())
//   .then((data) => {
//     const project = data.find((p) => p.id === projectId);
//     if (!project) {
//       document.getElementById("project").innerHTML =
//         "<p>Project not found.</p>";
//       return;
//     }

//     // 프로젝트 페이지 돔 렌더링
//     renderProject(project);

//     // 애니메이션
//     initIntroAnimation();
//     initProjectAnimation();
//     initNextProjectAnimation(data, projectId);

//     ScrollTrigger.refresh();
//   });
