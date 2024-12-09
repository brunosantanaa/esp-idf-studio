import * as esp from './esp';
import * as vscode from 'vscode';
import * as path from 'path';

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

function _createPins(chip: esp.Chip, position: string): string {
    let pins = '';
    let count = 0;
    let pinClass = 'bottom';
    let startId = 0;
    const totalPins = (2 * chip.layout.n_side_pins) + chip.layout.n_bottom_pins;

    if (position === 'left' || position === 'right') {
        count = chip.layout.n_side_pins;
        pinClass = 'esp-pin-hor';
        startId = position === 'left' ? 0 : chip.layout.n_side_pins + chip.layout.n_bottom_pins;
    } else if (position === 'bottom') {
        pinClass = 'esp-pin-ver';
        count = chip.layout.n_bottom_pins;
        startId = chip.layout.n_side_pins;
    }

    for (let i = startId; i < (startId + count); i++) {
        if (position == 'left') {
            pins += `<div class="esp-pin-desc"}"><div class="esp-pin-lable">${chip.pins[i].label}</div><div class="esp-pin ${pinClass} ${_getColorClassPinType(chip.pins[i])}" data-pin="${i}" onclick="configurePin(${i})"></div></div>`;
        } else if (position === 'bottom') {
            pins += `<div class="esp-pin-desc-bottom"}"><div class="esp-pin ${pinClass} ${_getColorClassPinType(chip.pins[i])}" data-pin="${i}" onclick="configurePin(${i})"></div><div class="esp-pin-lable esp-pin-lable-bottom">${chip.pins[i].label}</div></div>`;
        } else { // Right0
            let inverse_i = totalPins - (i - (chip.layout.n_side_pins + chip.layout.n_bottom_pins)) - 1;
            pins += `<div class="esp-pin-desc"}"><div class="esp-pin ${pinClass} ${_getColorClassPinType(chip.pins[inverse_i])}" data-pin="${inverse_i}" onclick="configurePin(${inverse_i})"></div><div class="esp-pin-lable">${chip.pins[inverse_i].label}</div></div>`;
        }
    }
    return pins;
}

function _getColorClassPinType(pin: esp.Pin) {
    if (pin.type == esp.PinType.GND) {
        return 'esp-pin-gnd';
    } else if (pin.type == esp.PinType.VCC) {
        return 'esp-pin-vcc';
    } else if (pin.type == esp.PinType.NC || pin.type == esp.PinType.SYS) {
        return 'esp-pin-sp';
    }
    return '';
}
function _createChip(chip: esp.SupportedESP, iconUri: vscode.Uri): string {
    const chip_esp = esp.modules.find(item => item.reference === chip);
    if (!chip_esp) {
        return `<div class="esp-board">chip not found</div>`;
    }
    return `
	<div class="esp-board-pins-container">
		<div class="esp-pin-container esp-pin-container-l">
			${_createPins(chip_esp, 'left')}
		</div>
		<div class="board-support-container">
			<div class="esp-board">
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
				<div class="esp-shild">
					<div class="esp-logo">
						<img src="${iconUri}" alt="Espressif Logo">
						<div class="esp-model">${chip_esp.reference}</div>
					</div>
				</div>
			</div>
			<div class="esp-board-bottom-pins">
				${_createPins(chip_esp, 'bottom')}
			</div>
		</div>
		<div class="esp-pin-container esp-pin-container-r">
			${_createPins(chip_esp, 'right')}
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

export function genChipRepresentation(chip: esp.SupportedESP, extensionUri: vscode.Uri, panel: vscode.WebviewPanel): string {
    const logoPath = vscode.Uri.file(path.join(extensionUri.fsPath, 'media', 'espressif_logo.svg'));
    const stylePath = vscode.Uri.file(path.join(extensionUri.fsPath, 'media', 'styles.css'));
    const scriptsJS = vscode.Uri.file(path.join(extensionUri.fsPath, 'media', 'script.js'));

    // Convert to webview URIs
    const logoUri = panel.webview.asWebviewUri(logoPath);
    const styleUri = panel.webview.asWebviewUri(stylePath);
    const scriptUri = panel.webview.asWebviewUri(scriptsJS);

    return _createHeader(styleUri) + _createChip(chip, logoUri) + _createFooter(scriptUri);
}