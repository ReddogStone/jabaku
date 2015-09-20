var PointLight = (function(module) {
	'use strict';

	return Jabaku.cloneSafeObject([
		{ name: 'pos', clone: Jabaku.safeClone, default: new Vector3() },
		{ name: 'color', clone: Color.clone, default: Color.make(0, 0, 0, 1) },
	]);
})();