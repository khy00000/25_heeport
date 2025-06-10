// 인트로 탑 로고 마우스엔터 효과
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

  // 인트로 애니메이션
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

  // 인트로 하단 애니메이션
  // ">" 앞애니 끝난뒤 (기본값) / ">-0.3" 앞당겨 몇초 / "<" 앞애니와 동시에 / 왼 트리거 오 뷰포트
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

  // 어바웃 애니메이션
  gsap.utils.toArray(".about-item").forEach((item) => {
    ScrollTrigger.create({
      trigger: item,
      start: "top 50%",
      onEnter: () => item.classList.add("active"),
      onLeaveBack: () => item.classList.remove("active"),
    });
  });

  // howiwork
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

  // works 배경 텍스트 루프 애니메이션
  gsap.to(".works-txt", {
    xPercent: -50,
    ease: "none",
    duration: 15,
    repeat: -1,
  });

  // works 애니메이션
  const works = gsap.utils.toArray(".works-list-wrap");
  const works1 = works[0];
  const works2 = works[1];
  const works3 = works[2];
  const imgWrap1 = works1.querySelector(".works-img");
  const imgWrap2 = works2.querySelector(".works-img");
  const imgWrap3 = works3.querySelector(".works-img");

  const titles = gsap.utils.toArray(".works-item-title");
  const titleSplits = titles.map(
    (title) =>
      new SplitText(title, {
        types: "chars",
        lineClass: "work-chars",
        mask: "chars",
      })
  );

  const descriptionLists = gsap.utils.toArray(".description-list");
  const descSplits = descriptionLists.map(
    (desc) =>
      new SplitText(desc, {
        types: "chars",
        lineClass: "work-chars",
        mask: "chars",
      })
  );

  const scrolls = gsap.utils.toArray(".scroll");
  const scrollSplits = scrolls.map(
    (scroll) =>
      new SplitText(scroll, {
        types: "chars",
        lineClass: "work-chars",
        mask: "chars",
      })
  );

  const allchars = [...titleSplits, ...descSplits, ...scrollSplits];
  const flatChars = allchars.flatMap((arr) => arr.chars || arr);

  gsap.set(imgWrap1, { scale: 0.5, borderRadius: "400px" });
  gsap.set([imgWrap2, imgWrap3], { opacity: 1, y: 900 });
  gsap.set(flatChars, { opacity: 0, x: 100 });

  const workTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".works",
      start: "top top",
      end: "+=3000",
      scrub: 2,
      pin: true,
    },
  });

  workTl
    .to(".works-txt", { opacity: 0 })
    .to(
      imgWrap1,
      { scale: 1, borderRadius: "40px", duration: 3, ease: "power2.out" },
      "<"
    )
    .to([titleSplits[0].chars, descSplits[0].chars, scrollSplits[0].chars], {
      x: 0,
      opacity: 1,
      duration: 2,
    })
    .addPause()
    .to(imgWrap2, { opacity: 1, y: 0, duration: 3, ease: "power2.out" })
    .to(
      works1,
      { scale: 0.7, opacity: 0.5, duration: 3, ease: "power2.out" },
      "<"
    )
    .to([titleSplits[1].chars, descSplits[1].chars, scrollSplits[1].chars], {
      x: 0,
      opacity: 1,
      duration: 2,
    })
    .addPause()
    .to(imgWrap3, { opacity: 1, y: 0, duration: 3, ease: "power2.out" })
    .to(
      works2,
      { scale: 0.7, opacity: 0.5, duration: 3, ease: "power2.out" },
      "<"
    )
    .to([titleSplits[2].chars, descSplits[2].chars, scrollSplits[2].chars], {
      x: 0,
      opacity: 1,
      duration: 2,
    })
    .addPause();

  // footer 애니메이션
  const footertops = document.querySelectorAll(".footer_top p");
  const footertopSplits = Array.from(footertops).map(
    (el) =>
      new SplitText(el, {
        type: "chars",
        charsClass: "footertop-mask",
        mask: "chars",
      })
  );

  const footerlogoSplit = new SplitText(".footer_bottom", {
    type: "chars",
    charsClass: "footerlogo-mask",
    mask: "chars",
  });

  gsap.set(footertopSplits[0].chars, { x: 100 });
  gsap.set(footertopSplits[1].chars, { x: 100 });
  gsap.set(footerlogoSplit.chars, { x: 100 });

  const footerTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".footer",
      start: "top 80%",
      end: "bottom bottom",
      toggleActions: "restart none none none", // in, out, inBack, outBack
    },
  });

  footerTl
    .to(footertopSplits[0].chars, {
      x: 0,
    })
    .to(
      footertopSplits[1].chars,
      {
        x: 0,
      },
      "<0.3"
    )
    .to(footerlogoSplit.chars, {
      x: 0,
    });

  ScrollTrigger.refresh(); // 트리거 새로고침
});
