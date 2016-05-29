'use strict';

const assert = require('assert');
const parseColor = require('parse-color');

function mix(value1, value2, strength1, strength2) {
	var strengthSum = strength1 + strength2;
	if (strengthSum < 0.0000001) {
		return 0.0;
	}
	return (value1 * strength1 + value2 * strength2) / strengthSum;
}

function Color(red, green, blue, alpha) {
	if (typeof red === 'string') {
		return Color(parseColor(red).rgba.map((component, index) => (index < 3) ? component / 255.0 : component));
	}
	if (Array.isArray(red)) {
		assert((red.length === 3) || (red.length === 4), `Wrong color input: ${red}`);
		return { red: red[0], green: red[1], blue: red[2], alpha: red[3] || 1 };
	}
	return { red: red, green: green, blue: blue, alpha: alpha || 1 };
};

Color.clone = function(value) {
	return value ? Color(value.red, value.green, value.blue, value.alpha) : undefined;
},
Color.toCss = function(color) {
	return 'rgba(' + Math.floor(color.red * 255) + ',' + 
		Math.floor(color.green * 255) + ',' +
		Math.floor(color.blue * 255) + ',' +
		color.alpha + ')';
};
Color.toByteArray = function(color) {
	return [
		Math.floor(color.red * 255),
		Math.floor(color.green * 255),
		Math.floor(color.blue * 255),
		Math.floor(color.alpha * 255)
	];
};
Color.toArray3 = function(color) {
	return [color.red, color.green, color.blue];
};
Color.toArray4 = function(color) {
	return [color.red, color.green, color.blue, color.alpha];
};
Color.alphaBlend = function(color1, color2) {
	return Color(mix(color1.red, color2.red, color1.alpha, color2.alpha),
		mix(color1.green, color2.green, color1.alpha, color2.alpha),
		mix(color1.blue, color2.blue, color1.alpha, color2.alpha),
		Math.min(color1.alpha + color2.alpha, 1));
};
Color.equal = function(color1, color2) {
	return (color1.red == color2.red) &&
		(color1.green == color2.green) &&
		(color1.blue == color2.blue) &&
		(color1.alpha == color2.alpha);
};
Color.random = function() {
	return Color(Math.random(), Math.random(), Math.random(), 1);
};

module.exports = Color;