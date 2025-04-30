export function initDesktopAnimations() {
  console.log("Init animacions d'escriptori");
  
  initYearsAnimation();
}

function initYearsAnimation() {
  const CRONO = document.getElementById("cronologia");
  if (!CRONO) return;

  const MAIN = document.querySelector("main");
  const years = gsap.utils.toArray(".year");

  // anys ocults i alçats inicialment
  gsap.set(years, { autoAlpha: 0, y: 100 });

  // animació anys
  gsap.to(years, {
    autoAlpha: 1,
    y: 0,
    duration: 1,
    stagger: 0.5,
    ease: "power2.out",

    scrollTrigger: {
      trigger: CRONO,
      scroller: MAIN,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    }
  });
}