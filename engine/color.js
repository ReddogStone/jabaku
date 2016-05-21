'use strict';

function mix(value1, value2, strength1, strength2) {
	var strengthSum = strength1 + strength2;
	if (strengthSum < 0.0000001) {
		return 0.0;
	}
	return (value1 * strength1 + value2 * strength2) / strengthSum;
}

function Color(red, green, blue, alpha) {
	return { red: red, green: green, blue: blue, alpha: alpha };
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

module.exports = Color;