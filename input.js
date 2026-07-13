class InputManager {
  constructor() {
    // ボタン割り当てはここを変更する。一般的なパッドでは 0=A, 1=B, 2=X, 9=START。
    this.gamepadMap = {
      button1: 1, // パス / しゃがみ
      button2: 2, // シュート / キャッチ
      button3: 3, // ジャンプ
      dash: 4,
      pause: 9
    };

    this.keys = new Set();
    this.previous = this.createEmptyState();
    this.current = this.createEmptyState();
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
      button1: false,
      button2: false,
      button3: false,
      dash: false,
      pause: false
    };
  }

  update() {
    this.previous = { ...this.current };
    const keyboard = this.readKeyboard();
    const gamepad = this.readGamepad();
    this.updateDoubleTapDash(keyboard, gamepad);

    this.current = {
      moveX: this.clampAxis(keyboard.moveX || gamepad.moveX),
      moveY: this.clampAxis(keyboard.moveY || gamepad.moveY),
      rightX: this.clampAxis(gamepad.rightX),
      rightY: this.clampAxis(gamepad.rightY),
      button1: keyboard.button1 || gamepad.button1,
      button2: keyboard.button2 || gamepad.button2,
      button3: keyboard.button3 || gamepad.button3,
      dash: keyboard.dash || gamepad.dash || this.isDoubleTapDashHeld(),
      pause: keyboard.pause || gamepad.pause
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
      button1: this.keys.has("Space"),
      button2: this.keys.has("KeyC"),
      button3: this.keys.has("KeyJ"),
      dash: this.keys.has("ShiftLeft") || this.keys.has("ShiftRight"),
      pause: this.keys.has("Escape")
    };
  }

  readGamepad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const pad = Array.from(pads).find(Boolean);

    if (!pad) {
      this.gamepadName = "未接続";
      this.gamepadConnected = false;
      this.pressedGamepadButtons = [];
      return this.createEmptyState();
    }

    this.gamepadName = pad.id || "ゲームパッド";
    this.gamepadConnected = true;
    this.pressedGamepadButtons = pad.buttons
      .map((button, index) => (this.isPressed(button) ? index : null))
      .filter((index) => index !== null);

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
      button1: this.isPressed(pad.buttons[this.gamepadMap.button1]),
      button2: this.isPressed(pad.buttons[this.gamepadMap.button2]),
      button3: this.isPressed(pad.buttons[this.gamepadMap.button3]),
      dash: this.isPressed(pad.buttons[this.gamepadMap.dash]),
      pause: this.isPressed(pad.buttons[this.gamepadMap.pause])
    };
  }

  wasPressed(name) {
    return this.current[name] && !this.previous[name];
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

  getAimVector(defaultX) {
    const x = Math.abs(this.current.moveX) > 0.15 ? this.current.moveX : defaultX;
    const y = Math.abs(this.current.moveY) > 0.15 ? this.current.moveY : 0;
    const length = Math.hypot(x, y) || 1;
    return { x: x / length, y: y / length };
  }

  wasRightStickFlicked() {
    const currentPower = Math.hypot(this.current.rightX, this.current.rightY);
    const previousPower = Math.hypot(this.previous.rightX, this.previous.rightY);
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
