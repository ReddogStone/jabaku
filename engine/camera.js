var Camera = (function() {
	'use strict';

	var result = Jabaku.cloneSafeObject([
		{ name: 'projection', clone: Jabaku.safeClone, default: new Matrix4() },
		{ name: 'pos', clone: Jabaku.safeClone, default: new Vector3(0, 0, 0) },
		{ name: 'target', clone: Jabaku.safeClone, default: new Vector3(0, 0, 1) },
		{ name: 'up', clone: Jabaku.safeClone, default: new Vector3(0, 1, 0) },
	]);
	result.makeParameters = function(camera) {
		return {
			uView: Matrix4.lookAt(camera.pos, camera.target, camera.up).val,
			uProjection: camera.projection.val,
			uPosCamera: camera.pos.toArray()
		}
	};
	return result;
})();