gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, CustomEase);

const SPI = document.querySelector(".scroll-pi");
const SPI_BAR = document.querySelector(".scroll-pi-bar");
const MAIN = document.querySelector("main");

let ticking = false;

const updateSPI = () => {
  if (!MAIN) return;
  const scrollTop = MAIN.scrollTop;
  const docHeight = MAIN.scrollHeight - MAIN.clientHeight;
  let scrollPercent = (scrollTop / docHeight) * 100;

  // per que pugui arribar al 100%
  if (scrollTop + 1 >= docHeight) {
    scrollPercent = 100;
  }
  scrollPercent = Math.max(0, Math.min(scrollPercent, 100));

  const scrollValue = scrollPercent.toFixed(2).padStart(5, '0').replace('.', ',');
  if (SPI) {
    SPI.textContent = `${scrollValue}%`;
  }
  if (SPI_BAR) {
    SPI_BAR.style.transform = `translateX(${scrollPercent - 100}%)`;
  }

  ticking = false;
};

const onMainScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(updateSPI);
    ticking = true;
  }
};

updateSPI();
if (MAIN) {
  MAIN.addEventListener("scroll", onMainScroll);
}