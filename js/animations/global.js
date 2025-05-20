gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase);

CustomEase.create("scrollEase", "M0,0 C0.4,0.201 0.293,1 1,1");

export function initGlobalAnimations() {
  initSPI();
  initHFColor();
  initSectionsNav();
  openYearsModal();
  openGraphsModal();
  initReflexioAnimation();
}

// Scroll Progress Indicator
function initSPI() {
  const SPI = document.querySelector(".scroll-pi");
  const SPI_BAR = document.querySelector(".scroll-pi-bar");
  const MAIN = document.querySelector("main");

  function updateSPI() {
    if (!MAIN) return;
    const scrollTop = MAIN.scrollTop;
    const docHeight = MAIN.scrollHeight - MAIN.clientHeight;

    // percentatge d'scroll (scroll actual / altura total possible) * 100
    let percent = docHeight === 0 ? 100 : Math.min(100, (scrollTop / docHeight) * 100);

    // converteix el número a un string amb 2 decimals i el separa per comes
    const scrollValue = percent.toFixed(2).padStart(5, '0').replace('.', ',');

    // actualitza el valor i el desplaçament de la barra d'SPI
    if (SPI) SPI.textContent = `${scrollValue}%`;
    if (SPI_BAR) SPI_BAR.style.transform = `translateX(${percent - 100}%)`;
  }

  if (MAIN) {
    MAIN.addEventListener("scroll", () => requestAnimationFrame(updateSPI));
    updateSPI();
  }
}

// Header & Footer Background-Color Animation
function initHFColor() {
  const HEADER = document.querySelector("header");
  const FOOTER = document.querySelector("footer");
  const MAIN = document.querySelector("main");
  const ROOT = document.documentElement;
  const colorElements = document.querySelectorAll(".content[data-color]");
  
  // establir el color i el tema
  function setColors(color, theme) {
    HEADER.style.backgroundColor = color;
    FOOTER.style.backgroundColor = color;
    document.documentElement.style.backgroundColor = color; // aplicat també al html per que es canvïi el color de les franges superior i inferior del mòvil

    if (theme === "dark") {
      ROOT.style.setProperty('--text', '#F5F5F5');
      ROOT.style.setProperty('--bg', '#1D1D1B');
    } else {
      ROOT.style.setProperty('--text', '#1d1d1b');
      ROOT.style.setProperty('--bg', '#F5F5F5');
    }
  }

  colorElements.forEach(function(colorElement) {
    const COLOR = colorElement.dataset.color;
    const THEME = colorElement.dataset.theme;

      ScrollTrigger.create({
        scroller: MAIN,
        trigger: colorElement,
        start: "top top",
        scrub: true,
        onEnter: function() { setColors(COLOR, THEME); },
        onEnterBack: function() { setColors(COLOR, THEME); }
      });
  });
}

// ScrollTo Plugin
function initSectionsNav() {
  const MAIN = document.querySelector("main");
  const LINKS = document.querySelectorAll(".pages a");

  function scrollToSection(e) {
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
    link.addEventListener("click", scrollToSection);
  });

  // actualitza l'estat de pages
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
}

// CÀRREGA I ACTUALITZACIÓ DINÀMICA DEL MODAL
let yearsData = null;

// demano les dades dels anys al JSON
async function fetchYearsData() {
  if (yearsData) return yearsData;
  const response = await fetch('data/years.json');
  yearsData = await response.json();
  return yearsData;
}

let originalTitle = null;

// omple el modal amb les dades de l'any seleccionat
function updateModalData(data) {
  // canvia l'any
  const yearModal = document.querySelector(".year-modal");
  if (yearModal) yearModal.textContent = data.año;

  // actualitza el h2 de la cronologia
  const title = document.querySelector("#cronologia .title h2");
  if (title) {
    if (originalTitle === null) {
      originalTitle = title.textContent;
    }
    title.textContent = data.año;
  }

  // canvia el scr de la imatge i l'alt
  const imgModal = document.querySelector(".modal-years .image-modal img");
  if (imgModal) {
    imgModal.src = data.img;
    imgModal.alt = data.año;
  }

  // canvio les dades
  const lloguer = document.querySelector(".lloguer");
  const sou = document.querySelector(".sou");
  const cafe = document.querySelector(".cafe");
  const menu = document.querySelector(".menu");
  if (lloguer) lloguer.textContent = data.lloguer;
  if (sou) sou.textContent = data.sou;
  if (cafe) cafe.textContent = data.cafe;
  if (menu) menu.textContent = data.menu;

  // canvio el text
  const textModal = document.querySelector(".text-modal");
  if (textModal) textModal.innerHTML = `<p>${data.texto}</p>`;
}

// obrir i tancar modal i carregar les dades dinàmicament
function openYearsModal() {
  const MODAL = document.querySelector(".modal-years");
  const YEARS = document.querySelectorAll("button.year");
  const CLOSE = document.querySelector(".close-modal");
  const HEADER = document.querySelector(".pages");
  const MAIN = document.querySelector("main");
  const BUTTON = document.querySelector(".graphs-button");

  if (!MODAL || !CLOSE) return;

  // deshabilito el header per evitar scrolls
  function disableInteraction() {
    HEADER.style.pointerEvents = "none";
    MODAL.style.pointerEvents = "auto";
    CLOSE.style.pointerEvents = "auto";
    MAIN.style.overflowY = "hidden";
    BUTTON.style.display = "none"; // oculto el botó de gráficas
  }

  // restauro els pointerEvents
  function enableInteraction() {
    HEADER.style.pointerEvents = "";
    MODAL.style.pointerEvents = "";
    CLOSE.style.pointerEvents = "";
    MAIN.style.overflowY = "";
    BUTTON.style.display = ""; 
  }

  YEARS.forEach(button => {
    button.addEventListener("click", async () => {
      // carrego .json i actualitzo el modal
      const yearIndex = parseInt(button.getAttribute("data-year"), 10) - 1;
      const data = await fetchYearsData();
      if (data[yearIndex]) {
        updateModalData(data[yearIndex]);

        const elements = [
          document.querySelector(".lloguer"),
          document.querySelector(".sou"),
          document.querySelector(".cafe"),
          document.querySelector(".menu")
        ];
        
        // animació de les dades
        const tl = gsap.timeline();
        elements.forEach((el, i) => {
          if (el) {
            tl.fromTo(el,
              { autoAlpha: 0, y: 30 },
              { autoAlpha: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" },
              i * 0.4 // delay per cada un
            );
          }
        });
      }
      MODAL.classList.remove("hidden");
      setTimeout(() => {
        MODAL.classList.add("open");
        disableInteraction();
      });
    });
  });

  CLOSE.addEventListener("click", () => {
    MODAL.classList.remove("open");
    setTimeout(() => {
      MODAL.classList.add("hidden");
      enableInteraction();

      // restaurar el text original del h2 de cronologia
      const title = document.querySelector("#cronologia .title h2");
      if (title && originalTitle !== null) {
        title.textContent = originalTitle;
        originalTitle = null;
      }
    });
  });
}

// animació reflexió final
function initReflexioAnimation() {
  const MAIN = document.querySelector("main");
  const SECTION = document.querySelector("#reflexio");
  const H2 = document.querySelector("#reflexio h2");
  if (!SECTION || !H2) return;

  gsap.set(H2, { 
    autoAlpha: 0, 
    scale: 0.4, 
    filter: "blur(4rem)",
    WebkitBackdropFilter: "blur(4rem)",
    xPercent: -50,
    yPercent: -50
  });

  gsap.to(H2, {
    autoAlpha: 1,
    scale: 1,
    filter: "blur(0px)",
    WebkitBackdropFilter: "blur(0px)",
    ease: "power3.out",
    scrollTrigger: {
      trigger: SECTION,
      scroller: MAIN,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    }
  });
}

// obrir i tancar el modal de les gràfiques
function openGraphsModal() {
  const GRAPHS = document.querySelector(".modal-graphs");
  const BUTTON = document.querySelector(".graphs-button");
  const CLOSE = document.querySelector(".close-graphs");
  const HEADER = document.querySelector(".pages");
  const MAIN = document.querySelector("main");

  if (!GRAPHS || !BUTTON || !CLOSE) return;

  function disableInteractionGraphs() {
    HEADER.style.pointerEvents = "none";
    GRAPHS.style.pointerEvents = "auto";
    CLOSE.style.pointerEvents = "auto";
    MAIN.style.overflowY = "hidden";
    BUTTON.style.display = "none";
  }

  function enableInteractionGraphs() {
    HEADER.style.pointerEvents = "";
    GRAPHS.style.pointerEvents = "";
    CLOSE.style.pointerEvents = "";
    MAIN.style.overflowY = "";
    BUTTON.style.display = "";
  }

  BUTTON.addEventListener("click", () => {
    GRAPHS.classList.remove("hidden");
    setTimeout(() => {
      GRAPHS.classList.add("open");
      disableInteractionGraphs();
    });

    document.querySelectorAll('.toggle-svg').forEach(toggle => {
      const graphClass = toggle.dataset.graph;
      const path = document.querySelector(`.${graphClass}`);
      if (path) {
        path.style.display = toggle.checked ? '' : 'none';
      }
    });
  });

  CLOSE.addEventListener("click", () => {
    GRAPHS.classList.remove("open");
    setTimeout(() => {
      GRAPHS.classList.add("hidden");
      enableInteractionGraphs();
    });
  });

  // escolta el check dels checkboxes per mostrar la gràfica corresponent
  document.querySelectorAll('.toggle-svg').forEach(toggle => {
    toggle.addEventListener('change', function() {
      const graphClass = this.dataset.graph;
      const path = document.querySelector(`.${graphClass}`);
      if (path) {
        path.style.display = this.checked ? '' : 'none';
      }
    });
  });
}