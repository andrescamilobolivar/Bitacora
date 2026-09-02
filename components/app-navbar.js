class AppNavbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupActiveLink();
        this.setupThemeToggle();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                header {
                    background-color: var(--nav-bg, #fff);
                    border-bottom: 1px solid var(--nav-border, #ddd);
                    padding: 1rem 2rem;
                }
                .navbar-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr; /* Grid 2 columnas */
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .nav-left {
                    display: flex;
                    justify-content: flex-start;
                    gap: 1.5rem;
                }
                .nav-right {
                    display: flex;
                    justify-content: flex-end;
                }
                a {
                    text-decoration: none;
                    color: var(--text-color, #333);
                    font-weight: 500;
                    padding: 0.5rem;
                    transition: color 0.3s;
                }
                a:hover { color: var(--primary-color, #007bff); }
                a.active {
                    color: var(--primary-color, #007bff);
                    border-bottom: 2px solid var(--primary-color, #007bff);
                }
                button.theme-toggle {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                }
                svg {
                    width: 24px;
                    height: 24px;
                    fill: var(--text-color, #333);
                }
            </style>
            <header>
                <nav class="navbar-grid">
                    <div class="nav-left">
                        <a href="index.html" data-path="/index.html">Inicio</a>
                        <a href="modulo1.html" data-path="/modulo1.html">DE</a>
                        <a href="modulo2.html" data-path="/modulo2.html">RT</a>
                        <a href="modulo3.html" data-path="/modulo3.html">SB</a>
                        <a href="modulo4.html" data-path="/modulo4.html">AF</a>
                    </div>
                    <div class="nav-right">
                        <button class="theme-toggle" aria-label="Cambiar Tema">
                            <!-- Icono SVG genérico para tema -->
                            <svg viewBox="0 0 24 24">
                                <path d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm0-16.5c-4.14 0-7.5 3.36-7.5 7.5s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5z"/>
                                <path d="M12 6v12c3.31 0 6-2.69 6-6s-2.69-6-6-6z"/>
                            </svg>
                        </button>
                    </div>
                </nav>
            </header>
        `;
    }

    setupActiveLink() {
        const links = this.shadowRoot.querySelectorAll('a');
        const currentPath = window.location.pathname;
        
        links.forEach(link => {
            // Lógica para resaltar pestaña activa
            if (currentPath.endsWith(link.getAttribute('href')) || (currentPath === '/' && link.getAttribute('href') === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    setupThemeToggle() {
        const toggleBtn = this.shadowRoot.querySelector('.theme-toggle');
        toggleBtn.addEventListener('click', () => {
            const root = document.documentElement;
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

customElements.define('app-navbar', AppNavbar);
