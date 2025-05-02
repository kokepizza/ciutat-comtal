export function initDesktopAnimations() {
  console.log("Init animacions d'escriptori");
  
  initYearsAnimation();
  initArticlesNav();
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

// ScrollTo Articles
function initArticlesNav() {
  const MAIN = document.querySelector("main");
  const LINKS = document.querySelectorAll("#notes-menu a");

  function scrollToArticle(e) {
    e.preventDefault();
    const HREF = this.getAttribute("href");
    const TARGET = document.querySelector(HREF);
    if (!TARGET) return;

    // LINKS.forEach(link => link.classList.remove("active"));
    // this.classList.add("active");

    gsap.to(MAIN, {
      scrollTo: { y: TARGET, offsetY: -1 },
      duration: 1,
      ease: "scrollEase",
    });
  }
  
  LINKS.forEach(function(link) {
    link.addEventListener("click", scrollToArticle);
  });

  LINKS.forEach(function(link) {
    const HREF = link.getAttribute("href");
    const TARGET = document.querySelector(HREF);
    if (!TARGET) return;

    ScrollTrigger.create({
      trigger: TARGET,
      start: "top top",
      scroller: MAIN,
      onEnter: () => {
        LINKS.forEach(l =>
          l.classList.remove("active"));
          link.classList.add("active");
      },
      onEnterBack: () => {
        LINKS.forEach(l =>
          l.classList.remove("active"));
          link.classList.add("active");
      }
    })
  })
}