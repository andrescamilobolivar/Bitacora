class AppModalIframe extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
    }

    connectedCallback() {
        this.render();
        window.addEventListener('open-modal-iframe', this.handleOpen);
        
        this.shadowRoot.querySelector('.overlay').addEventListener('click', this.handleClose);
        this.shadowRoot.querySelector('.close-btn').addEventListener('click', this.handleClose);
    }

    disconnectedCallback() {
        window.removeEventListener('open-modal-iframe', this.handleOpen);
    }

    handleOpen(event) {
        const iframe = this.shadowRoot.querySelector('iframe');
        iframe.src = event.detail.src;
        this.shadowRoot.querySelector('.modal').classList.add('open');
        document.addEventListener('keydown', this.handleKeydown);
        document.body.style.overflow = 'hidden';
    }

    handleClose() {
        this.shadowRoot.querySelector('.modal').classList.remove('open');
        this.shadowRoot.querySelector('iframe').src = ''; // Limpia el iframe para detener ejecución
        document.removeEventListener('keydown', this.handleKeydown);
        document.body.style.overflow = '';
    }

    handleKeydown(e) {
        if (e.key === 'Escape') this.handleClose();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .modal {
                    display: none;
                    position: fixed;
                    top: 0; left: 0; width: 100vw; height: 100vh;
                    z-index: 9999;
                }
                .modal.open {
                    display: block;
                }
                .overlay {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: var(--modal-overlay, rgba(0,0,0,0.9));
                }
                .close-btn {
                    position: absolute;
                    top: 15px; right: 25px;
                    background: rgba(0,0,0,0.5);
                    border-radius: 50%;
                    width: 40px; height: 40px;
                    border: none;
                    font-size: 2rem;
                    color: white;
                    cursor: pointer;
                    z-index: 10;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .close-btn:hover { background: rgba(0,0,0,0.8); }
                iframe {
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    border: none;
                }
            </style>
            <div class="modal">
                <div class="overlay">
                    <button class="close-btn">&times;</button>
                    <iframe src="" title="Contenido Fullscreen"></iframe>
                </div>
            </div>
        `;
    }
}

customElements.define('app-modal-iframe', AppModalIframe);
