/* ARCHIVO PRINCIPAL DE JAVASCRIPT */
console.log("JavaScript carregat correctament.");

import { initGlobalAnimations } from './animations/global.js';
initGlobalAnimations();

if (window.matchMedia("(max-width: 900px)").matches) {
  import('./animations/mobile.js').then((module) => {
    module.initMobileAnimations();
  });
  
} else {
  import('./animations/desktop.js').then((module) => {
    module.initDesktopAnimations();
  });
}