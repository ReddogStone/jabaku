'use strict';

function FollowTargetBaseBehavior(halfTime, getValueAndTargetFunc) {
	this._halfTime = halfTime;
	this._get = getValueAndTargetFunc;
}
FollowTargetBaseBehavior.extends(Object, {
	update: function(entity, delta) {
		var valueAndTarget = this._get(entity);
		Vecmath.expAttVec(valueAndTarget.value, valueAndTarget.target, delta, this._halfTime);
	}
});

function FollowTargetBehavior(halfTime, target) {
	var self = this;
	this._target = target;
	FollowTargetBaseBehavior.call(this, halfTime, function(entity) {
		return { value: entity.transformable.pos, target: self._target};
	});
}
FollowTargetBehavior.extends(FollowTargetBaseBehavior);

function ExpAttBehavior(halfTime, from, to, callback) {
	this._halfTime = halfTime;
	this._value = from;
	this._target = to;
	this._callback = callback;
}
ExpAttBehavior.extends(Object, {
	update: function(entity, delta) {
		var amount = Math.pow(0.5, delta / this._halfTime);
		this._value = this._value * amount + this._target * (1.0 - amount);
		
		if (Math.abs(this._value - this._target) < 0.00001) {
			this._callback(entity, this._target);
			return true;
		}
		
		this._callback(entity, this._value);
	}
});

function BehaviorsUpdateable() {
	this._behaviors = [];
}
BehaviorsUpdateable.extends(Object, {
	addBehavior: function(behavior) {
		this._behaviors.push(behavior);
		return behavior;
	},
	removeBehavior: function(behavior) {
		this._behaviors.remove(behavior);
		return behavior;
	},
	update: function(entity, delta) {
		var behaviors = this._behaviors;
		behaviors.reverseForEach(function(behavior, index) {
			var finished = behavior.update(entity, delta);
			if (finished) {
				behaviors.splice(index, 1);
			}
		});
	}
});
