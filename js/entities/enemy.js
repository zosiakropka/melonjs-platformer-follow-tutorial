game.PathEnemyEntity = me.Entity.extend({
  init: function(x, y, settings) {
    this._super(me.Entity, 'init', [x, y, settings]);
    this.xMin = settings.xMin;
    this.xMax = settings.xMax;

    this.renderable.addAnimation('walkRight', [0, 1, 2, 3, 4, 5, 6, 7]);
    this.renderable.addAnimation('walkLeft', [8, 9, 10, 11, 12, 13, 14, 15]);
    this.renderable.addAnimation('stand', [0]);

    this.body.setVelocity(settings.velX || 3, settings.velY || 6);

    this.collisionType = me.collision.types.ENEMY_OBJECT;

    this.alwaysUpdate = false;

    this.hitPoints = 2;

    this.startWalkRight();
  },

  update: function (dt) {
    me.collision.check(this);
    if (this.walkLeft) {
      if (this.getBounds().left <= this.xMin) {
        this.startWalkRight();
      }
    } else {
      if (this.getBounds().right >= this.xMax) {
        this.startWalkLeft();
      }
    }

    this.body.update(dt);
  },

  startWalkLeft: function () {
    this.body.vel.x = -this.body.accel.x * me.timer.tick;
    this.walkLeft = true;
    this.renderable.setCurrentAnimation('walkLeft');
  },

  startWalkRight: function () {
    this.body.vel.x = this.body.accel.x * me.timer.tick;
    this.walkLeft = false;
    this.renderable.setCurrentAnimation('walkRight');
  },

  hurt: function (points) {
        var self = this;
        if (!self.hurting) {
            self.hitPoints -= points;
            self.hurting = true;
            this.renderable.flicker(500);
            me.timer.setTimeout(function() {
                self.hurting = false;
                if (self.hitPoints <= 0) {
                    console.info('zabiles mnie :()');
                }
            }, 500);
        }
  },

  onCollision : function (response, other) {
      if (other.name === 'mainPlayer') {
        other.hurt(1);
        return false;
      }

      // Make all other objects solid
      return true;
  }
});
