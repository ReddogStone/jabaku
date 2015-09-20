var Camera = (function() {
	'use strict';

	return Jabaku.cloneSafeObject([
		{ name: 'projection', clone: Jabaku.safeClone, default: new Matrix4() },
		{ name: 'view', clone: Jabaku.safeClone, default: new Matrix4() },
		{ name: 'target', clone: Jabaku.safeClone, default: new Vector3(0, 0, 1) },
		{ name: 'pos', clone: Jabaku.safeClone, default: new Vector3(0, 0, 0) }
	]);
})();