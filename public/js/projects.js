document.fonts.ready.then(() => {
  const pptileSplit = new SplitText(".projects-p-title", {
    type: "chars",
    linesClass: "char",
    mask: "chars",
  });

  const responsiveSplit = new SplitText(".projects-p-responsive", {
    type: "chars",
    linesClass: "char",
    mask: "chars",
  });

  gsap.set(".project-p-container a", { clipPath: "inset(0% round 0%)" });

  // 타임라인 생성
  const tl = gsap.timeline();

  // 문자 애니메이션
  tl.fromTo(
    [pptileSplit.chars, responsiveSplit.chars],
    { xPercent: 100, opacity: 0 },
    { xPercent: 0, opacity: 1, duration: 1, ease: "power1.out" }
  )

    // 버튼 애니메이션 (문자와 동시에 실행)
    .fromTo(
      ".project-p-container a",
      { clipPath: "inset(0% round 0%)" },
      { clipPath: "inset(0% round 10%)", duration: 1, ease: "power2.out" },
      "<" // "<"는 이전 애니메이션과 동시에 시작
    )

    // onComplete 작업
    .add(() => {
      if (window.innerWidth > 768) {
        document.querySelector(".toproject-p").style.opacity = 1;
      }
    });
});
