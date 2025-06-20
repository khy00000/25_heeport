gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: ".intro",
  start: "top top",
  end: "+=100%",
  pin: true,
  pinSpacing: false,
});