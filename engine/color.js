var Color = (function() {
	'use strict';

	function mix(value1, value2, strength1, strength2) {
		var strengthSum = strength1 + strength2;
		if (strengthSum < 0.0000001) {
			return 0.0;
		}
		return (value1 * strength1 + value2 * strength2) / strengthSum;
	}

	function make(red, green, blue, alpha) {
		return { red: red, green: green, blue: blue, alpha: alpha };
	}

	return {
		make: function(red, green, blue, alpha) {
			return make(red || 0, green || 0, blue || 0, (alpha !== undefined) ? alpha : 1);
		},
		clone: function(value) {
			return value ? make(value.red, value.green, value.blue, value.alpha) : undefined;
		},
		toCss: function(color) {
			return 'rgba(' + Math.floor(color.red * 255) + ',' + 
				Math.floor(color.green * 255) + ',' +
				Math.floor(color.blue * 255) + ',' +
				color.alpha + ')';
		},
		toByteArray: function(color) {
			return [
				Math.floor(color.red * 255),
				Math.floor(color.green * 255),
				Math.floor(color.blue * 255),
				Math.floor(color.alpha * 255)
			];
		},
		toArray3: function(color) {
			return [color.red, color.green, color.blue];
		},
		toArray4: function(color) {
			return [color.red, color.green, color.blue, color.alpha];
		},
		alphaBlend: function(color1, color2) {
			return make(mix(color1.red, color2.red, color1.alpha, color2.alpha),
				mix(color1.green, color2.green, color1.alpha, color2.alpha),
				mix(color1.blue, color2.blue, color1.alpha, color2.alpha),
				Math.min(color1.alpha + color2.alpha, 1));
		},
		equal: function(color1, color2) {
			return (color1.red == color2.red) &&
				(color1.green == color2.green) &&
				(color1.blue == color2.blue) &&
				(color1.alpha == color2.alpha);
		}
	};
})();