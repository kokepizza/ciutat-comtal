export function initDesktopAnimations() {
  console.log("Init animacions d'escriptori");
  
  initYearsAnimation();
  initArticlesNav();
  initHideNav();
}

function initYearsAnimation() {
  const CRONO = document.querySelector("#cronologia");
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
      scroller: MAIN,
      trigger: TARGET,
      start: "top top",
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
    });
  });
}

// Ocultar/mostrar Nav #notes
function initHideNav() {
  const MAIN = document.querySelector("main");
  const LINK_PUNT = document.querySelector('a[href="#punt-partida"]');
  const LINK_COST = document.querySelector('a[href="#cost-viure"]');
  const LINK_CIUTAT = document.querySelector('a[href="#ciutat-venda"]');
  const COST = document.querySelector("#cost-viure");
  const CIUTAT = document.querySelector("#ciutat-venda");
  const CRONO = document.querySelector("#cronologia");
  if (!LINK_PUNT || !LINK_COST || !LINK_CIUTAT || !COST || !CIUTAT || !CRONO) return;

  // quan entres a #cost-viure, ocultes l'enllaç a #punt-partida
  ScrollTrigger.create({
    scroller: MAIN,
    trigger: COST,
    start: "top center",
    onEnter: () => { LINK_PUNT.classList.add("hide"); },
    onLeaveBack: () => { LINK_PUNT.classList.remove("hide"); },
  });

  // quan entres a #ciutat-venda, ocultes l'enllaç a #cost-viure
  ScrollTrigger.create({
    scroller: MAIN,
    trigger: CIUTAT,
    start: "top center",
    onEnter: () => { LINK_COST.classList.add("hide"); },
    onLeaveBack: () => { LINK_COST.classList.remove("hide"); },
  });

  // quan entres a #cronologia, ocultes l'enllaç a #ciutat-venda
  ScrollTrigger.create({
    scroller: MAIN,
    trigger: CRONO,
    start: "top center",
    onEnter: () => { LINK_CIUTAT.classList.add("hide"); },
    onLeaveBack: () => { LINK_CIUTAT.classList.remove("hide"); },
  });
}