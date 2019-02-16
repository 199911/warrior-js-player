const getOppDir = (dir) => {
  switch (dir) {
    case 'backward':
      return 'forward';
    case 'forward':
      return 'backward';
  }
}

const isEnemyInDistance = (objects) => {
  for (let i =0; i < objects.length; i++ ) {
    switch (objects[i]) {
      case 'enemy':
        return true;
      case 'bound':
        return false;
    }
  }
}

const isEnemyInDistance = (objects) => {
  for (let i =0; i < objects.length; i++ ) {
    switch (objects[i]) {
      case 'enemy':
        return true;
      case 'bound':
        return false;
    }
  }
  return false;
}

class Player {
  playTurn(war) {
    this.pre(war);
    const sight = war.look(this.dir);
    const objects = sight.map(this.identify);
    war.think(objects.join(','));
    switch (objects[0]) {
      case 'wall':
        war.pivot();
        break;
      case 'enemy':
        war.attack(this.dir);
        break;
      case 'bound':
        war.rescue(this.dir);
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
          if (objects.includes('enemy')) {
            war.shoot(this.dir);
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
    if (space.isEmpty()) {
      return 'empty';
    }
    if (space.isWall()) {
      return 'wall';
    }
    if (space.isUnit()) {
      if (space.getUnit().isEnemy()) {
        return 'enemy';
      }
      if (space.getUnit().isBound()) {
        return 'bound'
      }
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
