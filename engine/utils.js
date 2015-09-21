var Jabaku = (function(module) {
	'use strict';

	Object.values = function(obj) {
		return Object.keys(obj).map(function(key) { return obj[key]; });
	};
	Object.mixin = function(obj, properties) {
		if (properties) {
			var names = Object.keys(properties);
			for (var i = 0; i < names.length; ++i) {
				var property = names[i];
				var descriptor = Object.getOwnPropertyDescriptor(properties, property);
				Object.defineProperty(obj, property, descriptor);
			}
		}
	};

	function copyTo(from, to) {
		Object.keys(from).forEach(function(key) {
			to[key] = from[key];
		});
	}
	Object.clone = function(obj) {
		var result = {};
		copyTo(obj, result);
		return result;
	};

	function merge(obj1, obj2) {
		var result = {};
		copyTo(obj1, result);
		copyTo(obj2, result);
		return result;		
	}

	Object.merge = function() {
		return Array.prototype.reduce.call(arguments, merge);
	};

	Object.defineProperty(Array.prototype, 'remove', {value: function(element) {
		var index = this.indexOf(element);
		if (index > -1) {
			var result = this.splice(index, 1);
			if (result.length === 1) {
				return result[0];
			} else {	
				return null;
			}
		}
	}});

	Object.defineProperty(Array.prototype, 'clear', {value: function() {
		this.length = 0;
	}});

	Object.defineProperty(Array.prototype, 'first', {value: function() {
		if (this.length > 0) {
			return this[0];
		}
		return null;
	}});

	Object.defineProperty(Array.prototype, 'last', {value: function() {
		var length = this.length;
		if (length > 0) {
			return this[length - 1];
		}
		return null;
	}});

	Object.defineProperty(Array.prototype, 'reverseForEach', {value: function(callback, thisArg) {
		var i, 
			length = this.length;
		for (i = length - 1; i >= 0; --i) {
			if (this.hasOwnProperty(i)) {
				callback.call(thisArg, this[i], i, this);
			}
		}
	}});

	Object.defineProperty(Array.prototype, 'reverseSome', {value: function(callback, thisArg) {
		var i,
			length = this.length;
		for (i = length - 1; i >= 0; --i) {
			if (this.hasOwnProperty(i) && callback.call(thisArg, this[i], i, this)) {
				return true;
			}
		}
		
		return false;
	}});

	Object.defineProperty(Array.prototype, 'flatten', {value: function() {
		return this.reduce(function(memo, current) {
			return memo.concat(current);
		}, []);
	}});

	Object.defineProperty(Function.prototype, 'extends', {value: function(parent, methods) {
	    this.prototype = Object.create(parent.prototype);
	    Object.defineProperty(this.prototype, 'constructor', {value: this});
		
		Object.mixin(this.prototype, methods);
	}});



	function padNumber(number, width) {
		return ('00000000' + number).slice(-width);
	}

	function numberToStringWithSign(number) {
		return (number >= 0) ? ('+' + number) : number.toString();
	}

	function integerDifference(number1, number2) {
		return Math.ceil(number1) - Math.ceil(number2);
	}

	module.padNumber = padNumber;
	module.numberToStringWithSign = numberToStringWithSign;
	module.integerDifference = integerDifference;

	module.cloneSafeObject = function(desc) {
		var values = {};

		var make = function() {
			var args = arguments;

			var result = {};

			desc.forEach(function(type, index) {
				var key = type.name;
				var clone = type.clone || function(value) { return value; };
				values[key] = clone(args[index]) || type.default;

				Object.defineProperty(result, key, {
					get: function() { return values[key]; },
					set: function(value) { values[key] = clone(value); }
				});
			});

			return result;
		};

		return {
			make: make,
			clone: function(value) {
				return value ? make.apply(null, desc.map(function(type) { return value[type.name]; })) : undefined;
			}
		};
	};

	module.safeClone = function(value) {
		return value ? value.clone() : undefined;
	};

	return module;
})(Jabaku || {});
