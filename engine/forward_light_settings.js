var Jabaku = (function(module) {
	'use strict';

	function ForwardLightSettings() {
		this._pointLight1 = null;
		this._pointLight2 = null;
		this._ambientColor = Color.clone(Color.black);
	}
	ForwardLightSettings.extends(Object, {
		get ambientColor() {
			return this._ambientColor;
		},
		set ambientColor(value) {
			this._ambientColor = Color.clone(value.clone());
		},
		get pointLight1() {
			return this._pointLight1;
		},
		set pointLight1(value) {
			this._pointLight1 = value ? value.clone() : value;
		},
		get pointLight2() {
			return this._pointLight2;
		},
		set pointLight2(value) {
			this._pointLight2 = value ? value.clone() : value;
		},
		setParams: function(params) {
			params.uAmbient = this._ambientColor.toArray3();
			if (this._pointLight1) {
				params.uPosLight1 = this._pointLight1.pos.toArray();
				params.uColorLight1 = this._pointLight1.color.toArray3();
			} else {
				params.uPosLight1 = [0, 0, 0];
				params.uColorLight1 = Color.black.toArray3();
			}

			if (this._pointLight2) {
				params.uPosLight2 = this._pointLight2.pos.toArray();
				params.uColorLight2 = this._pointLight2.color.toArray3();
			} else {
				params.uPosLight2 = [0, 0, 0];
				params.uColorLight2 = Color.black.toArray3();
			}
		}
	});

	module.ForwardLightSettings = ForwardLightSettings;
	return module;
})(Jabaku || {});