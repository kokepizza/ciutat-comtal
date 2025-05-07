gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase);

CustomEase.create("scrollEase", "M0,0 C0.2,0 0.1,1 1,1");

export function initGlobalAnimations() {
  initSPI();
  initHFColor();
  initSectionsNav();
  openModal();
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

let originalCronologiaTitle = null;

// omple el modal amb les dades de l'any seleccionat
function updateModalWithYearData(data) {
  // canvia l'any
  const yearModal = document.querySelector(".year-modal");
  if (yearModal) yearModal.textContent = data.año;

  // NUEVO: actualiza el h2 de la cronología
  const cronologiaTitle = document.querySelector("#cronologia .title h2");
  if (cronologiaTitle) {
    if (originalCronologiaTitle === null) {
      originalCronologiaTitle = cronologiaTitle.textContent;
    }
    cronologiaTitle.textContent = data.año;
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
function openModal() {
  const modal = document.querySelector(".modal-years");
  const yearButtons = document.querySelectorAll("button.year");
  const closeModal = document.querySelector(".close-modal");
  const header = document.querySelector(".pages");
  const main = document.querySelector("main");

  if (!modal || !closeModal) return;

  // deshabilito el header
  function disableInteraction() {
    header.style.pointerEvents = "none";
    modal.style.pointerEvents = "auto";
    closeModal.style.pointerEvents = "auto";
    main.style.overflowY = "hidden";
  }

  // restauro els pointerEvents
  function enableInteraction() {
    header.style.pointerEvents = "";
    modal.style.pointerEvents = "";
    closeModal.style.pointerEvents = "";
    main.style.overflowY = "";
  }

  yearButtons.forEach(button => {
    button.addEventListener("click", async () => {
      // carrego .json i actualitzo el modal
      const yearIndex = parseInt(button.getAttribute("data-year"), 10) - 1;
      const data = await fetchYearsData();
      if (data[yearIndex]) {
        updateModalWithYearData(data[yearIndex]);
      }
      modal.classList.remove("hidden");
      setTimeout(() => {
        modal.classList.add("open");
        disableInteraction();
      });
    });
  });

  closeModal.addEventListener("click", () => {
    modal.classList.remove("open");
    setTimeout(() => {
      modal.classList.add("hidden");
      enableInteraction();
      // Restaurar el texto original del h2 de cronologia
      const cronologiaTitle = document.querySelector("#cronologia .title h2");
      if (cronologiaTitle && originalCronologiaTitle !== null) {
        cronologiaTitle.textContent = originalCronologiaTitle;
        originalCronologiaTitle = null;
      }
    });
  });
}

// animació de la reflexió final
function initReflexioAnimation() {
  const MAIN = document.querySelector("main");
  const SECTION = document.querySelector("#reflexio");
  const H2 = document.querySelector("#reflexio h2");
  if (!SECTION || !H2) return;

  // Estado inicial
  gsap.set(H2, { 
    autoAlpha: 0, 
    scale: 0.4, 
    filter: "blur(4rem)" 
  });

  gsap.to(H2, {
    autoAlpha: 1,
    scale: 1,
    filter: "blur(0px)",
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