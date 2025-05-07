gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase);

CustomEase.create("scrollEase", "M0,0 C0.2,0 0.1,1 1,1");

export function initGlobalAnimations() {
  initSPI();
  initHFColor();
  initSectionsNav();
  openModal();
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

// ScrollTo Sections
function initSectionsNav() {
  const MAIN = document.querySelector("main");
  const LINKS = document.querySelectorAll(".pages a");

  function scrollToSection(e) {
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

// CÀRREGA I ACTUALITZACIÓ DINÀMICA DEL MODAL
let yearsData = null;

async function fetchYearsData() {
  if (yearsData) return yearsData;
  const response = await fetch('data/years.json');
  yearsData = await response.json();
  return yearsData;
}

function updateModalWithYearData(data) {
  // canvia l'any
  const yearModal = document.querySelector(".modal-years .year-modal");
  if (yearModal) yearModal.textContent = data.año;

  // canvia el scr de la imatge i l'alt
  const imgModal = document.querySelector(".modal-years .image-modal img");
  if (imgModal) {
    imgModal.src = data.img;
    imgModal.alt = data.año;
  }

  // canvio les dades
  const lloguer = document.querySelector(".modal-years .lloguer");
  const sou = document.querySelector(".modal-years .sou");
  const cafe = document.querySelector(".modal-years .cafe");
  const menu = document.querySelector(".modal-years .menu");
  if (lloguer) lloguer.textContent = data.lloguer;
  if (sou) sou.textContent = data.sou;
  if (cafe) cafe.textContent = data.cafe;
  if (menu) menu.textContent = data.menu;

  // canvio el text
  const textModal = document.querySelector(".modal-years .text-modal");
  if (textModal) textModal.innerHTML = `<p>${data.texto}</p>`;
}

// obrir / tancar modal i carregar les dades dinàmicament
function openModal() {
  const modal = document.querySelector(".modal-years");
  const yearButtons = document.querySelectorAll("button.year");
  const closeModal = document.querySelector(".close-modal");
  const header = document.querySelector(".pages");

  if (!modal || !closeModal) return;

  // deshabilito el header
  function disablePointerEvents() {
    header.style.pointerEvents = "none";
    modal.style.pointerEvents = "auto";
    closeModal.style.pointerEvents = "auto";
  }

  // restauro els pointerEvents
  function enablePointerEvents() {
    header.style.pointerEvents = "";
    modal.style.pointerEvents = "";
    closeModal.style.pointerEvents = "";
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
        disablePointerEvents();
      });
    });
  });

  closeModal.addEventListener("click", () => {
    modal.classList.remove("open");
    setTimeout(() => {
      modal.classList.add("hidden");
      enablePointerEvents();
    });
  });
}