class InputManager {
  constructor() {
    // ボタン割り当てはここを変更する。番号は画面右下の表示で確認できる。
    this.gamepadMap = {
      button0: 0,
      button1: 1, // パス（相手ボール時はしゃがみ回避と共用）
      button2: 2, // シュート
      catch: 2, // キャッチ
      button3: 3, // ジャンプ
      button4: 4, // 向き固定
      avoid: 1, // しゃがみ回避
      dash: 5, // 押しながら移動でダッシュ
      pause: 9
    };

    this.keys = new Set();
    this.previous = this.createEmptyState();
    this.current = this.createEmptyState();
    this.previousP2 = this.createEmptyState();
    this.currentP2 = this.createEmptyState();
    this.gamepadName = "未接続";
    this.gamepadConnected = false;
    this.pressedGamepadButtons = [];
    this.lastTap = { x: 0, y: 0, time: 0 };
    this.dashHold = { active: false, axis: null, direction: 0 };
    this.doubleTapDashPressed = false;

    window.addEventListener("keydown", (event) => {
      this.keys.add(event.code);
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
        event.preventDefault();
      }
    });

    window.addEventListener("keyup", (event) => {
      this.keys.delete(event.code);
    });

    window.addEventListener("gamepadconnected", (event) => {
      this.gamepadName = event.gamepad.id || "ゲームパッド";
      this.gamepadConnected = true;
    });

    window.addEventListener("gamepaddisconnected", () => {
      this.gamepadName = "未接続";
      this.gamepadConnected = false;
    });
  }

  createEmptyState() {
    return {
      moveX: 0,
      moveY: 0,
      rightX: 0,
      rightY: 0,
      button0: false,
      button1: false,
      button2: false,
      catch: false,
      button3: false,
      button4: false,
      avoid: false,
      dash: false,
      pause: false,
      rawButtons: []
    };
  }

  update() {
    this.previous = { ...this.current };
    const keyboard = this.readKeyboard();
    const gamepad = this.readGamepad(0);
    const gamepadP2 = this.readGamepad(1);
    this.updateDoubleTapDash(keyboard, gamepad);
    const dodgeDown = keyboard.avoid || keyboard.button1 || gamepad.avoid || gamepad.button1;
    const p2DodgeDown = gamepadP2.avoid || gamepadP2.button1;

    this.current = {
      moveX: this.clampAxis(keyboard.moveX || gamepad.moveX),
      moveY: this.clampAxis(keyboard.moveY || gamepad.moveY),
      rightX: this.clampAxis(gamepad.rightX),
      rightY: this.clampAxis(gamepad.rightY),
      button0: keyboard.button0 || gamepad.button0,
      button1: keyboard.button1 || gamepad.button1,
      button2: keyboard.button2 || gamepad.button2,
      catch: (keyboard.catch || gamepad.catch) && !dodgeDown,
      button3: keyboard.button3 || gamepad.button3,
      button4: keyboard.button4 || gamepad.button4,
      avoid: dodgeDown,
      dash: keyboard.dash || gamepad.dash || this.isDoubleTapDashHeld(),
      pause: keyboard.pause || gamepad.pause,
      rawButtons: gamepad.rawButtons || []
    };
    this.previousP2 = { ...this.currentP2 };
    this.currentP2 = {
      ...gamepadP2,
      avoid: p2DodgeDown,
      catch: gamepadP2.catch && !p2DodgeDown,
      rawButtons: gamepadP2.rawButtons || []
    };
  }

  readKeyboard() {
    const left = this.keys.has("KeyA") || this.keys.has("ArrowLeft");
    const right = this.keys.has("KeyD") || this.keys.has("ArrowRight");
    const up = this.keys.has("KeyW") || this.keys.has("ArrowUp");
    const down = this.keys.has("KeyS") || this.keys.has("ArrowDown");

    return {
      moveX: (right ? 1 : 0) - (left ? 1 : 0),
      moveY: (down ? 1 : 0) - (up ? 1 : 0),
      rightX: 0,
      rightY: 0,
      button0: this.keys.has("KeyX"),
      button1: this.keys.has("Space"),
      button2: this.keys.has("KeyC"),
      catch: this.keys.has("KeyC"),
      button3: this.keys.has("KeyJ"),
      button4: this.keys.has("KeyF"),
      avoid: this.keys.has("KeyV"),
      dash: this.keys.has("ShiftLeft") || this.keys.has("ShiftRight"),
      pause: this.keys.has("Escape")
    };
  }

  readGamepad(playerIndex = 0) {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const connectedPads = Array.from(pads).filter(Boolean);
    const pad = connectedPads[playerIndex] || null;

    if (!pad) {
      if (playerIndex === 0) {
        this.gamepadName = "未接続";
        this.gamepadConnected = false;
        this.pressedGamepadButtons = [];
      }
      return this.createEmptyState();
    }

    if (playerIndex === 0) {
      this.gamepadName = pad.id || "ゲームパッド";
      this.gamepadConnected = true;
    }

    const rawButtons = pad.buttons
      .map((button, index) => (this.isPressed(button) ? index : null))
      .filter((index) => index !== null);
    if (playerIndex === 0) this.pressedGamepadButtons = rawButtons;

    const leftX = this.deadZone(pad.axes[0] || 0);
    const leftY = this.deadZone(pad.axes[1] || 0);
    const rightX = this.deadZone(pad.axes[2] || 0);
    const rightY = this.deadZone(pad.axes[3] || 0);
    const dLeft = this.isPressed(pad.buttons[14]);
    const dRight = this.isPressed(pad.buttons[15]);
    const dUp = this.isPressed(pad.buttons[12]);
    const dDown = this.isPressed(pad.buttons[13]);

    return {
      moveX: this.clampAxis(leftX + (dRight ? 1 : 0) - (dLeft ? 1 : 0)),
      moveY: this.clampAxis(leftY + (dDown ? 1 : 0) - (dUp ? 1 : 0)),
      rightX: this.clampAxis(rightX),
      rightY: this.clampAxis(rightY),
      button0: this.isPressed(pad.buttons[this.gamepadMap.button0]),
      button1: this.isPressed(pad.buttons[this.gamepadMap.button1]),
      button2: this.isPressed(pad.buttons[this.gamepadMap.button2]),
      catch: this.isPressed(pad.buttons[this.gamepadMap.catch]),
      button3: this.isPressed(pad.buttons[this.gamepadMap.button3]),
      button4: this.isPressed(pad.buttons[this.gamepadMap.button4]),
      avoid: this.isPressed(pad.buttons[this.gamepadMap.avoid]),
      dash: this.isPressed(pad.buttons[this.gamepadMap.dash]),
      pause: this.isPressed(pad.buttons[this.gamepadMap.pause]),
      rawButtons
    };
  }

  getCurrent(playerIndex = 1) {
    return playerIndex === 2 ? this.currentP2 : this.current;
  }

  getPrevious(playerIndex = 1) {
    return playerIndex === 2 ? this.previousP2 : this.previous;
  }

  wasPressed(name, playerIndex = 1) {
    const current = this.getCurrent(playerIndex);
    const previous = this.getPrevious(playerIndex);
    return current[name] && !previous[name];
  }

  wasReleased(name, playerIndex = 1) {
    const current = this.getCurrent(playerIndex);
    const previous = this.getPrevious(playerIndex);
    return !current[name] && previous[name];
  }

  isGamepadButtonDown(index, playerIndex = 1) {
    const rawButtons = this.getCurrent(playerIndex).rawButtons || [];
    return rawButtons.includes(index);
  }

  wasGamepadButtonPressed(index, playerIndex = 1) {
    const currentButtons = this.getCurrent(playerIndex).rawButtons || [];
    const previousButtons = this.getPrevious(playerIndex).rawButtons || [];
    return currentButtons.includes(index) && !previousButtons.includes(index);
  }

  isPressed(button) {
    return Boolean(button && button.pressed);
  }

  deadZone(value) {
    return Math.abs(value) < 0.22 ? 0 : value;
  }

  clampAxis(value) {
    return Math.max(-1, Math.min(1, value));
  }

  updateDoubleTapDash(keyboard, gamepad) {
    const now = performance.now();
    const moveX = this.clampAxis(keyboard.moveX || gamepad.moveX);
    const moveY = this.clampAxis(keyboard.moveY || gamepad.moveY);
    const previousX = this.previous.moveX || 0;
    const previousY = this.previous.moveY || 0;
    const axis = Math.abs(moveX) >= Math.abs(moveY) ? "x" : "y";
    const value = axis === "x" ? moveX : moveY;
    const previousValue = axis === "x" ? previousX : previousY;
    this.doubleTapDashPressed = false;

    if (this.dashHold.active) {
      const heldValue = this.dashHold.axis === "x" ? moveX : moveY;
      if (Math.sign(heldValue) !== this.dashHold.direction || Math.abs(heldValue) < 0.55) {
        this.dashHold = { active: false, axis: null, direction: 0 };
      }
      this.doubleTapDashPressed = this.dashHold.active;
    }

    if (Math.abs(value) > 0.72 && Math.abs(previousValue) <= 0.35) {
      const direction = Math.sign(value);
      if (this.lastTap.axis === axis && this.lastTap.direction === direction && now - this.lastTap.time <= 280) {
        this.dashHold = { active: true, axis, direction };
        this.doubleTapDashPressed = true;
      }
      this.lastTap = { axis, direction, time: now };
    }
  }

  isDoubleTapDashHeld() {
    return this.doubleTapDashPressed;
  }

  getAimVector(defaultX, playerIndex = 1) {
    const current = this.getCurrent(playerIndex);
    const x = Math.abs(current.moveX) > 0.15 ? current.moveX : defaultX;
    const y = Math.abs(current.moveY) > 0.15 ? current.moveY : 0;
    const length = Math.hypot(x, y) || 1;
    return { x: x / length, y: y / length };
  }

  wasRightStickFlicked(playerIndex = 1) {
    const current = this.getCurrent(playerIndex);
    const previous = this.getPrevious(playerIndex);
    const currentPower = Math.hypot(current.rightX, current.rightY);
    const previousPower = Math.hypot(previous.rightX, previous.rightY);
    return currentPower > 0.65 && previousPower <= 0.35;
  }

  getGamepadStatusText() {
    return this.gamepadConnected ? `Controller: ${this.gamepadName}` : "Controller: 未接続";
  }

  getPressedButtonText() {
    if (!this.gamepadConnected) return "Pad buttons: 未接続";
    if (this.pressedGamepadButtons.length === 0) return "Pad buttons: なし";
    return `Pad buttons: ${this.pressedGamepadButtons.join(", ")}`;
  }
}
