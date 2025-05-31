// 로고 마우스엔터 효과
const logo = document.querySelector(".logo");
const letters = document.querySelectorAll(".hover-k, .hover-m");
let hoverCount = 0;

logo.addEventListener("mouseenter", () => {
  hoverCount++;

  const isOdd = hoverCount % 2 === 1;

  const mTransform = isOdd ? "translateX(-20px)" : "translateX(20px)";
  const kTransform = isOdd ? "translateX(20px)" : "translateX(-20px)";

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

  // 이동 중에는 다시 트리거되지 않도록 잠깐 막기
  setTimeout(() => {
    letters.forEach((el) => el.classList.remove("moving"));
  }, 600);
});

// 인트로 텍스트 효과
// from 등장 전의 값 / to 퇴장 후의 값 / fromto 등장 전의 값 현재 값
gsap.registerPlugin(ScrollTrigger, SplitText);

document.fonts.ready.then(() => {
  // Split 아이템
  const splitTargets = [
    ".split1",
    ".split2",
    ".split3",
    ".split4"
  ];
  const splits = splitTargets.map(
    (sel) =>
      new SplitText(sel, {
        type: "lines",
        linesClass: "line",
        mask: "lines",
      })
  );

  const [split1, split2, split3, split4] = splits;

  function animateIn(split) {
    return gsap.fromTo(
      split.lines,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 0.4,
        ease: "power1.out",
        stagger: 0.3,
      }
    );
  }

  function animateOut(split) {
    return gsap.to(split.lines, {
      yPercent: -100,
      duration: 0.4,
      ease: "power1.out",
      stagger: 0.3,
    });
  }

  // 초기 상태
  gsap.set(".introwrap-2", { autoAlpha: 0 });

  // 첫 로딩 시 intro1 등장
  gsap.timeline().add(animateIn(split1, 0)).add(animateIn(split2, 0.3), ">");

  // ScrollTrigger로 등장/퇴장 전환
  // ">" 앞애니 끝난뒤 (기본값) / ">-0.3" 앞당겨 몇초 / "<" 앞애니와 동시에
  // 트리거 뷰포트
  ScrollTrigger.create({
    trigger: ".intro-row2",
    start: "top-=150 top",
    end: "bottom bottom",
    scrub: false,

    onEnter: () => {
      gsap
        .timeline()
        .add(animateOut(split1))
        .add(animateOut(split2), ">-0.3")
        .to(".introwrap-1", { autoAlpha: 0 }, "<")
        .to(".introwrap-2", { autoAlpha: 1 }, "<")
        .add(animateIn(split3, 0.3))
        .add(animateIn(split4, 0.6), ">-0.3");
    },

    onLeaveBack: () => {
      gsap
        .timeline()
        .add(animateOut(split3))
        .add(animateOut(split4), ">-0.3")
        .to(".introwrap-2", { autoAlpha: 0 }, "<")
        .to(".introwrap-1", { autoAlpha: 1 }, "<")
        .add(animateIn(split1, 0.3))
        .add(animateIn(split2, 0.6), ">-0.3");
    },
  });

  //howiwork 스피릿 효과
//   ScrollTrigger.create({
//     trigger: ".howiwork",
//     start: "top 80%",

//     onEnter: () => {
//       gsap
//         .timeline()
//         .add(animateIn(split5, 0))
//         .add(animateIn(split6, 0.3), ">");
//     },
//   });
});

//어바웃 애니메이션 효과
gsap.utils.toArray(".about-item").forEach((item) => {
  ScrollTrigger.create({
    trigger: item,
    start: "top 50%",
    onEnter: () => item.classList.add("active"),
    onLeaveBack: () => item.classList.remove("active"),
  });
});

//howiwork 효과 수정
window.addEventListener("load", () => {
  gsap.set(".split5, .split6", { autoAlpha: 0 });

  ScrollTrigger.create({
    trigger: ".howiwork",
    start: "top center",
    end: "bottom bottom",
    once: true,
    markers: true,
    
    onEnter: () => {
      gsap.timeline()
        .fromTo(
          ".split5",
          { y: 50, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: "power1.out" }
        )
        .fromTo(
          ".split6",
          { y: 50, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: "power1.out" },
          ">-0.3"
        );
    },
  });

  ScrollTrigger.refresh(); // 강제로 트리거 새로고침
});