export function initDesktopAnimations() {
  console.log("Init animacions d'escriptori");
  
  animateTitles();
  initYearsAnimation();
  initArticlesNav();
  initGraphsButton();
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
  const NOTES_MENU = document.querySelector("#notes-menu");
  const CRONO = document.querySelector("#cronologia");

  function scrollToArticle(e) {
    e.preventDefault();
    const HREF = this.getAttribute("href");
    const TARGET = document.querySelector(HREF);
    if (!TARGET) return;

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
        LINKS.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      },
      onEnterBack: () => {
        LINKS.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  });

  // oculta #notes-menu quan entres a #cronologia
  function hideNotes() {
    if (!NOTES_MENU || !CRONO) return;

    ScrollTrigger.create({
      scroller: MAIN,
      trigger: CRONO,
      start: "top top",
      onEnter: () => { NOTES_MENU.classList.add("hide"); },
      onLeaveBack: () => { NOTES_MENU.classList.remove("hide"); },
    });
  }

  hideNotes();
}

// animació dels .title h2
function animateTitles() {

  document.querySelectorAll('.title h2').forEach(h2 => {
    gsap.set(h2, { scaleY: 3, transformOrigin: "top" });

    const colsestH2 = h2.closest('article, section');
    const MAIN = document.querySelector("main");

    gsap.to(h2, {
      scaleY: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: colsestH2,
        scroller: MAIN,
        start: "top top",
        end: "bottom 90%",
        scrub: true
      }
    });
  });
}

// animació botó gràfiques #cronologia
function initGraphsButton() {
  const BUTTON = document.querySelector(".graphs-button");
  const CRONO = document.querySelector("#cronologia");
  const MAIN = document.querySelector("main");

  if (!BUTTON || !CRONO) return;

  gsap.set(BUTTON, { autoAlpha: 0, y: 100 });

  gsap.to(BUTTON, {
    autoAlpha: 1,
    y: 0,
    duration: 0.5,
    ease: "power2.out",

    scrollTrigger: {
      trigger: CRONO,
      scroller: MAIN,
      start: "70% 70%",
      end: "top top",
      scrub: true,
    }
  });
}