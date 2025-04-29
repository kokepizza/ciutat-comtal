gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase);

// Scroll Progress Indicator
const initSPI = () => {
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
const initHFColor = () => {
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  const MAIN = document.querySelector("main");
  const root = document.documentElement;
  
  // establir el color i el tema
  const setTheme = (color, theme) => {
    header.style.backgroundColor = color;
    footer.style.backgroundColor = color;
    
    if (theme === "dark") {
      root.style.setProperty('--text', '#F5F5F5');
      root.style.setProperty('--bg', '#1D1D1B');
    } else {
      root.style.setProperty('--text', '#1d1d1b');
      root.style.setProperty('--bg', '#F5F5F5');
    }
  };

  document.querySelectorAll(".content[data-color]").forEach(colorElement => {
    const color = colorElement.dataset.color;
    const theme = colorElement.dataset.theme;

    ScrollTrigger.create({
      trigger: colorElement,
      start: "top top",
      end: "bottom 80%",
      scrub: 1,
      scroller: MAIN,
      onEnter: () => setTheme(color, theme),
      onEnterBack: () => setTheme(color, theme)
    });
  });
};

initSPI();
initHFColor();