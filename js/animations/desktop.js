
export function initDesktopAnimations() {
  const hero = document.querySelector(".hero-img");
  if (hero) {
    gsap.from(hero, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power4.out"
    });
  }
}