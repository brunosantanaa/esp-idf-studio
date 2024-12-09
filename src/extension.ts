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
	// Verifica se a view está visível
	const view = vscode.window.createTreeView('esp-idf-config', {
		treeDataProvider: new class implements vscode.TreeDataProvider<any> {
			getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
				return element;
			}
			getChildren(element?: any): vscode.ProviderResult<any[]> {
				return [];
			}
		}
	});

	// Executa o comando showConfig quando a view for criada
	if (view.visible) {
		vscode.commands.executeCommand('esp-idf-studio.showConfig');
	}

	// Adiciona um listener para quando a view se tornar visível
	context.subscriptions.push(
		view.onDidChangeVisibility(() => {
			if (view.visible) {
				vscode.commands.executeCommand('esp-idf-studio.showConfig');
			}
		})
	);
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
		this._panel.webview.html = gen_html.genChipRepresentation(esp.SupportedESP.ESP32_C3, this._extensionUri, this._panel);

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

}
export function deactivate() { }
