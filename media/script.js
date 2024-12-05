const vscode = acquireVsCodeApi();

function configurePin(pin) {
    vscode.postMessage({
        command: 'configurePin',
        pin: pin
    });
}

// Zoom Control
let currentZoom = 1;
const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

const content = document.querySelector('.chip-container');
const zoomLevel = document.querySelector('.zoom-level');

function updateZoom() {
    content.style.transform = `scale(${currentZoom})`;
    zoomLevel.textContent = `Zoom: ${Math.round(currentZoom * 100)}%`;
}

function zoomIn() {
    if (currentZoom < MAX_ZOOM) {
        currentZoom += ZOOM_STEP;
        updateZoom();
    }
}

function zoomOut() {
    if (currentZoom > MIN_ZOOM) {
        currentZoom -= ZOOM_STEP;
        updateZoom();
    }
}

function resetZoom() {
    currentZoom = 1;
    updateZoom();
}

// Adiciona o evento de scroll do mouse
content.addEventListener('wheel', (event) => {
    event.preventDefault();
    if (event.deltaY < 0) {
        zoomIn();
    } else {
        zoomOut();
    }

    const scrollSpeed = 0.5;
    content.scrollTop += event.deltaY * scrollSpeed;
}, { passive: false });
