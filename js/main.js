document.addEventListener("DOMContentLoaded", () => {

  // --- 1. DETECCIÓN AUTOMÁTICA DE LA PÁGINA ACTIVA ---
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-menu .nav-item");

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");
    
    // Asigna "active" si la URL termina en el enlace o si es la raíz '/'
    if (
      currentPath.endsWith(linkPath) ||
      (currentPath.endsWith("/") && linkPath === "index.html")
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // --- 2. CONTROL DEL MODO LIGHT / DARK CON LOCALSTORAGE ---
  const themeToggleBtn = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");

  // Aplicar tema guardado previamente (si existe)
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    let newTheme = "dark";

    if (currentTheme === "dark") {
      newTheme = "light";
    }

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });

});