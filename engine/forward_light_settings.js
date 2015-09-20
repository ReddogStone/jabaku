var ForwardLightSettings = (function() {
	'use strict';

	return Jabaku.cloneSafeObject([
		{ name: 'pointLight1', clone: PointLight.clone, default: PointLight.make(new Vector3(), Color.make(1, 1, 1, 1)) },
		{ name: 'pointLight2', clone: PointLight.clone, default: PointLight.make() },
		{ name: 'ambientColor', clone: Color.clone, default: Color.make(0, 0, 0, 1) }
	]);	
})();