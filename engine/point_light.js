'use strict';

function PointLight(pos, color) {
	this.pos = pos ? pos.clone() : new Vecmath.Vector3();
	this.color = Color.clone(color);
}
PointLight.clone = function(value) {
	return new PointLight(value.pos, value.color);
}