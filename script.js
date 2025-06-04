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

// 레니스 등록
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// from 등장 전의 값 / to 퇴장 후의 값 / fromto 등장 전의 값 현재 값
gsap.registerPlugin(ScrollTrigger, SplitText);

document.fonts.ready.then(() => {
  // 로딩 페이지 애니메이션
  const loadingSplit = new SplitText(".loading-logo", {
    type: "chars",
    charsClass: "chars-mask",
    mask: "chars",
  });

  // 인트로 애니메이션 아이템
  const introtxts = [".split1", ".split2", ".split3", ".split4"];
  const introtxt = introtxts.map(
    (item) =>
      new SplitText(item, {
        type: "lines",
        linesClass: "line",
        mask: "lines",
      })
  );
  const [split1, split2, split3, split4] = introtxt;

  function animateIn(introitem) {
    return gsap.fromTo(
      introitem.lines,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 0.4,
        ease: "power1.out",
        stagger: 0.3,
      }
    );
  }

  function animateOut(introitem) {
    return gsap.to(introitem.lines, {
      yPercent: -100,
      duration: 0.4,
      ease: "power1.out",
      stagger: 0.3,
    });
  }

  const loadtl = gsap.timeline();

  // 로딩 페이지 초기 상태
  loadtl
    .set(".loading", { y: 0 })
    .set(".introwrap-2", { autoAlpha: 0 })

    // 1. 로고 마스크 애니메이션
    .from(loadingSplit.chars, {
      y: "-100%",
      stagger: 0.05,
      duration: 1.3,
      ease: "back.out(1.7)",
    })

    // 2. 로딩 섹션 위로 사라지기
    .to(
      ".loading",
      {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1,
        ease: "power3.inOut",
      },
      "+=0.3"
    )

    // 3. 로딩 페이지 제거
    .set([".loading", ".loading-logo"], { display: "none" })

    // 4. 로딩 후 intro1 등장
    .add(animateIn(split1, 0), "-=0.3")
    .add(animateIn(split2, 0.3), ">");

  // 인트로 ScrollTrigger로 등장/퇴장 전환
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

  // work 애니메이션
  const works = gsap.utils.toArray(".works-list-wrap");
  const introWorks = works[0];

  const marquee = document.querySelector(".works-txt-wrap .works-txt");

  const worksimgWrap = introWorks.querySelector(".works-img");
  const worksimg = introWorks.querySelector(".works-img img");

  const title = document.querySelectorAll(".works-item-title");
  const description = document.querySelectorAll(".description-list");

  const titles = gsap.utils.toArray(".works-item-title h2");
  const workSplit = titles.map(
    (title) =>
      new SplitText(title, {
        type: "chars",
        charsClass: "work-chars",
      })
  );

  function worksIn(title, description) {
    gsap.to(title, { x: "0%", duration: 0.75, ease: "power4.out" });
    gsap.to(description, {
      x: 0,
      opacity: 1,
      duration: 0.75,
      delay: 0.1,
      ease: "power4.out",
    });
  }

  function worksOut(title, description) {
    gsap.to(title, { x: "100%", duration: 0.5, ease: "power4.out" });
    gsap.to(description, {
      x: "40px",
      opacity: 0,
      duration: 0.5,
      ease: "power4.out",
    });
  }

  // work 입장 애니메이션
  const workstl = gsap.timeline();

  // work 이미지 초기 상태
  workstl
    .to(worksimgWrap, { scale: 0.5, borderRadius: "400px" })
    .to(worksimg, { scale: 1.5 })
    .set(title, { autoAlpha: 0, x: 0 })
    .set(description, { autoAlpha: 0, x: 0 })
    .set(".scroll", { autoAlpha: 0, x: 0 })
    .to(marquee, {
      xPercent: -50,
      ease: "none",
      duration: 15,
      repeat: -1,
    });

  // work 스코롤
  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".works",
      start: "top top",
      end: "+=2000",
      pin: true,
      scrub: 2,
    },
  });

  scrollTl
    .to(marquee, { opacity: 0, ease: "none" }, 0)
    .to(worksimgWrap, { scale: 1, borderRadius: "40px", ease: "power2.out" }, 0)
    .to(worksimg, { scale: 1, ease: "power2.out" }, 0);
});

// 어바웃 애니메이션
gsap.utils.toArray(".about-item").forEach((item) => {
  ScrollTrigger.create({
    trigger: item,
    start: "top 50%",
    onEnter: () => item.classList.add("active"),
    onLeaveBack: () => item.classList.remove("active"),
  });
});

// howiwork 애니메이션
window.addEventListener("load", () => {
  gsap.set(".split5, .split6", { autoAlpha: 0 });

  ScrollTrigger.create({
    trigger: ".howiwork",
    start: "top center",
    end: "bottom bottom",
    once: true,

    onEnter: () => {
      gsap
        .timeline()
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
