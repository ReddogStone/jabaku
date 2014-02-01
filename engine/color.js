'use strict';

function Color(red, green, blue, alpha) {
	this.red = red || 0.0;
	this.green = green || 0.0;
	this.blue = blue || 0.0;
	this.alpha = (alpha !== undefined) ? alpha : 1.0;
}

Color.extends(Object, {
	toString: function() {
		var red = Math.floor(this.red * 255.0);
		var green = Math.floor(this.green * 255.0);
		var blue = Math.floor(this.blue * 255.0);
		return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + this.alpha + ')';
	},
	toArray3: function() {
		return [this.red, this.green, this.blue];
	},
	toArray4: function() {
		return [this.red, this.green, this.blue, this.alpha];
	}
});

Color.clone = function(value) {
	if (value) {
		if (typeof value == 'string') {
			if (value in Color) {
				return Color[value];
			}
		} else {
			return new Color(value.red, value.green, value.blue, value.alpha);
		}
	}
	return undefined;
}
Color.equal = function(val1, val2) {
	return (val1.red == val2.red) && (val1.green == val2.green) && (val1.blue == val2.blue) && (val1.alpha == val2.alpha);
}

Object.defineProperty(Color, 'white', {get: function() { return new Color(1, 1, 1, 1); } })
Object.defineProperty(Color, 'black', {get: function() { return new Color(0, 0, 0, 1); } })
Object.defineProperty(Color, 'red', {get: function() { return new Color(1, 0, 0, 1); } })
Object.defineProperty(Color, 'green', {get: function() { return new Color(0, 1, 0, 1); } })
Object.defineProperty(Color, 'blue', {get: function() { return new Color(0, 0, 1, 1); } })
Object.defineProperty(Color, 'gray', {get: function() { return new Color(0.25, 0.25, 0.25, 1); } })
Object.defineProperty(Color, 'transparentBlack', {get: function() { return new Color(0, 0, 0, 0); } })
