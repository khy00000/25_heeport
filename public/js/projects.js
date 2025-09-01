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

  //ios borderRadius 버그 대응
  // const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  gsap.set(".project-p-container a", { borderRadius: "0px" });

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
      { borderRadius: "0px" },
      { borderRadius: "70px", duration: 1, ease: "power2.out" },
      "<"
    )
    .add(() => {
      if (window.innerWidth > 768) {
        document.querySelector(".toproject-p").style.opacity = 1;
      }
    });
});
