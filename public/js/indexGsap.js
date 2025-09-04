gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  // 인트로 측면 텍스트 애니메이션
  const lateraltl = gsap.timeline({
    scrollTrigger: {
      trigger: ".about",
      start: "top bottom",
      end: "+=5000",
      scrub: true,
    },
  });

  // 모바일에서 애니메이션 해제
  const isMo = window.innerWidth <= 768;

  if (!isMo) {
    gsap.set(".lateral2", { x: window.innerHeight, opacity: 0.5 });

    lateraltl
      .to(".lateral2", {
        x: -3000,
        duration: 1,
      })
      .to(
        ".lateral1",
        {
          x: -4000,
          duration: 1,
        },
        "<"
      );
  }

  // 어바웃 섹션 애니메이션
  gsap.utils.toArray(".about-item").forEach((item) => {
    ScrollTrigger.create({
      trigger: item,
      start: "top 50%",
      onEnter: () => item.classList.add("active"),
      onLeaveBack: () => item.classList.remove("active"),
    });
  });

  // 스프릿 텍스트 애니메이션 모음
  document.fonts.ready.then(() => {
    // 로딩 페이지 애니메이션
    const loadingSplit = new SplitText(".loading-logo", {
      type: "chars",
      charsClass: "chars-mask",
      mask: "chars",
    });

    // 메인 페이지 인트로 애니메이션
    const introtxts = [
      ".split1",
      ".split2",
      ".split3",
      ".split4",
      ".split5",
      ".split6",
    ];

    const introtxt = introtxts.map(
      (item) =>
        new SplitText(item, {
          type: "lines",
          linesClass: "line",
          mask: "lines",
        })
    );
    const [split1, split2, split3, split4, split5, split6] = introtxt;

    function animateIn(introitem) {
      return gsap.fromTo(
        introitem.lines,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.4,
          ease: "power1.out",
          stagger: isMo ? 0 : 0.3,
        }
      );
    }

    function animateOut(introitem) {
      return gsap.to(introitem.lines, {
        yPercent: -100,
        duration: 0.4,
        ease: "power1.out",
        stagger: isMo ? 0 : 0.3,
      });
    }

    const loadtl = gsap.timeline();

    // 첫 로딩 시에만 로딩페이지 애니메이션
    const loading = document.querySelector(".loading");
    const hasVisited = sessionStorage.getItem("hasVisited");

    // 메인 요소
    const navLinks = document.querySelectorAll(".intro .intro-row1 nav a");
    const logo = document.querySelectorAll(".logo");
    const lateral = document.querySelectorAll(".lateral");

    if (!hasVisited) {
      sessionStorage.setItem("hasVisited", "true");
      loading.classList.add("first-visit");

      // 로딩 페이지 초기 상태
      loadtl
        // 0. 로딩 페이지 애니메이션 중 깜빡임 방지
        .set("#main", { autoAlpha: 0 })
        .set([navLinks, logo, lateral], { autoAlpha: 0 })
        .set(".cursor", { opacity: 0, scale: 0 })
        .set(".loading", { y: 0 })
        .set(".introwrap-2", { autoAlpha: 0 })

        // 1. 로딩페이지 로고 마스크
        .from(loadingSplit.chars, {
          y: "-100%",
          stagger: 0.05,
          duration: 1.3,
          ease: "back.out(1.7)",
        })

        // 2. 로딩페이지 위로 효과
        .to(
          ".loading",
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 1,
            ease: "power3.inOut",
          },
          "+=0.3"
        )

        // 3. 로딩 페이지 제거, 메인 페이지 준비
        .to([".loading", ".loading-logo"], { display: "none" })
        .to(main, { autoAlpha: 1 })
        .to([navLinks, logo, lateral], { autoAlpha: 1, duration: 0.5 })

        // 4. 로딩 후 메인 텍스트 애니메이션 intro1
        .add(animateIn(split1), "-=0.3")
        .add(animateIn(split2), ">")

        // 5. 3d 인트로 애니메이션
        .call(() => {
          introAnimation();
        })

        // 6. 로딩 후 커서 등장
        .to(".cursor", {
          opacity: 1,
          scale: 1,
          duration: 3,
          ease: "power2.out",
        });
    } else {
      loadtl
        // 로딩 애니메이션 건너뛰기
        .set(".cursor", { opacity: 0, scale: 0 })
        .set(".introwrap-2", { autoAlpha: 0 })

        .to({}, { duration: 0.5 })
        .to("#main", { autoAlpha: 1 })
        .to([navLinks, logo, lateral], { autoAlpha: 1, duration: 0.5 })

        .add(animateIn(split1), "-=0.3")
        .add(animateIn(split2), ">")
        .call(() => {
          introAnimation();
        })
        .to(".cursor", {
          opacity: 1,
          scale: 1,
          duration: 3,
          ease: "power2.out",
        });
    }

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

    // howiwork 섹션
    gsap.set([split5.lines, split6.lines], { autoAlpha: 0, y: 50 });

    const hiwtl = gsap.timeline({
      scrollTrigger: {
        trigger: ".howiwork",
        start: "top center",
        end: "bottom bottom",
      },
    });

    hiwtl
      .to(split5.lines, {
        y: 0,
        autoAlpha: 1,
        duration: 0.6,
        ease: "power1.out",
      })
      .to(
        split6.lines,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          ease: "power1.out",
        },
        ">-0.3"
      );

    // projects 배경 텍스트 루프 애니메이션
    gsap.to(".projects-txt", {
      xPercent: -50,
      ease: "none",
      duration: 15,
      repeat: -1,
    });

    // projects 애니메이션
    const projects = gsap.utils.toArray(".project-list-wrap");
    const project1 = projects[0];
    const project2 = projects[1];
    const project3 = projects[2];
    const imgWrap1 = project1.querySelector(".project-img");
    const imgWrap2 = project2.querySelector(".project-img");
    const imgWrap3 = project3.querySelector(".project-img");

    const titles = gsap.utils.toArray(".project-item-title");
    const titleSplits = titles.map(
      (title) =>
        new SplitText(title, {
          types: "chars",
          lineClass: "project-chars",
          mask: "chars",
        })
    );

    const descriptionItems = gsap.utils.toArray(".description-item");
    const descSplits = descriptionItems.map(
      (item) =>
        new SplitText(item, {
          type: "chars",
          charsClass: "project-chars",
          mask: "chars",
        })
    );

    const descSplits1 = [
      descSplits[0].chars,
      descSplits[1].chars,
      descSplits[2].chars,
    ];

    const descSplits2 = [
      descSplits[3].chars,
      descSplits[4].chars,
      descSplits[5].chars,
    ];

    const descSplits3 = [
      descSplits[6].chars,
      descSplits[7].chars,
      descSplits[8].chars,
    ];

    const scrolls = gsap.utils.toArray(".scroll");
    const scrollSplits = scrolls.map(
      (scroll) =>
        new SplitText(scroll, {
          types: "chars",
          lineClass: "project-chars",
          mask: "chars",
        })
    );

    const allchars = [...titleSplits, ...descSplits, ...scrollSplits];
    const flatChars = allchars.flatMap((arr) => arr.chars || arr);

    gsap.set(imgWrap1, { scale: 0.5, borderRadius: "400px" });
    gsap.set([imgWrap2, imgWrap3], { opacity: 1, yPercent: 105 });
    gsap.set(flatChars, { opacity: 0, x: 100 });
    gsap.set(project1, { pointerEvents: "auto" });
    gsap.set([project2, project3], { pointerEvents: "none" });

    // 커서 디자인 플래그
    window.openOff = false;

    const projectTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".projects",
        start: "top top",
        end: "+=3000",
        scrub: 2,
        pin: true,
      },
    });

    projectTl
      .to(".projects-txt", { opacity: 0 })
      .to(
        imgWrap1,
        {
          scale: 1,
          borderRadius: "40px",
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            const currentScale = gsap.getProperty(imgWrap1, "scale");

            if (currentScale >= 1) {
              window.openOff = true;
            } else {
              window.openOff = false;
            }
          },
        },
        "<"
      )
      .to(
        [titleSplits[0].chars, descSplits1, scrollSplits[0].chars],
        {
          x: 0,
          opacity: 1,
          duration: 4,
        },
        ">-0.3"
      )
      .to({}, { duration: 4 })
      .to(imgWrap2, {
        opacity: 1,
        yPercent: 0,
        duration: 3,
        ease: "power2.out",
      })
      .to(
        project1,
        {
          pointerEvents: "none",
          scale: 0.7,
          opacity: 0,
          duration: 3,
          ease: "power2.out",
        },
        "<"
      )
      .to(project2, { pointerEvents: "auto" }, "<")
      .to(
        [titleSplits[1].chars, descSplits2, scrollSplits[1].chars],
        {
          x: 0,
          opacity: 1,
          duration: 4,
        },
        ">-0.3"
      )
      .to({}, { duration: 4 })
      .to(imgWrap3, {
        opacity: 1,
        yPercent: 0,
        duration: 3,
        ease: "power2.out",
      })
      .to(
        project2,
        {
          pointerEvents: "none",
          scale: 0.7,
          opacity: 0,
          duration: 3,
          ease: "power2.out",
        },
        "<"
      )
      .to(project3, { pointerEvents: "auto" }, "<")
      .to(
        [titleSplits[2].chars, descSplits3, scrollSplits[2].chars],
        {
          x: 0,
          opacity: 1,
          duration: 4,
        },
        ">-0.3"
      )
      .to({}, { duration: 4 });

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
      //3d 아웃 애니메이션
      .call(() => {
        outAnimation();
      })
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
});

// 리사이즈 리로드
let resizeTimer;
let lastSize = { w: window.innerWidth, h: window.innerHeight };

function handleResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(()=>{
    const dw = Math.abs(window.innerWidth - lastSize.w);
    const dh = Math.abs(window.innerHeight - lastSize.h);

    if (dw > 50 || dh > 140){
      location.reload();
    }

    lastSize = { w: window.innerWidth, h: window.innerHeight };
  }, 300);
}

// PC/모바일 공통 resize 감지
window.addEventListener("resize", handleResize);