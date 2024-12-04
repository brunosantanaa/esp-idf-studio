import * as vscode from 'vscode';
import * as path from 'path';
import * as gen_html from './gen_html';
import * as esp from './esp';

/**
 * 
 * @param context 
 */
export function activate(context: vscode.ExtensionContext) {
	// Registrar o comando para abrir a webview
	let disposable = vscode.commands.registerCommand('esp-idf-studio.showConfig', () => {
		Esp32Panel.createOrShow(context.extensionUri);
	});

	context.subscriptions.push(disposable);
}

class Esp32Panel {
	public static currentPanel: Esp32Panel | undefined;
	private static readonly viewType = 'esp32Config';
	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionUri: vscode.Uri;
	private _disposables: vscode.Disposable[] = [];

	/**
	 * 
	 * @param extensionUri 
	 * @returns 
	 */
	public static createOrShow(extensionUri: vscode.Uri) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// Se já tivermos um painel, mostre-o
		if (Esp32Panel.currentPanel) {
			Esp32Panel.currentPanel._panel.reveal(column);
			return;
		}

		// Caso contrário, crie um novo painel
		const panel = vscode.window.createWebviewPanel(
			Esp32Panel.viewType,
			'ESP32-C3 GPIO Configuration',
			column || vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [extensionUri]
			}
		);

		Esp32Panel.currentPanel = new Esp32Panel(panel, extensionUri);
	}

	/**
	 * 
	 * @param panel 
	 * @param extensionUri 
	 */
	private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
		this._panel = panel;
		this._extensionUri = extensionUri;
		this._panel.webview.html = this._getHtmlForWebview();

		// Limpe os recursos quando o painel for fechado
		this._panel.onDidDispose(
			() => {
				Esp32Panel.currentPanel = undefined;
			},
			null,
			this._disposables
		);

		// Lidar com mensagens da webview
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'configurePin':
						this._configurePinModal(message.pin);
						break;
				}
			},
			undefined,
			this._disposables
		);
	}

	/**
	 * 
	 * @param pin 
	 */
	private async _configurePinModal(pin: number) {
		const gpioModes = ['INPUT', 'OUTPUT', 'INPUT_PULLUP', 'INPUT_PULLDOWN'];
		const selectedMode = await vscode.window.showQuickPick(gpioModes, {
			placeHolder: `Configure GPIO${pin} Mode`
		});
		if (selectedMode) {
			vscode.window.showInformationMessage(`Configured GPIO${pin} as ${selectedMode}`);
		}
	}

	/**
	 * 
	 * @returns 
	 */
	private _getHtmlForWebview(): string {
		const logoPath = vscode.Uri.file(path.join(this._extensionUri.fsPath, 'media', 'espressif_logo.svg'));
		const stylePath = vscode.Uri.file(path.join(this._extensionUri.fsPath, 'media', 'styles.css'));
		const scriptsJS = vscode.Uri.file(path.join(this._extensionUri.fsPath, 'media', 'script.js'));

		// Convert to webview URIs
		const logoUri = this._panel.webview.asWebviewUri(logoPath);
		const styleUri = this._panel.webview.asWebviewUri(stylePath);
		const scriptUri = this._panel.webview.asWebviewUri(scriptsJS);

		return gen_html.genChipRepresentation(esp.SupportedESP.ESP32_C3, scriptUri, styleUri, logoUri);;
	}

	/**
	 * 
	 * @param count 
	 * @param position 
	 * @returns 
	 */
	private _createPins(count: number, position: string): string {
		let pins = '';
		for (let i = 0; i < count; i++) {
			const pinClass = position === 'bottom' ? 'esp-pin-ver' : 'esp-pin-hor';
			pins += `<div class="esp-pin ${pinClass}" data-pin="${i}" onclick="configurePin(${i})"></div>`;
		}
		return pins;
	}
}
export function deactivate() { }
