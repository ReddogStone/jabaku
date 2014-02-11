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
		}
	});

	module.ForwardLightSettings = ForwardLightSettings;
	return module;
})(Jabaku || {});