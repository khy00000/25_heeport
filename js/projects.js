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

  gsap.fromTo(
    [pptileSplit.chars, responsiveSplit.chars],
    { xPercent: 100, opacity: 0},
    {
      xPercent: 0,
      opacity: 1,
      duration: 1,
      ease: "power1.out",
    }
  );

  gsap.fromTo(
    ".project-p-container a",
    {
      borderRadius: 0,
    },
    {
      borderRadius: "50px",
      duration: 2,
      ease: "power2.out",
      onComplete: () => {
        document.querySelector(".toproject-p").style.opacity = 1;
      },
    }
  );
});
