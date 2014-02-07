'use strict';

function Transform(pos, rot, scale) {
	this._pos = pos ? pos.clone() : new Vecmath.Vector3();
	this._rot = rot ? rot.clone() : new Vecmath.Quaternion().identity();
	this._scale = scale ? scale.clone() : new Vecmath.Vector3(1, 1, 1);
}
Transform.extends(Object, {
	get scale() {
		return this._scale;
	},
	set scale(value) {
		this._scale = value.clone();
	},
	get pos() {
		return this._pos;
	},
	set pos(value) {
		this._pos = value.clone();
	},
	get rot() {
		return this._rot;
	},
	set rot(value) {
		this._rot = value.clone();
	},
	get direction() {
		return new Vecmath.Vector3(0, 0, -1).transformQuat(this._rot);
	},
	get up() {
		return new Vecmath.Vector3(0, 1, 0).transformQuat(this._rot);
	},
	get transform() {
		return new Vecmath.Matrix4().fromRotationTranslation(this._rot, this._pos).scale(this._scale);
	},
	translate: function(vec) {
		this._pos.add(vec);
	},
	rotateX: function(angle) {
		this._rot.rotateX(angle);
	},
	rotateY: function(angle) {
		this._rot.rotateY(angle);
	},
	rotateZ: function(angle) {
		this._rot.rotateZ(angle);
	},
	rotateAroundTargetVert: function(target, angle) {
		var targetPos = target.clone();
		if (targetPos) {
			var targetToPos = this._pos.clone().sub(targetPos);
			var dir = targetToPos.clone().normalize();
			var up = this.up;

			// TODO: implement snapping to the "down" view
			var dirDotUp = dir.dot(up);
			if ((Math.abs(dirDotUp) < 0.99) || ((dirDotUp * angle) > 0)) {
				var right = up.clone().cross(dir).normalize();
				var rotation = new Vecmath.Quaternion().setAxisAngle(right, angle);
				this._pos = targetPos.add(targetToPos.transformQuat(rotation));
			}
		}
	},
	rotateAroundTargetHoriz: function(target, angle) {
		var targetPos = target.clone();
		if (targetPos) {
			var targetToPos = this._pos.clone().sub(targetPos);
			var dir = targetToPos.clone().normalize();

			var up = this.up;
			var right = up.clone().cross(dir);
			angle *= right.length();
			right.normalize();
			up = dir.clone().cross(right).normalize();
			var rotation = new Vecmath.Quaternion().setAxisAngle(up, angle);
			this._pos = targetPos.add(targetToPos.transformQuat(rotation));
		}
	}	
});
