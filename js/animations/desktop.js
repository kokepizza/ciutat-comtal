export function initDesktopAnimations() {}

const initHFColor = () => {
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    const MAIN = document.querySelector("main");
    
    document.querySelectorAll(".content[data-color]").forEach(colorElement => {
      const color = colorElement.dataset.color;
  
      ScrollTrigger.create({
        trigger: colorElement,
        start: "top 60%",
        end: "bottom 60%",
        scroller: MAIN,
        markers: true,
        onEnter: () => {
          header.style.backgroundColor = color;
          footer.style.backgroundColor = color;
        },
        onEnterBack: () => {
          header.style.backgroundColor = color;
          footer.style.backgroundColor = color;
        },
      });
    });
  }