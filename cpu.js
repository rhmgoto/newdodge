class CPUController {
  constructor(team, opponents, ball, config) {
    this.team = team;
    this.opponents = opponents;
    this.ball = ball;
    this.config = config;
    this.commands = new Map();
    this.decisionTimer = 0;
    this.throwTimer = 0.5;
    this.reactionTimer = this.randomReaction();
  }

  update(delta) {
    this.decisionTimer -= delta;
    this.throwTimer -= delta;

    for (const member of this.team) {
      if (!this.commands.has(member.id)) {
        this.commands.set(member.id, this.createEmptyCommand());
      }
      const command = this.commands.get(member.id);
      command.catch = false;
      command.crouch = false;
      command.jump = false;
      command.shoot = false;
      command.pass = false;
    }

    if (this.decisionTimer <= 0) {
      this.makeDecision();
      this.decisionTimer = 0.08 + Math.random() * 0.08;
    }

    this.reactToIncomingBall(delta);
    this.reactToFriendlyBall();
  }

  makeDecision() {
    const holder = this.ball.owner;
    const cpuHolder = holder && holder.team === "right" ? holder : null;

    if (cpuHolder && this.throwTimer <= 0) {
      const command = this.commands.get(cpuHolder.id);
      if (Math.random() < 0.72 || cpuHolder.role === "out") {
        command.shoot = true;
      } else {
        command.pass = true;
      }
      this.throwTimer = 0.55 + Math.random() * 0.55;
      return;
    }

    for (const member of this.team) {
      const command = this.commands.get(member.id);
      if (member.defeated) {
        command.moveX = 0;
        command.moveY = 0;
        command.dash = false;
        continue;
      }

      if (this.ball.isLoose && !this.ball.owner && this.canReachLooseBall(member)) {
        this.moveToward(command, member, this.ball.x, this.ball.y);
        command.dash = true;
        continue;
      }

      if (cpuHolder === member) {
        const nearest = this.nearestActiveOpponent(member);
        if (nearest) {
          this.moveToward(command, member, member.homeX, nearest.y);
          command.dash = true;
        }
        continue;
      }

      if (this.ball.owner && this.ball.owner.team === "left" && member.role === "inner") {
        command.moveX = -0.55;
        command.moveY = Math.sign(member.y - this.ball.owner.y) || (Math.random() > 0.5 ? 1 : -1);
        command.dash = true;
        continue;
      }

      if (member.role === "inner") {
        this.moveToward(command, member, member.homeX, member.homeY + Math.sin(Date.now() / 500 + member.x) * 34);
      } else {
        this.moveToward(command, member, member.homeX, member.homeY);
      }
    }
  }

  reactToIncomingBall(delta) {
    const ballComing = this.ball.isFlying && this.ball.kind === "shoot" && this.ball.thrower && this.ball.thrower.team === "left";
    if (!ballComing) return;

    this.reactionTimer -= delta;
    if (this.reactionTimer > 0) return;

    for (const member of this.team.filter((p) => p.role === "inner" && !p.defeated)) {
      const command = this.commands.get(member.id);
      const distance = Math.hypot(this.ball.x - member.x, this.ball.y - member.y);
      if (distance > 260) continue;

      if (distance < 130 && Math.random() < this.config.cpuCatchChance) {
        command.catch = true;
      } else if (Math.abs(this.ball.y - member.y) < 80) {
        command.moveY = member.y < this.config.court.y + this.config.court.h * 0.5 ? 1 : -1;
        command.moveX = -0.25;
        command.dash = true;
      }
    }

    this.reactionTimer = this.randomReaction();
  }

  reactToFriendlyBall() {
    if (!this.ball.isFlying || !this.ball.thrower || this.ball.thrower.team !== "right") return;
    if (!this.ball.target || this.ball.target.team !== "right") return;

    const receiver = this.ball.target;
    if (receiver.defeated || receiver === this.ball.thrower) return;

    const command = this.commands.get(receiver.id);
    if (!command) return;

    const distance = Math.hypot(this.ball.x - receiver.x, this.ball.y - (receiver.y - 34));
    if (distance < 170) {
      command.catch = true;
    }
  }

  moveToward(command, member, x, y) {
    const dx = x - member.x;
    const dy = y - member.y;
    const length = Math.hypot(dx, dy) || 1;
    command.moveX = Math.abs(dx) > 8 ? dx / length : 0;
    command.moveY = Math.abs(dy) > 8 ? dy / length : 0;
  }

  canReachLooseBall(member) {
    const distance = Math.hypot(this.ball.x - member.x, this.ball.y - member.y);
    if (distance < 620) return true;

    const area = this.config.areas ? this.config.areas[member.zone] : null;
    if (!area) return member.role === "inner";
    const margin = 42;
    return (
      this.ball.x >= area.x - margin &&
      this.ball.x <= area.x + area.w + margin &&
      this.ball.y >= area.y - margin &&
      this.ball.y <= area.y + area.h + margin
    );
  }

  nearestActiveOpponent(member) {
    let best = null;
    let bestDistance = Infinity;
    for (const opponent of this.opponents) {
      if (opponent.defeated || opponent.role !== "inner") continue;
      const distance = Math.hypot(opponent.x - member.x, opponent.y - member.y);
      if (distance < bestDistance) {
        best = opponent;
        bestDistance = distance;
      }
    }
    return best;
  }

  getCommand(member) {
    return this.commands.get(member.id) || this.createEmptyCommand();
  }

  createEmptyCommand() {
    return {
      moveX: 0,
      moveY: 0,
      dash: false,
      catch: false,
      crouch: false,
      jump: false,
      shoot: false,
      pass: false
    };
  }

  randomReaction() {
    return 0.15 + Math.random() * 0.2;
  }
}
