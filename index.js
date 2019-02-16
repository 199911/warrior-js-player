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
    const sight = war.look(this.dir);
    const objects = sight.map(this.identify);
    const { type, dist } = nextObject(objects);
    war.think(nextObject(objects));
    if (type === 'enemy') {
      war.shoot(this.dir);
    } else {
      switch (objects[0]) {
        case 'enemy':
          war.attack(this.dir);
          break;
        case 'bound':
          war.rescue(this.dir);
          break;
        case 'stairs':
          war.walk(this.dir);
          break;
        case 'wall':
          war.pivot();
          break;
        case 'empty':
          if (this.isBleeding(war)) {
            if (this.isDanger(war)) {
              this.turn();
            }
            war.walk(this.dir);
          } else if (this.isHurt(war)) {
            war.rest();
          } else {
            war.walk(this.dir);
          }
      }
    }
    this.post(war);
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
