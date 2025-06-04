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