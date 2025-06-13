    ScrollTrigger.create({
      trigger: introWorks,
      start: "top top",
      end: "+=300vh",
      onUpdate: (self) => {
        const progress = self.progress;
        const imgScale = 0.5 + progress * 0.5;
        const borderRadius = 400 - progress * 375;
        const innerImgScale = 1.5 - progress * 0.5;

        gsap.set(worksimgWrap, {
          scale: imgScale,
          borderRadius: borderRadius + "px",
        });
        gsap.set(worksimg, {
          scale: innerImgScale,
        });

        if (progress > 1 && !introWorks.contentRevealed) {
          introWorks.contentRevealed = true;
          gsap.add(worksIn);
        }
        if (progress > 1 && introWorks.contentRevealed) {
          introWorks.contentRevealed = false;
          gsap.add(worksOut);
        }
      },
    });

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