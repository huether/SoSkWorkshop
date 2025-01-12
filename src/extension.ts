import * as vscode from 'vscode';
// Import PromodoroTimer and PromodoroSettings

export function activate(context: vscode.ExtensionContext) {

    // 1. Create Status Bar Item and add command

    // 2. Fetch Settings and save in PromodoroSettings object (default values: workDuration = 25, breakDuration = 5)

    // 3. Create PromodoroTimer object with Status Bar Item and Settings

    // 4. Register Toggle Timer Command with correct callback

    // 5. Push Status Bar Item and Command to Context Subscription

    // 6. Add Change Event for Settings
    
}

export function deactivate() { }