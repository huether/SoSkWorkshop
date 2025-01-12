import * as vscode from 'vscode';
import { PomodoroTimer } from './pomodoro';
import { PomodoroSettings } from './pomodoro';

export function activate(context: vscode.ExtensionContext) {
    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
    let settings: PomodoroSettings = {
        workDuration: vscode.workspace.getConfiguration('pomodoro').get('workDuration') || 25,
        breakDuration: vscode.workspace.getConfiguration('pomodoro').get('breakDuration') || 5
    };

    statusBarItem.command = 'soskWorkshop.toggleTimer';

    let pomodoroTimer = new PomodoroTimer(statusBarItem, settings);

    let toggleTimerCommand = vscode.commands.registerCommand('soskWorkshop.toggleTimer', () => {
        pomodoroTimer.toggleTimer();
    });

    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(toggleTimerCommand);

    // Configuration change handler
    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('pomodoro.workDuration')) {
            settings.workDuration = vscode.workspace.getConfiguration('pomodoro').get('workDuration') || 25;
        }
        if (event.affectsConfiguration('pomodoro.breakDuration')) {
            settings.breakDuration = vscode.workspace.getConfiguration('pomodoro').get('breakDuration') || 5;
        }
    });

    pomodoroTimer.updateStatusBar();
}

export function deactivate() { }