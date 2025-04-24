export function initMobileAnimations() {

  const toggleMenu = document.querySelector(".toggle-menu");
  const pagesMenu = document.querySelector(".pages");
  const menuItems = document.querySelectorAll(".pages li");
  const line1 = document.querySelector(".line-1");
  const line2 = document.querySelector(".line-2");
  const line3 = document.querySelector(".line-3");
  
  // config GSAP al menú
  if (toggleMenu && pagesMenu) {

    // items i menú ocults incialment
    gsap.set(pagesMenu, { 
      opacity: 0,
      backdropFilter: "blur(0px)",
      webkitBackdropFilter: "blur(0px)"
    });
    
    gsap.set(menuItems, { x: 100, opacity: 0 });
    
    // TIMELINE MENÚ
    const menuTL = gsap.timeline({ paused: true });
    
    // primer animo el blur
    menuTL.to(pagesMenu, { 
      opacity: 1, 
      backdropFilter: "blur(10px)",
      webkitBackdropFilter: "blur(10px)",
      duration: 0.5,
      ease: "power2.out"
    });
    
    // entrada dels items amb stagger i que comenci 0.2 abans que acabi l'animació del blur
    menuTL.to(menuItems, { 
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
    

    toggleMenu.addEventListener("click", () => {
      
      if (pagesMenu.classList.contains("active")) {
        menuTL.reverse();
        buttonTL.reverse();
        setTimeout(() => {
          pagesMenu.classList.remove("active");
        }, 800);

      } else {
        pagesMenu.classList.add("active");
        menuTL.play();
        buttonTL.play();
      }
    });
  }
}