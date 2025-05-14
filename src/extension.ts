/*
 *   Copyright (c) 2025 Kevin W.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "auto-copyright" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('auto-copyright.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Auto Copyright!');
	});

	context.subscriptions.push(disposable);

	// Listener für das Öffnen von Textdokumenten
	const header = `/*\n *   Copyright (c) 2025 NAME.\n *   All rights reserved.\n *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.\n */\n\n`;
	const supportedLanguages = [
		'html', 'css', 'javascript', 'sass', 'scss',
		'php', 'blade', 'typescript', 'vue', 'javascriptreact', 'typescriptreact',
		'python', 'java', 'c', 'cpp', 'markdown', 'ruby', 'go', 'shellscript', 'json', 'yaml', 'xml'
	];

	function getHeader(languageId: string, document?: vscode.TextDocument): string {
		const config = vscode.workspace.getConfiguration();
		const name = config.get<string>('autoCopyright.name', 'NAME');
		const year = config.get<string>('autoCopyright.year', '2025');
		const copyrightText = config.get<string>('autoCopyright.text', 'All rights reserved.\nUnauthorized copying, modification, distribution, or use of this is prohibited without express written permission.');
		const fullText = `Copyright (c) ${year} ${name}.\n${copyrightText}`;
		if ([
			'html', 'vue', 'xml', 'markdown'
		].includes(languageId)) {
			return `<!--\n  ${fullText.replace(/\n/g, '\n  ')}\n-->\n\n`;
		} else if ([
			'css', 'sass', 'scss', 'php', 'blade', 'typescript', 'java', 'c', 'cpp'
		].includes(languageId)) {
			return `/*\n *   ${fullText.replace(/\n/g, '\n *   ')}\n */\n\n`;
		} else if ([
			'javascript', 'javascriptreact', 'typescriptreact', 'go', 'shellscript', 'ruby'
		].includes(languageId)) {
			return fullText.split('\n').map(line => `// ${line}`).join('\n') + '\n\n';
		} else if (languageId === 'python') {
			return fullText.split('\n').map(line => `# ${line}`).join('\n') + '\n\n';
		} else if (['json', 'yaml'].includes(languageId)) {
			return `# ${fullText.replace(/\n/g, '\n# ')}\n\n`;
		}
		return '';
	}

	const recentlyCreatedFiles = new Set<string>();

	const insertCopyrightHeader = async (document: vscode.TextDocument) => {
		if (!supportedLanguages.includes(document.languageId)) {
			return;
		}
		if (recentlyCreatedFiles.has(document.uri.fsPath)) {
			recentlyCreatedFiles.delete(document.uri.fsPath);
			return;
		}
		const text = document.getText();
		let header = getHeader(document.languageId, document);
		if (document.languageId === 'php' || document.languageId === 'blade') {
			if (text.startsWith('<?php')) {
				if (text.includes('Copyright (c)')) return;
				header = '<?php\n' + header + text.replace(/^<\?php\n?/, '');
				const edit = new vscode.WorkspaceEdit();
				edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), header);
				await vscode.workspace.applyEdit(edit);
				return;
			}
		}
		if (text.startsWith(header.trim()) || text.includes('Copyright (c)')) {
			return;
		}
		const edit = new vscode.WorkspaceEdit();
		edit.insert(document.uri, new vscode.Position(0, 0), header);
		await vscode.workspace.applyEdit(edit);
	};

	const openListener = vscode.workspace.onDidOpenTextDocument(insertCopyrightHeader);
	const saveListener = vscode.workspace.onDidSaveTextDocument(insertCopyrightHeader);
	const createListener = vscode.workspace.onDidCreateFiles(async (event) => {
		for (const file of event.files) {
			recentlyCreatedFiles.add(file.fsPath);
			const document = await vscode.workspace.openTextDocument(file);
			await insertCopyrightHeader(document);
		}
	});
	context.subscriptions.push(openListener);
	context.subscriptions.push(saveListener);
	context.subscriptions.push(createListener);
}

// This method is called when your extension is deactivated
export function deactivate() {}
