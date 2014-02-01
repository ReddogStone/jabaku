'use strict';

var FileUtils = (function() {
	/**
	 * Loads a shader from a file.
	 */
	function loadFile(path) {
		var request = new XMLHttpRequest();
		request.open('GET', path, false);
		request.send();
		
		if (!request.responseText) {
			throw new Error('Could not load file "' + path + '"!');
		}
		
		return request.responseText;
	};
	return {
		loadFile: loadFile
	}
}());
