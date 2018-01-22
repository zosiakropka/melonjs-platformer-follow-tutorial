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

        this.hitPoints = settings.hitPoints || 5;
        this.hurting = false;

        this.fighting = false;

        this.renderable.addAnimation('walkLeft', [0, 1, 2, 3, 4, 5, 6, 7]);
        this.renderable.addAnimation('walkRight', [8, 9, 10, 11, 12, 13, 14, 15]);
        this.renderable.addAnimation('idleLeft', [1]);
        this.renderable.addAnimation('idleRight', [14]);
        this.renderable.addAnimation('fightLeft', [16, 17]);
        this.renderable.addAnimation('fightRight', [18, 19]);

        this.renderable.setCurrentAnimation('idleLeft');
        this.headingLeft = true;
    },

    /**
     * update the entity
     */
    update: function (dt) {
        var animationToSet = 'idleRight';

        if (me.input.isKeyPressed('left')) {
            this.headingLeft = true;
            this.body.vel.x -= this.body.accel.x * me.timer.tick;

            animationToSet = 'walkLeft';
        } else if (me.input.isKeyPressed('right')) {
            this.headingLeft = false;
            this.body.vel.x += this.body.accel.x * me.timer.tick;

            animationToSet = 'walkRight';
        } else if (me.input.isKeyPressed('fight')) {
            this.fight();
        } else {
            this.body.vel.x = 0;

            if (this.headingLeft === true) {
                animationToSet = 'idleLeft';
            } else {
                animationToSet = 'idleRight';
            }
        }

        if (this.fighting) {
            if (this.headingLeft === true) {
                animationToSet = 'fightLeft';
            } else {
                animationToSet = 'fightRight';
            }
        }

        if (me.input.isKeyPressed('jump')) {
            if (!this.body.jumping && !this.body.falling) {
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                this.body.jumping = true;
            }
        }

        if (!this.renderable.isCurrentAnimation(animationToSet)) {
            this.renderable.setCurrentAnimation(animationToSet);
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
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
                    console.info('ałaja debilu!');
                }
            }, 500);
        }

    },

    fight: function() {
        self = this;
        this.fighting = true;
        me.timer.setTimeout(function() {
            self.fighting = false;
        }, 100)
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        if (other.body.collisionType === me.collision.types.WORLD_SHAPE) {
            if (other.type === 'platform') {
                // if falling, make platform solid, otherwise make it passable-through
                return !!this.body.falling;
            }
        } else if (other.body.collisionType === me.collision.types.ENEMY_OBJECT) {
            if (this.fighting) {
                other.hurt(1);
                console.info('a masz!')
            }
        }

        // Make all other objects solid
        return true;
    }
});
