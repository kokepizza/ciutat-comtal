/* ARCHIVO PRINCIPAL DE JAVASCRIPT */
console.log("JavaScript carregat correctament.");

import { initGlobalAnimations } from './animations/global.js';
initGlobalAnimations();

// Debounce resize function
let mobile = window.matchMedia("(max-width: 900px)").matches;
let time = null;

window.addEventListener("resize", function() {
  clearTimeout(time);
  time = setTimeout(() => {
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    if (isMobile !== mobile) {
      window.location.reload();
    }
    mobile = isMobile;
  }, 200); // temps d'espera després del darrer resize
});

if (window.matchMedia("(max-width: 900px)").matches) {
  import('./animations/mobile.js').then((module) => {
    module.initMobileAnimations();
  });
  
} else {
  import('./animations/desktop.js').then((module) => {
    module.initDesktopAnimations();
  });
}