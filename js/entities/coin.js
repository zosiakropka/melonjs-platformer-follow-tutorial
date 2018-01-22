game.CoinEntity = me.CollectableEntity.extend({
  onCollision: function () {
    game.data.score += game.CoinEntity.COIN_VALUE;

    this.body.setCollisionMask(me.collision.types.NO_OBJECT);
    me.game.world.removeChild(this);
    return false;
  }
});

game.CoinEntity.COIN_VALUE = 250;
