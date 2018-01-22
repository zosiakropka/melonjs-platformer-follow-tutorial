game.EnemyEntity = me.Entity.extend({
  init: function(x, y, settings) {
    var width = settings.width;
    var height = settings.height;

    settings.framewidth = settings.width = 64;
    settings.frameheight = settings.height = 64;

    settings.shapes[0] = new me.Rect(0, 0, settings.framewidth, settings.frameheight);

    this._super(me.Entity, 'init', [x, y, settings]);

    x = this.pos.x;
    this.startX = x;
    this.endX = x + width - settings.framewidth;
    this.pos.x = x + width - settings.framewidth;

    this.walkLeft = false;

    this.body.setVelocity(4, 6);
  },

  update: function(dt) {
    if (this.walkLeft && this.pos.x <= this.startX) {
      this.walkLeft = false;
    } else if (!this.walkLeft && this.pos.x >= this.endX) {
      this.walkLeft = true;
    }

    this.renderable.flipX(this.walkLeft);
    this.body.vel.x += ((this.walkLeft) ? -1 : 1) * this.body.accel.x * me.timer.tick;

    this.body.update(dt);

    me.collision.check(this);

    return (
      this._super(me.Entity, 'update', [dt]) ||
      this.body.vel.x !== 0 ||
      this.body.vel.y !== 0)
  },

  onCollision: function (response, other) {
    if (response.b.body.collisionType === me.collision.types.WORLD_SHAPE) {
      return true;
    }

    if (response.overlapV.y > 0 && response.a.body.falling) {
      this.renderable.flicker(750);
    }
    return false;
  }
});
