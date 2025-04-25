gsap.registerPlugin( ScrollTrigger, ScrollToPlugin, CustomEase );

const scrollPI = document.querySelector(".scroll-pi");

  if (scrollPI) {

    const updateSPI = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      // string amb 2 decimals + 5 caracteres con 0 esquerra + cambia "." por la ","
      const scrollValue = scrollPercent.toFixed(2).padStart(5, '0').replace('.', ',');
      scrollPI.textContent = `${scrollValue}%`;
    };
    
    updateSPI();
    window.addEventListener("scroll", updateSPI);
  }



// hacerlo con GSAP
const sections = document.querySelectorAll('.section');
const header = document.querySelector('.header');
const footer = document.querySelector('.footer');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
        const color = entry.target.dataset.color;
        header.style.backgroundColor = color;
        footer.style.backgroundColor = color;
      }
    });
  },
  {
    threshold: [.95]
  }
);

sections.forEach(section => observer.observe(section));