const getOppDir = (dir) => {
  switch (dir) {
    case 'backward':
      return 'forward';
    case 'forward':
      return 'backward';
  }
}

const nextObject = (objects) => {
  for (let i = 0; i < objects.length; i++ ) {
    if (objects[i] !== 'empty') {
      return {
        type: objects[i],
        dist: i,
      };
    }
  }
  return false;
}

class Player {
  playTurn(war) {
    this.pre(war);
    this.actBackward(war) || this.actForward(war);
    this.post(war);
  }

  actForward(war) {
    const sight = war.look();
    const objects = sight.map(this.identify);
    const obj = nextObject(objects);
    if (!obj) {
      if (this.isBleeding(war)) {
        if (this.isDanger(war)) {
          this.turn();
        }
        war.walk();
      } else if (this.isHurt(war)) {
        war.rest();
      } else {
        war.walk();
      }
      return true;
    }
    const { type, dist } = obj;
    war.think(`forward ${type} ${dist}`);
    switch (type) {
      case 'enemy':
        dist > 0 ? war.shoot() : war.attack();
        break;
      case 'bound':
        dist > 0 ? war.walk() : war.rescue();
        break;
      case 'stairs':
        war.walk(this.dir);
        break;
      case 'wall':
        war.pivot();
        break;
    }
    return true;
  }

  actBackward(war) {
    const dir = 'backward';
    const sight = war.look(dir);
    const objects = sight.map(this.identify);
    const { type, dist } = nextObject(objects);
    war.think(`backward ${type} ${dist}`);
    switch (type) {
      case 'enemy':
        dist > 0 ? war.shoot(dir) : war.attack(dir);
        break;
      case 'bound':
        dist > 0 ? war.walk(dir) : war.rescue(dir);
        break;
      default:
        return false;
    }
    return true;
  }

  pre(war) {
    if (!this.hp) {
      this.hp = war.maxHealth();
    }
    if (!this.dir) {
      this.dir = 'forward';
    }
  }
  post(war) {
    this.hp = war.health();
  }

  identify(space) {
    if (space.isUnit()) {
      if (space.getUnit().isEnemy()) {
        return 'enemy';
      }
      if (space.getUnit().isBound()) {
        return 'bound'
      }
    }
    if (space.isEmpty()) {
      if (space.isStairs()) {
        return 'stairs';
      }
      return 'empty';
    }
    if (space.isWall()) {
      return 'wall';
    }
  }

  turn() {
    this.dir = getOppDir(this.dir);
  }
  isHurt(war) {
    return war.health() < war.maxHealth();
  }
  isBleeding(war) {
    return war.health() < this.hp;
  }
  isDanger(war) {
    return war.health() < 8;
  }
}
