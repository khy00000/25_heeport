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

  gsap.set(".project-p-container a", { borderRadius: "1px" });

  // 타임라인 생성
  const tl = gsap.timeline();

  // 문자 애니메이션
  tl.fromTo(
    [pptileSplit.chars, responsiveSplit.chars],
    { xPercent: 100, opacity: 0 },
    { xPercent: 0, opacity: 1, duration: 1, ease: "power1.out" }
  )
    .fromTo(
      ".project-p-container a",
      { borderRadius: "1px" },
      { borderRadius: "70px", duration: 1, ease: "power2.out" },
      "<"
    )
    .add(() => {
      if (window.innerWidth > 768) {
        document.querySelector(".toproject-p").style.opacity = 1;
      }
    });
});
