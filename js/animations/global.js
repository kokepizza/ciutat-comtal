const spi = document.querySelector(".scroll-pi");
if (spi) {
  const updateSPI = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // string con 2 decimales + 5 caracteres con 0 izda + cambia "." por la ","
    const scrollValue = scrollPercent.toFixed(2).padStart(5, '0').replace('.', ',');
    spi.textContent = `${scrollValue}%`;
  };
  
  updateSPI();
  window.addEventListener("scroll", updateSPI);
}