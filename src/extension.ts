import * as vscode from 'vscode';

interface PomodoroSettings {
    workDuration: number; // in minutes
    breakDuration: number; // in minutes
}

enum TimerState {
    Work,
    Break,
    Stopped
}

export function activate(context: vscode.ExtensionContext) {
    let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
    let timer: NodeJS.Timeout | null = null;
    let remainingSeconds: number = 0;
    let timerState: TimerState = TimerState.Stopped;
    let settings: PomodoroSettings = {
        workDuration: vscode.workspace.getConfiguration('pomodoro').get('workDuration') || 25,
        breakDuration: vscode.workspace.getConfiguration('pomodoro').get('breakDuration') || 5
    };

    function updateStatusBar() {
        if (timerState === TimerState.Stopped) {
            statusBarItem.text = '🍅';
            statusBarItem.tooltip = 'Click to start';
        } else {
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;
            statusBarItem.text = `🍅 ${TimerState[timerState]}: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            statusBarItem.tooltip = `Click to ${timerState === TimerState.Work ? 'start break' : 'start work'}`;
        }
        statusBarItem.show();
    }

    function startTimer(duration: number, nextState: TimerState) {
        remainingSeconds = duration * 60;
        timerState = nextState;
        updateStatusBar();

        if (timer) {
            clearInterval(timer);
        }

        timer = setInterval(() => {
            remainingSeconds--;

            if (remainingSeconds < 0) {
                clearInterval(timer!);
                timer = null;

                vscode.window.showInformationMessage(`Pomodoro: ${timerState === TimerState.Work ? 'Work' : 'Break'} time is over!`);

                if (timerState === TimerState.Work) {
                    startTimer(settings.breakDuration, TimerState.Break);
                } else {
                    startTimer(settings.workDuration, TimerState.Work);
                }
                return;
            }
            updateStatusBar();
        }, 1000);
    }

    statusBarItem.command = 'soskWorkshop.toggleTimer';

    let toggleTimerCommand = vscode.commands.registerCommand('soskWorkshop.toggleTimer', () => {
        if (timerState === TimerState.Stopped) {
            startTimer(settings.workDuration, TimerState.Work);
        } else {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            timerState = TimerState.Stopped;
            updateStatusBar();
        }
    });


    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(toggleTimerCommand);

    //Configuration change handler
    vscode.workspace.onDidChangeConfiguration(event => {
        if (event.affectsConfiguration('pomodoro.workDuration')) {
            settings.workDuration = vscode.workspace.getConfiguration('pomodoro').get('workDuration') || 25;
        }
        if (event.affectsConfiguration('pomodoro.breakDuration')) {
            settings.breakDuration = vscode.workspace.getConfiguration('pomodoro').get('breakDuration') || 5;
        }
    });

    updateStatusBar();
}

export function deactivate() { }