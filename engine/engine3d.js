'use strict';

var BlendMode = {
	SOLID: {name: 'SOLID'},
	ALPHA: {name: 'ALPHA'},
	PREMUL_ALPHA: {name: 'PREMUL_ALPHA'},
};

var Engine3D = (function() {
	var gl = null;
	var currentProgram = null;
	
	var shaderPrograms = {};
	var textures = {};

	function init(canvas) {
		gl = WebGL.setupWebGL(canvas);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LESS);
		
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
		gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
	}

	function createVertexBufferWithSize(sizeInBytes, dynamic) {
		dynamic = dynamic || false;
		
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, sizeInBytes, dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
		return buffer;
	}
	function createVertexBuffer(data, dynamic) {
		data = data || [];
		dynamic = dynamic || false;
	
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
		return buffer;
	}
	function createIndexBufferWithSize(sizeInBytes) {
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sizeInBytes, gl.STATIC_DRAW);
		return buffer;
	}
	function createIndexBuffer(data) {
		data = data || [];
		
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
		return buffer;
	}
	function changeVertexBufferData(buffer, data, dynamic) {
		dynamic = dynamic || false;
	
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
	}
	function changeIndexBufferData(buffer, data, offset) {
		offset = offset || 0;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
		gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, offset, new Uint16Array(data), gl.STATIC_DRAW);
	}
	function updateVertexBufferData(buffer, data, offset) {
		offset = offset || 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, offset, new Float32Array(data));
	}
	function updateIndexBufferData(buffer, data) {
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
		gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(data));
	}

	function createProgram(id, vertexShader, fragmentShader) {
		var program = WebGL.createProgram(gl, vertexShader, fragmentShader);
		program._id = id;
		shaderPrograms[id] = program;
	}
	function getProgram(id) {
		var result = shaderPrograms[id];
		if (!result) {
			throw new Error('No shader program with id: "' + id + '"');
		}
		return result;
	}
	
	function handleLoadedTexture(texture) {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.generateMipmap(gl.TEXTURE_2D);
		
		gl.bindTexture(gl.TEXTURE_2D, null);
		
		texture.complete = true;
	}
	
	function createTexture(image) {
		var texture = gl.createTexture();
		texture.image = image;
		handleLoadedTexture(texture);
		return texture;
	}
	
	function createTextureFromFile(id, path) {
		var image = new Image();
		
		var texture = gl.createTexture();
		texture.image = image;
		
		image.onload = function() { handleLoadedTexture(texture); };
		image.src = path;
		
		textures[id] = texture;
	}
	
	function getTexture(id) {
		var result = textures[id];
		if (!result) {
			throw new Error('No texture with id: "' + id + '"');
		}
		return result;
	}
	
	function setClearColor(color) {
		gl.clearColor(color.red, color.green, color.blue, 1.0);		
	}
	
	function setViewport(value) {
		gl.viewport(value.x, value.y, value.sx, value.sy);		
	}
	
	function setMaterialParameter(location, type, value) {
		switch (type) {
			case 0x8B50: // FLOAT_VEC2
				gl.uniform2fv(location, value);
				break;
			case 0x8B51: // FLOAT_VEC3
				gl.uniform3fv(location, value);
				break;
			case 0x8B52: // FLOAT_VEC4
				gl.uniform4fv(location, value);
				break;
			case 0x8B53: // INT_VEC2
				gl.uniform2iv(location, value);
				break;
			case 0x8B54: // INT_VEC3
				gl.uniform3iv(location, value);
				break;
			case 0x8B55: // INT_VEC4
				gl.uniform4iv(location, value);
				break;
			case 0x8B56: // BOOL
				gl.uniform1iv(location, value);
				break;
			case 0x8B57: // BOOL_VEC2
				gl.uniform2iv(location, value);
				break;
			case 0x8B58: // BOOL_VEC3
				gl.uniform3iv(location, value);
				break;
			case 0x8B59: // BOOL_VEC4
				gl.uniform4iv(location, value);
				break;
			case 0x8B5A: // FLOAT_MAT2
				gl.uniformMatrix2fv(location, false, value);
				break;
			case 0x8B5B: // FLOAT_MAT3
				gl.uniformMatrix3fv(location, false, value);
				break;
			case 0x8B5C: // FLOAT_MAT4
				gl.uniformMatrix4fv(location, false, value);
				break;
			case 0x8B5E: // SAMPLER_2D
				var texture = value.texture;
				if (texture.complete) {
					var sampler = value.sampler;
					gl.activeTexture(gl['TEXTURE' + sampler]);
					gl.bindTexture(gl.TEXTURE_2D, texture);
					gl.uniform1i(location, sampler);
				}
				break;
			case 0x8B60: // SAMPLER_CUBE
//				gl.uniform2fv(location, value);
				break;
			case 0x1400: // BYTE
				gl.uniform1iv(location, value);
				break;
			case 0x1401: // UNSIGNED_BYTE
				gl.uniform1iv(location, value);
				break;
			case 0x1402: // SHORT
				gl.uniform1iv(location, value);
				break;
			case 0x1403: // UNSIGNED_SHORT
				gl.uniform1iv(location, value);
				break;
			case 0x1404: // INT
				gl.uniform1iv(location, value);
				break;
			case 0x1405: // UNSIGNED_INT
				gl.uniform1iv(location, value);
				break;
			case 0x1406: // FLOAT
				gl.uniform1f(location, value);
				break;
		}
	}
	
	function setProgramParameters(parameters) {
		FrameProfiler.start('SetParameters');
		var uniforms = currentProgram.activeUniforms;
		for (var paramName in parameters) {
			var param = parameters[paramName];
			if (paramName in uniforms) {
				FrameProfiler.start('SetParam_' + paramName);
				var info = uniforms[paramName];				
				setMaterialParameter(info.location, info.type, param);
				FrameProfiler.stop();
			}
		}
		FrameProfiler.stop();		
	}
	
	function setProgram(program, parameters) {
		FrameProfiler.start('SetProgram');
	
		gl.useProgram(program);
		currentProgram = program;
		setProgramParameters(parameters);
		FrameProfiler.stop();
	}
	
	function setBlendMode(blendmode) {
		FrameProfiler.start('SetBlendmode');
		if (blendmode === BlendMode.SOLID) {
			gl.disable(gl.BLEND);
			gl.enable(gl.DEPTH_TEST);
		} else if (blendmode === BlendMode.ALPHA) {
			gl.enable(gl.BLEND);
			gl.disable(gl.DEPTH_TEST);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		} else if (blendmode === BlendMode.PREMUL_ALPHA) {
			gl.enable(gl.BLEND);
			gl.disable(gl.DEPTH_TEST);
			gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		}
		FrameProfiler.stop();
	}
	
	function setBuffers(vb, ib, description) {
		FrameProfiler.start('SetBuffers');
		gl.bindBuffer(gl.ARRAY_BUFFER, vb);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
		
		var attributes = currentProgram.activeAttributes;
		for (var name in description) {
			var desc = description[name];
			var index = attributes[name];
			if (index !== undefined) {
				gl.enableVertexAttribArray(index);
				gl.vertexAttribPointer(index, desc.components, gl[desc.type], desc.normalized, desc.stride, desc.offset);
			} else {
				throw new Error('No such attribute: "' + name + '" found in the program: "' + currentProgram._id + '"');
			}
		}
		FrameProfiler.stop();
	}
	
	function setVertexBuffer(vb, description) {
		FrameProfiler.start('SetBuffers');
		gl.bindBuffer(gl.ARRAY_BUFFER, vb);
		
		var attributes = currentProgram.activeAttributes;
		for (var name in description) {
			var desc = description[name];
			var index = attributes[name];
			if (index !== undefined) {
				gl.enableVertexAttribArray(index);
				gl.vertexAttribPointer(index, desc.components, gl[desc.type], desc.normalized, desc.stride, desc.offset);
			} else {
				throw new Error('No such attribute: "' + name + '" found in the program: "' + currentProgram._id + '"');
			}
		}
		FrameProfiler.stop();
	}
	
	function reloadTextureImage(texture) {
		FrameProfiler.start('ReloadTextureImage');
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);			
		FrameProfiler.stop();
	}	
	
	function clear() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}
	
	function renderTriangles(count, offset) {
		FrameProfiler.start('RenderTriangles');
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, offset);
		FrameProfiler.stop();
	}
	
	function getDrawingBufferSize() {
		return {x: gl.drawingBufferWidth, y: gl.drawingBufferHeight};
	}
	
	return {
		init: init,
		createVertexBufferWithSize: createVertexBufferWithSize,
		createVertexBuffer: createVertexBuffer,
		createIndexBufferWithSize: createIndexBufferWithSize,
		createIndexBuffer: createIndexBuffer,
		changeVertexBufferData: changeVertexBufferData,
		changeIndexBufferData: changeIndexBufferData,
		updateVertexBufferData: updateVertexBufferData,
		updateIndexBufferData: updateIndexBufferData,
		createProgram: createProgram,
		getProgram: getProgram,
		createTexture: createTexture,
		createTextureFromFile: createTextureFromFile,
		getTexture: getTexture,
		setClearColor: setClearColor,
		setViewport: setViewport,
		setProgramParameters: setProgramParameters,
		setProgram: setProgram,
		setBlendMode: setBlendMode,
		setBuffers: setBuffers,
		setVertexBuffer: setVertexBuffer,
		reloadTextureImage: reloadTextureImage,
		clear: clear,
		renderTriangles: renderTriangles,
		getDrawingBufferSize: getDrawingBufferSize,
		get gl() {
			return gl;
		}
	};
})();