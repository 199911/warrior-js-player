const getOppDir = (dir) => {
  switch (dir) {
    case 'backward':
      return 'forward';
    case 'forward':
      return 'backward';
  }
}

class Player {
  playTurn(war) {
    this.pre(war);
    war.think(this.dir);
    const space = war.feel(this.dir);
    const object = this.feel(space);
    war.think(object);
    const sight = war.look(this.dir);
    const objs = sight.map(this.feel);
    war.think(objs);
    switch (object) {
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
            this.dir = getOppDir(this.dir);
          }
          war.walk(this.dir);
        } else if (this.isHurt(war)) {
          war.rest();
        } else {
          if (objs.includes('enemy')) {
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

  feel(space) {
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
