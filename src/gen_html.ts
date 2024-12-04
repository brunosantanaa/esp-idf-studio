import * as esp from './esp';
import * as vscode from 'vscode';

function _createHeader(styleUri: vscode.Uri): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="${styleUri}">
    </head>
    <body>
    <div class="main-container">
        <div class="chip-container">
    `;
}

function _createPins(count: number, position: string): string {
    let pins = '';
    for (let i = 0; i < count; i++) {
        const pinClass = position === 'bottom' ? 'esp-pin-ver' : 'esp-pin-hor';
        pins += `<div class="esp-pin ${pinClass}" data-pin="${i}" onclick="configurePin(${i})"></div>`;
    }
    return pins;
}
function _createChip(chip: esp.SupportedESP, iconUri: vscode.Uri): string {
    const chip_esp = esp.modules.find(item => item.reference === chip);
    if (!chip_esp) {
        return `<div class="esp-board">chip not found</div>`;
    }
    return `<div class="esp-board">
						<div class="esp-antenna">
						<table class="esp-antenna-draw">
							<tr class="esp-antenna-draw-row">
								<td class="esp-antenna-draw-column atn-top-border atn-left-border atn-right-border"></td>
								<td class="esp-antenna-draw-column atn-top-border atn-right-border"></td>
								<td class="esp-antenna-draw-column atn-bottom-border atn-right-border"></td>
								<td class="esp-antenna-draw-column atn-top-border atn-right-border"></td>
								<td class="esp-antenna-draw-column atn-bottom-border atn-right-border"></td>
							</tr>
							<tr class="esp-antenna-draw-row">
								<td class="esp-antenna-draw-column atn-left-border atn-right-border"></td>
								<td class="esp-antenna-draw-column "></td>
								<td class="esp-antenna-draw-column "></td>
								<td class="esp-antenna-draw-column "></td>
								<td class="esp-antenna-draw-column "></td>
							</tr>
						</table>
						</div>
						<div class="esp-board-pins-container">
							<div class="esp-pin-container esp-pin-container-l">
								${_createPins(chip_esp.layout.n_side_pins, 'left')}
							</div>
							<div class="esp-shild">
								<div class="esp-logo">
									<img src="${iconUri}" alt="Espressif Logo">
									<div class="esp-model">ESP32-C3</div>
								</div>
							</div>
							<div class="esp-pin-container esp-pin-container-r">
								${_createPins(chip_esp.layout.n_side_pins, 'right')}
							</div>
						</div>
						<div class="esp-board-bottom-pins">
							${_createPins(chip_esp.layout.n_bottom_pins, 'bottom')}
						</div>
					</div>`;
}

function _createFooter(scriptUri: vscode.Uri): string {
    return `
            </div>
            <div class="zoom-controls">
                <button class="zoom-button" onclick="zoomIn()">+</button>
                <button class="zoom-button" onclick="zoomOut()">-</button>
                <button class="zoom-button" onclick="resetZoom()">↻</button>
                <span class="zoom-level">Zoom: 100%</span>
            </div>
        </div>
        <script src="${scriptUri}"></script>
    </body>
    </html>
    `;
}

export function genChipRepresentation(chip: esp.SupportedESP, scriptUri: vscode.Uri, styleUri: vscode.Uri, iconUri: vscode.Uri): string {
    return _createHeader(styleUri) + _createChip(chip, iconUri) + _createFooter(scriptUri);
}