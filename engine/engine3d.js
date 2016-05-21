'use strict';

const assert = require('assert');

const Extensions = require('./webgl-extensions');
const FrameProfiler = require('../profiler/profiler');
const BlendMode = require('./blend-mode');

module.exports = function(canvas, debug) {
	const WebGL = require('./webgl_utils')(debug);

	let gl = WebGL.setupWebGL(canvas, {antialias: true}, [Extensions.DEPTH_TEXTURE, Extensions.STANDARD_DERIVATIVES]);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.colorMask(true, true, true, true);
	
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
	gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);

	let debugPrograms = WebGL.createDebugPrograms(gl);
	let debugVb = createVertexBuffer([
		-1, 1, 0.0, 1.0,
		 1, 1, 1.0, 1.0,
		-1,-1, 0.0, 0.0,
		 1,-1, 1.0, 0.0
	]);
	let debugDesc = {
		aPosition: { components: 2, type: 'FLOAT', normalized: false, offset: 0, stride: 4 * 4},
		aTexCoord: { components: 2, type: 'FLOAT', normalized: false, offset: 2 * 4, stride: 4 * 4}
	};

	const EMPTY_IMAGE = document.createElement('canvas');
	EMPTY_IMAGE.width = 256;
	EMPTY_IMAGE.height = 256;
	let context = EMPTY_IMAGE.getContext('2d');
	context.fillStyle = 'white';
	context.fillRect(0, 0, EMPTY_IMAGE.width, EMPTY_IMAGE.height);
	context.fillStyle = 'black';
	context.font = 'normal 50px Trebuchet';
	context.textAlign = 'left';
	context.textBaseline = 'top';
	context.fillText('Not Sure', 40, 100);
	const EMPTY_TEXTURE = createTexture(EMPTY_IMAGE);

	function createVertexBufferWithSize(sizeInBytes, dynamic) {
		dynamic = dynamic || false;
		
		let buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, sizeInBytes, dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
		return buffer;
	}
	function createVertexBuffer(data, dynamic) {
		data = data || [];
		dynamic = dynamic || false;
	
		let buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
		return buffer;
	}
	function createIndexBufferWithSize(sizeInBytes) {
		let buffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sizeInBytes, gl.STATIC_DRAW);
		return buffer;
	}
	function createIndexBuffer(data) {
		data = data || [];
		
		let buffer = gl.createBuffer();
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

	function createProgram(vertexShader, fragmentShader, debugName) {
		let result = WebGL.createProgram(gl, vertexShader, fragmentShader);
		result._id = debugName;
		return result;
	}
	
	function handleLoadedTexture(texture) {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.generateMipmap(gl.TEXTURE_2D);
		
		gl.bindTexture(gl.TEXTURE_2D, null);
		
		texture.complete = true;
	}
	
	function createTexture(image) {
		let texture = gl.createTexture();
		texture.image = image;
		handleLoadedTexture(texture);
		return texture;
	}
	
	function createTextureFromFile(path) {
		let image = new Image();
		
		let texture = gl.createTexture();
		texture.image = image;
		
		image.onload = function() {
			handleLoadedTexture(texture);
		};
		image.src = path;

		return texture;
	}
	
	function createRenderTexture(size) {
		let texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 
			size.x, size.y, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		gl.bindTexture(gl.TEXTURE_2D, null);
		
		texture.complete = true;
		texture.width = size.x;
		texture.height = size.y;

		return texture;
	}

	function createDepthBuffer(size) {
		let depthBuffer = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, size.x, size.y);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);

		depthBuffer.width = size.x;
		depthBuffer.height = size.y;

		return depthBuffer;
	}

	function createDepthTexture(size) {
		let depthTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, depthTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, 
			size.x, size.y, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
		gl.bindTexture(gl.TEXTURE_2D, null);

		depthTexture.width = size.x;
		depthTexture.height = size.y;
		depthTexture.complete = true;

		return depthTexture;
	}
	
	function createFrameBuffer(renderTexture, depthTexture) {
		let frameBuffer = gl.createFramebuffer();

		gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, renderTexture, 0);

		if (depthTexture) {
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);
		} else {
			let depthBuffer = createDepthBuffer({ x: renderTexture.width, y: renderTexture.height });s
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
		}

		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		return frameBuffer;
	}

	function setFrameBuffer(frameBuffer) {
		gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	}

	function setDefaultFrameBuffer() {
		setFrameBuffer(null);
	}

	function setClearColor(red, green, blue, alpha) {
		gl.clearColor(red, green, blue, alpha);
	}

	function setClearDepth(value) {
		assert(value, 'No depth value given');
		gl.clearDepth(value);
	}
	
	function setViewport(x, y, sx, sy) {
		gl.viewport(x, y, sx, sy);
	}
	function setDefaultViewport() {
		gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	}
	
	function setMaterialParameter(location, type, value) {
		switch (type) {
			case 0x8B50: // FLOAT_VEC2
				assert.equal(value.length, 2);
				gl.uniform2fv(location, value);
				break;
			case 0x8B51: // FLOAT_VEC3
				assert.equal(value.length, 3);
				gl.uniform3fv(location, value);
				break;
			case 0x8B52: // FLOAT_VEC4
				assert.equal(value.length, 4);
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
				let texture = value.texture;
				if (!texture) {
					texture = EMPTY_TEXTURE;
				}
				if (texture && texture.complete) {
					let sampler = value.sampler || 0;
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
	
	function setProgramParameters(uniforms, parameters) {
		FrameProfiler.start('SetParameters');
		for (let paramName in uniforms) {
			let param = parameters[paramName];
			// if (paramName in uniforms) {
				FrameProfiler.start('SetParam_' + paramName);
				let info = uniforms[paramName];
				setMaterialParameter(info.location, info.type, param);
				FrameProfiler.stop();
			// }
		}
		FrameProfiler.stop();
	}
	
	function setProgram(program, parameters) {
		FrameProfiler.start('SetProgram');
	
		gl.useProgram(program);
		setProgramParameters(program.activeUniforms, parameters);
		FrameProfiler.stop();
	}

	function withBuffers(program, vb, ib, description, func) {
		setBuffers(program, vb, ib, description);
		func(renderTriangles);
	}

	function withProgramParameters(program, parameters, func) {
		setProgramParameters(program, parameters);
		func(withBuffers.bind(null, program));
	}

	function withProgram(program, func) {
		gl.useProgram(program);
		func(withProgramParameters.bind(null, program));
	}
	
	function setBlendMode(blendmode) {
		FrameProfiler.start('SetBlendmode');
		if (blendmode === BlendMode.SOLID) {
			gl.disable(gl.BLEND);
			gl.enable(gl.DEPTH_TEST);
			gl.depthMask(true);
			gl.blendFunc(gl.ONE, gl.ZERO);
		} else if (blendmode === BlendMode.ALPHA) {
			gl.enable(gl.BLEND);
			gl.enable(gl.DEPTH_TEST);
			gl.depthMask(false);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		} else if (blendmode === BlendMode.PREMUL_ALPHA) {
			gl.enable(gl.BLEND);
			gl.enable(gl.DEPTH_TEST);
			gl.depthMask(false);
			gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		} else if (blendmode === BlendMode.NONE) {
			gl.disable(gl.BLEND);
			gl.disable(gl.DEPTH_TEST);
			gl.depthMask(true);
			gl.blendFunc(gl.ONE, gl.ZERO);
		} else if (blendmode == BlendMode.DEPTH_PEELING) {
			gl.enable(gl.BLEND);
			gl.enable(gl.DEPTH_TEST);
			gl.depthMask(true);
			gl.blendFunc(gl.ONE, gl.ONE);
		}
		FrameProfiler.stop();
	}
	
	function setBuffers(program, vb, ib, description) {
		FrameProfiler.start('SetBuffers');
		gl.bindBuffer(gl.ARRAY_BUFFER, vb);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
		
		let attributes = program.activeAttributes;
		for (let name in description) {
			let desc = description[name];
			let index = attributes[name];
			if (index !== undefined) {
				gl.enableVertexAttribArray(index);
				gl.vertexAttribPointer(index, desc.components, gl[desc.type], desc.normalized, desc.stride, desc.offset);
			} else {
				throw new Error('No such attribute: "' + name + '" found in the program: "' + program._id + '"');
			}
		}
		FrameProfiler.stop();
	}
	
	function setVertexBuffer(program, vb, description) {
		FrameProfiler.start('SetBuffers');
		gl.bindBuffer(gl.ARRAY_BUFFER, vb);
		
		let attributes = program.activeAttributes;
		for (let name in description) {
			let desc = description[name];
			let index = attributes[name];
			if (index !== undefined) {
				gl.enableVertexAttribArray(index);
				gl.vertexAttribPointer(index, desc.components, gl[desc.type], desc.normalized, desc.stride, desc.offset);
			} else {
				throw new Error('No such attribute: "' + name + '" found in the program: "' + program._id + '"');
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
	
	function getDrawingBufferSize() {
		return { x: gl.drawingBufferWidth, y: gl.drawingBufferHeight };
	}

	function clear() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}
	
	function renderTriangles(count, offset) {
		FrameProfiler.start('RenderTriangles');
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, offset);
		FrameProfiler.stop();
	}

	function renderDebugQuad(texture, x, y, sx, sy) {
		setProgram(debugPrograms.textureCopy, { uTexture: {texture: texture, sampler: 0} });
		setBlendMode(BlendMode.NONE);
		setViewport(x, y, sx, sy);
		renderScreenQuad(debugPrograms.textureCopy);
	}

	function renderDepthTexture(texture, x, y, sx, sy) {
		setProgram(debugPrograms.depthTextureCopy, { uTexture: {texture: texture, sampler: 0} });
		setBlendMode(BlendMode.NONE);
		setViewport(x, y, sx, sy);
		renderScreenQuad(debugPrograms.depthTextureCopy);
	}

	function renderScreenQuad(program) {
		setVertexBuffer(program, debugVb, debugDesc);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}
	
	return {
		createVertexBufferWithSize: createVertexBufferWithSize,
		createVertexBuffer: createVertexBuffer,
		createIndexBufferWithSize: createIndexBufferWithSize,
		createIndexBuffer: createIndexBuffer,
		createRenderTexture: createRenderTexture,
		createDepthTexture: createDepthTexture,
		createFrameBuffer: createFrameBuffer,
		createProgram: createProgram,
		createTexture: createTexture,
		createTextureFromFile: createTextureFromFile,

		changeVertexBufferData: changeVertexBufferData,
		changeIndexBufferData: changeIndexBufferData,
		updateVertexBufferData: updateVertexBufferData,
		updateIndexBufferData: updateIndexBufferData,

		setClearColor: setClearColor,
		setClearDepth: setClearDepth,
		setViewport: setViewport,
		setDefaultViewport: setDefaultViewport,
		setProgramParameters: setProgramParameters,
		setProgram: setProgram,
		withProgram: withProgram,
		setBlendMode: setBlendMode,
		setBuffers: setBuffers,
		setVertexBuffer: setVertexBuffer,
		setFrameBuffer: setFrameBuffer,
		setDefaultFrameBuffer: setDefaultFrameBuffer,

		reloadTextureImage: reloadTextureImage,

		clear: clear,

		renderTriangles: renderTriangles,
		renderScreenQuad: renderScreenQuad,
		renderDebugQuad: renderDebugQuad,
		renderDepthTexture: renderDepthTexture,

		getDrawingBufferSize: getDrawingBufferSize,
		get gl() {
			return gl;
		}
	};
};
