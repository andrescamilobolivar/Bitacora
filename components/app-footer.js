class AppFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                footer {
                    background-color: var(--nav-bg, #fff);
                    border-top: 1px solid var(--nav-border, #ddd);
                    padding: 1.5rem;
                    text-align: center;
                    color: var(--text-color, #333);
                    margin-top: auto;
                }
            </style>
            <footer>
                <p>&copy; ${new Date().getFullYear()} - PUJ - Facultad de Arquitectura y Diseño - Modelamiento Dinámico</p>
            </footer>
        `;
    }
}

customElements.define('app-footer', AppFooter);
