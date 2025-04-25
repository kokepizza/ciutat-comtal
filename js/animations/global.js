gsap.registerPlugin( ScrollTrigger, ScrollToPlugin, CustomEase );

const SPI = document.querySelector(".scroll-pi");

const updateSPI = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  let scrollPercent = (scrollTop / docHeight) * 100;

  // limitar entre 0 i 100
  scrollPercent = Math.max(0, Math.min(scrollPercent, 100));

  // string amb 2 decimals + 5 caracteres con 0 esquerra + cambia "." por la ","
  const scrollValue = scrollPercent.toFixed(2).padStart(5, '0').replace('.', ',');
  if (SPI) {
    SPI.textContent = `${scrollValue}%`;
  }
};

updateSPI();
window.addEventListener("scroll", updateSPI);

// canvi de color del header i footer
const sections = document.querySelectorAll('.content');
const header = document.querySelector('.header');
const footer = document.querySelector('.footer');

sections.forEach(section => {
  const color = section.dataset.color;
  
  ScrollTrigger.create({
    trigger: section,
    start: "top 5%",
    end: "bottom 95%",
    onEnter: () => {
      gsap.to([header, footer], {
        backgroundColor: color
      });
    },
    onEnterBack: () => {
      gsap.to([header, footer], {
        backgroundColor: color
      });
    }
  });
});