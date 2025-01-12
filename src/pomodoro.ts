import * as vscode from 'vscode';

export interface PomodoroSettings {
    workDuration: number;
    breakDuration: number;
}

enum TimerState {
    Work,
    Break,
    Stopped
}

export class PomodoroTimer {
  
  private _statusBarItem: vscode.StatusBarItem;
  private _timer: NodeJS.Timeout | null = null;
  private _remainingSeconds: number = 0;
  private _timerState: TimerState = TimerState.Stopped;
  private _settings: PomodoroSettings;
  
  constructor(_statusBarItem: vscode.StatusBarItem, _settings: PomodoroSettings) {
    this._statusBarItem = _statusBarItem;
    this._settings = _settings;
  }

  public startTimer(duration: number, nextState: TimerState) {
      this._remainingSeconds = duration * 60;
      this._timerState = nextState;
      this.updateStatusBar();

      if (this._timer) {
          clearInterval(this._timer);
      }

      this._timer = setInterval(() => {
          this._remainingSeconds--;

          if (this._remainingSeconds < 0) {
              clearInterval(this._timer!);
              this._timer = null;

              vscode.window.showInformationMessage(`🍅: ${this._timerState === TimerState.Work ? 'Work' : 'Break'} time is over!`);

              if (this._timerState === TimerState.Work) {
                  this.startTimer(this._settings.breakDuration, TimerState.Break);
              } else {
                  this.startTimer(this._settings.workDuration, TimerState.Work);
              }
              return;
          }
          this.updateStatusBar();
      }, 1000);
  }

  public updateStatusBar(): void {
      if (this._timerState === TimerState.Stopped) {
          // Add text and tool tip for stopped state
      } else {
          const minutes = Math.floor(this._remainingSeconds / 60);
          const seconds = this._remainingSeconds % 60;
          // Add current time and tool tip for running state
      }
      // Show Status Bar Item
  }

  public toggleTimer(): void {
      if (this._timerState === TimerState.Stopped) {
        this.startTimer(this._settings.workDuration, TimerState.Work);
    } else {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
        this._timerState = TimerState.Stopped;
        this.updateStatusBar();
    }
  }

  public get timerState(): TimerState {
      return this._timerState;
  }

  public set timerState(value: TimerState) {
      this._timerState = value;
  }
  public get timer(): NodeJS.Timeout | null{
      return this._timer;
  }
  public set timer(value: NodeJS.Timeout | null){
        this._timer = value;
  }
}