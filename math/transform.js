'use strict';

function Transform(pos, rot, scale) {
	this._pos = pos ? pos.clone() : new Vector3();
	this._rot = rot ? rot.clone() : new Quaternion().identity();
	this._scale = scale ? scale.clone() : new Vector3(1, 1, 1);
	this._global = new Matrix4();
}

Transform.prototype = {
	constructor: Transform,
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
		return new Vector3(0, 0, -1).transformQuat(this._rot);
	},
	get up() {
		return new Vector3(0, 1, 0).transformQuat(this._rot);
	},
	get global() {
		return this._global;
	},
	clone: function() {
		return new Transform(this._pos, this._rot, this._scale);
	},
	calcTransform: function(parentTransformMatrix) {
		parentTransformMatrix = parentTransformMatrix || new Matrix4();
		this._global.copy(parentTransformMatrix).mul(
			new Matrix4().fromRotationTranslation(this._rot, this._pos).scale(this._scale));
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
				var rotation = new Quaternion().setAxisAngle(right, angle);
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
			var rotation = new Quaternion().setAxisAngle(up, angle);
			this._pos = targetPos.add(targetToPos.transformQuat(rotation));
		}
	},
	moveToTarget: function(target, percentage) {
		var targetPos = target.clone();
		if (targetPos) {
			var targetToPos = this._pos.clone().sub(targetPos);
			this._pos = targetPos.add(targetToPos.scale(percentage));
		}
	}
};

const Quaternion = require('./quaternion');

module.exports = {
	rotateAroundTargetVert: function(pos, target, up, angle) {
		let targetToPos = pos.clone().sub(target);
		let dir = targetToPos.clone().normalize();

		// TODO: implement snapping to the "down" view
		let dirDotUp = dir.dot(up);
		if ((Math.abs(dirDotUp) > 0.99) && ((dirDotUp * angle) <= 0)) {
			return pos;
		}

		let right = up.clone().cross(dir).normalize();
		let rotation = new Quaternion().setAxisAngle(right, angle);
		return target.clone().add(targetToPos.transformQuat(rotation));
	},
	rotateAroundTargetHoriz: function(pos, target, up, angle) {
		let targetToPos = pos.clone().sub(target);
		let dir = targetToPos.clone().normalize();

		let right = up.clone().cross(dir);
		angle *= right.length();
		right.normalize();
		up = dir.clone().cross(right).normalize();
		let rotation = new Quaternion().setAxisAngle(up, angle);
		return target.clone().add(targetToPos.transformQuat(rotation));
	},
	moveToTarget: function(pos, target, percentage) {
		var targetToPos = pos.clone().sub(target);
		return target.clone().add(targetToPos.scale(percentage));
	}
}
