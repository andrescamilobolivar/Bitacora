document.addEventListener('DOMContentLoaded', () => {
    
    // Delegación de eventos nativa para las tarjetas
    document.addEventListener('click', (event) => {
        
        // 1. Tarjeta SVG
        const svgCard = event.target.closest('.card-svg');
        if (svgCard) {
            const svgNode = svgCard.querySelector('svg');
            if (svgNode) {
                // Emitir evento personalizado. Si no hay modal en el DOM, ocurre silenciosamente.
                window.dispatchEvent(new CustomEvent('open-modal-svg', {
                    detail: { html: svgNode.outerHTML }
                }));
            }
        }

        // 2. Tarjeta iFrame
        const iframeCard = event.target.closest('.card-iframe');
        if (iframeCard) {
            const iframeNode = iframeCard.querySelector('iframe');
            if (iframeNode) {
                window.dispatchEvent(new CustomEvent('open-modal-iframe', {
                    detail: { src: iframeNode.src }
                }));
            }
        }
    });
});
