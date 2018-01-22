/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);

        this.body.setVelocity(3, 15);

        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.alwaysUpdate = true;

        this.renderable.addAnimation('walk', [0, 1, 2, 3, 4, 5, 6, 7]);

        this.renderable.addAnimation('stand', [0]);

        this.renderable.setCurrentAnimation('stand');
    },

    /**
     * update the entity
     */
    update: function (dt) {
        if (me.input.isKeyPressed('left')) {
            this.renderable.flipX(true);
            this.body.vel.x -= this.body.accel.x * me.timer.tick;

            if (!this.renderable.isCurrentAnimation('walk')) {
                this.renderable.setCurrentAnimation('walk');
            }
        } else if (me.input.isKeyPressed('right')) {
            this.renderable.flipX(false);
            this.body.vel.x += this.body.accel.x * me.timer.tick;

            if (!this.renderable.isCurrentAnimation('walk')) {
                this.renderable.setCurrentAnimation('walk');
            }
        } else {
            this.body.vel.x = 0;
            this.renderable.setCurrentAnimation('stand');
        }

        if (me.input.isKeyPressed('jump')) {
            if (!this.body.jumping && !this.body.falling) {
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                this.body.jumping = true;
            }
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (
            this._super(me.Entity, 'update', [dt]) ||
            this.body.vel.x !== 0 ||
            this.body.vel.y !== 0);
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        switch (response.b.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
                if (other.type === 'platform') {
                    if (
                        this.body.falling &&
                        !me.input.isKeyPressed('down') &&
                        response.overlapV.y > 0 &&
                        (~~this.body.vel.y >= ~~response.overlapV.y)) {

                        response.overlapV.x = 0;
                        return true;
                    }

                    return false;
                }
                break;
            case me.collision.types.ENEMY_OBJECT:
                if ((response.overlapV.y>0) && !this.body.jumping) {
                  this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                  // this.body.jumping = true;
                }
                else if (!this.body.falling) {
                  this.renderable.flicker(750);
                }

            default:
                return false;
        }

        // Make all other objects solid
        return true;
    }
});
