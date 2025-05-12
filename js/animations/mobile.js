export function initMobileAnimations() {

  console.log("Init animacions de mòvil");

  initMobileMenu();
}

function initMobileMenu() {
  const TOGGLE = document.querySelector(".toggle-menu");
  const PAGES = document.querySelector(".pages");
  const ITEMS = document.querySelectorAll(".pages li");
  const line1 = document.querySelector(".line-1");
  const line2 = document.querySelector(".line-2");
  const line3 = document.querySelector(".line-3");
  
  // config GSAP al menú
  if (TOGGLE && PAGES) {

    // items i menú ocults incialment
    gsap.set(PAGES, { 
      opacity: 0,
      backdropFilter: "blur(0px)",
    });
    
    gsap.set(ITEMS, { x: 100, opacity: 0 });
    
    // TIMELINE MENÚ
    const menuTL = gsap.timeline({ paused: true });
    
    // primer animo el blur
    menuTL.to(PAGES, { 
      opacity: 1, 
      backdropFilter: "blur(10px)",
      duration: 0.5,
      ease: "power2.out"
    });
    
    // entrada dels items amb stagger i que comenci 0.2 abans que acabi l'animació del blur
    menuTL.to(ITEMS, { 
      x: 0, 
      opacity: 1, 
      stagger: 0.1,
      duration: 0.4,
      ease: "back.out(1.2)"
    }, "-=0.2");
    
    // TIMELINE BOTÓ
    const buttonTL = gsap.timeline({ paused: true });
    
    // transformo les linees en una X
    buttonTL
      .to(line2, { 
        opacity: 0, 
        duration: 0.2,
        ease: "power1.out" 
      }, 0)
      .to(line1, { 
        y: 5, 
        rotation: 135, 
        transformOrigin: "center", 
        duration: 0.7,
        ease: "back.out(1.7)" 
      }, 0)
      .to(line3, { 
        y: -5, 
        rotation: -135, 
        transformOrigin: "center", 
        duration: 0.7,
        ease: "back.out(1.7)" 
      }, 0);
    

    TOGGLE.addEventListener("click", () => {

      if (PAGES.classList.contains("active")) {
        menuTL.timeScale(2).reverse();
        buttonTL.timeScale(2).reverse();
        setTimeout(() => {
          PAGES.classList.remove("active");
        }, 400);

      } else {
        PAGES.classList.add("active");
        menuTL.timeScale(1).play();
        buttonTL.timeScale(1).play();
      }
    });

    // tancar menú al fer clic en un ITEM amb el reverse x2 per que es pugui veure el ScrollTo
    ITEMS.forEach(item => {
      item.addEventListener("click", () => {
        if (PAGES.classList.contains("active")) {
          menuTL.timeScale(2).reverse();
          buttonTL.timeScale(2).reverse();
          setTimeout(() => {
            PAGES.classList.remove("active");
          }, 400);
        }
      });
    });
  }
}