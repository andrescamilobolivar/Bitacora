class AppModalSvg extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Estado interno para el Zoom y Paneo
        this.scale = 1;
        this.pointX = 0;
        this.pointY = 0;
        this.panning = false;
        this.startX = 0;
        this.startY = 0;

        // Bindeo de contexto para eventos
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.handlePointerDown = this.handlePointerDown.bind(this);
        this.handlePointerMove = this.handlePointerMove.bind(this);
        this.handlePointerUp = this.handlePointerUp.bind(this);
        this.zoomIn = this.zoomIn.bind(this);
        this.zoomOut = this.zoomOut.bind(this);
        this.resetZoom = this.resetZoom.bind(this);
    }

    connectedCallback() {
        this.render();
        
        // Escucha evento global para abrir el modal
        window.addEventListener('open-modal-svg', this.handleOpen);
        
        // Eventos de cierre
        this.shadowRoot.querySelector('.overlay').addEventListener('click', this.handleClose);
        this.shadowRoot.querySelector('.close-btn').addEventListener('click', this.handleClose);
        this.shadowRoot.querySelector('.modal-content').addEventListener('click', e => e.stopPropagation());

        // Controles de interfaz (Botones)
        this.shadowRoot.querySelector('.btn-zoom-in').addEventListener('click', this.zoomIn);
        this.shadowRoot.querySelector('.btn-zoom-out').addEventListener('click', this.zoomOut);
        this.shadowRoot.querySelector('.btn-reset').addEventListener('click', this.resetZoom);

        // Eventos en el visor para Zoom (Rueda del ratón) y Paneo (Arrastrar)
        const viewport = this.shadowRoot.querySelector('.svg-viewport');
        viewport.addEventListener('wheel', this.handleWheel, { passive: false });
        viewport.addEventListener('pointerdown', this.handlePointerDown);
        
        // Estos se asocian a window para no perder el tracking si el mouse sale rápido del modal
        window.addEventListener('pointermove', this.handlePointerMove);
        window.addEventListener('pointerup', this.handlePointerUp);
    }

    disconnectedCallback() {
        window.removeEventListener('open-modal-svg', this.handleOpen);
        window.removeEventListener('pointermove', this.handlePointerMove);
        window.removeEventListener('pointerup', this.handlePointerUp);
    }

    /* --- LÓGICA DEL MODAL --- */
    
    handleOpen(event) {
        const container = this.shadowRoot.querySelector('.svg-container');
        container.innerHTML = event.detail.html;
        
        // Aseguramos que el SVG llene su contenedor natural
        const svgNode = container.querySelector('svg');
        if(svgNode) {
            svgNode.style.width = '100%';
            svgNode.style.height = '100%';
        }

        this.resetZoom(); // Reinicia la vista cada vez que se abre
        this.shadowRoot.querySelector('.modal').classList.add('open');
        document.addEventListener('keydown', this.handleKeydown);
        document.body.style.overflow = 'hidden'; // Bloquea scroll de la página de fondo
    }

    handleClose() {
        this.shadowRoot.querySelector('.modal').classList.remove('open');
        this.shadowRoot.querySelector('.svg-container').innerHTML = '';
        document.removeEventListener('keydown', this.handleKeydown);
        document.body.style.overflow = '';
    }

    handleKeydown(e) {
        if (e.key === 'Escape') this.handleClose();
    }

    /* --- LÓGICA DE ZOOM Y PANEO --- */

    updateTransform() {
        const container = this.shadowRoot.querySelector('.svg-container');
        container.style.transform = `translate(${this.pointX}px, ${this.pointY}px) scale(${this.scale})`;
    }

    handleWheel(e) {
        e.preventDefault();
        const delta = Math.sign(e.deltaY) * -0.15;
        this.scale = Math.max(0.5, Math.min(this.scale + delta, 10));
        this.updateTransform();
    }

    handlePointerDown(e) {
        e.preventDefault();
        this.panning = true;
        this.startX = e.clientX - this.pointX;
        this.startY = e.clientY - this.pointY;
        this.shadowRoot.querySelector('.svg-viewport').style.cursor = 'grabbing';
    }

    handlePointerMove(e) {
        if (!this.panning) return;
        e.preventDefault();
        this.pointX = e.clientX - this.startX;
        this.pointY = e.clientY - this.startY;
        this.updateTransform();
    }

    handlePointerUp(e) {
        if (this.panning) {
            this.panning = false;
            this.shadowRoot.querySelector('.svg-viewport').style.cursor = 'grab';
        }
    }

    zoomIn() {
        this.scale = Math.min(this.scale + 0.5, 10);
        this.updateTransform();
    }

    zoomOut() {
        this.scale = Math.max(this.scale - 0.5, 0.5);
        this.updateTransform();
    }

    resetZoom() {
        this.scale = 1;
        this.pointX = 0;
        this.pointY = 0;
        this.updateTransform();
    }

    /* --- RENDER DEL DOM Y CSS --- */

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
                
                /* Contenedor principal ajustado a Pantalla Completa (100vw / 100vh) */
                .modal-content {
                    background: var(--card-bg, #fff);
                    width: 100vw;
                    height: 100vh;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                /* Header del modal flotante */
                .modal-header {
                    position: absolute;
                    top: 0; right: 0; left: 0;
                    padding: 20px 25px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    pointer-events: none;
                    z-index: 10;
                }
                
                .controls {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    pointer-events: auto;
                }
                .btn-control {
                    background: var(--bg-color, #f4f7f6);
                    border: 1px solid var(--card-border, #ddd);
                    color: var(--text-color, #333);
                    border-radius: 4px;
                    width: 40px; height: 40px;
                    font-size: 1.2rem;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    transition: background 0.2s;
                }
                .btn-control:hover {
                    background: var(--primary-color, #007bff);
                    color: white;
                }
                .btn-reset {
                    font-size: 0.9rem;
                    font-weight: bold;
                }
                
                .close-btn {
                    background: rgba(0,0,0,0.5);
                    border-radius: 50%;
                    width: 40px; height: 40px;
                    border: none;
                    font-size: 2rem;
                    color: white;
                    cursor: pointer;
                    pointer-events: auto;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                .close-btn:hover { 
                    background: rgba(0,0,0,0.8); 
                }

                /* Área visible interactiva (Viewport) */
                .svg-viewport {
                    flex: 1;
                    width: 100%;
                    height: 100%;
                    cursor: grab;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                }
                .svg-viewport:active {
                    cursor: grabbing;
                }

                /* Contenedor que realmente sufre la transformación */
                .svg-container {
                    width: 85%;
                    height: 85%;
                    transform-origin: center center;
                }
            </style>
            
            <div class="modal">
                <div class="overlay">
                    <div class="modal-content">
                        
                        <div class="modal-header">
                            <div class="controls">
                                <button class="btn-control btn-zoom-in" title="Acercar">+</button>
                                <button class="btn-control btn-zoom-out" title="Alejar">-</button>
                                <button class="btn-control btn-reset" title="Restaurar">1:1</button>
                            </div>
                            <button class="close-btn" title="Cerrar">&times;</button>
                        </div>

                        <div class="svg-viewport">
                            <div class="svg-container"></div>
                        </div>
                        
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('app-modal-svg', AppModalSvg);
