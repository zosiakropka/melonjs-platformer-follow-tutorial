game.CoinEntity = me.CollectableEntity.extend({
  onCollision: function () {
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);
    me.game.world.removeChild(this);
    return false;
  }
});
