'use strict';

const WebGLDebugUtils = require('./webgl-debug');

function getExtensions(gl, extensions) {
	let result = {};

	if (extensions) {
		for (let i = 0; i < extensions.length; ++i) {
			let extDesc = extensions[i];
			let extension;
			for (let extNameIdx = 0; extNameIdx < extDesc.names.length; ++j) {
				let extName = extDesc.names[extNameIdx];
				extension = gl.getExtension(extName);
				if (extension !== undefined) {
					break;
				}
			}

			if (extension !== undefined) {
				result[extDesc.id] = extension;
			} else {
				console.log('Failed to load "' + extDesc.id + '" extension!');
			}
		}
	}

	return result;
}

/**
 * Loads a shader.
 */
function loadShader(gl, source, type) {
	let shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (!compiled) {
		throw new Error(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

/**
 * Creates a program with shaders attached and binds the attribute locations.
 * It also links the program.
 */
function loadProgram(gl, shaders) {
	let program = gl.createProgram();
	for (let i = 0; i < shaders.length; ++i) {
		gl.attachShader(program, shaders[i]);
	}
	gl.linkProgram(program);

	let attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
	let attributes = {};
	for (let i = 0; i < attributeCount; ++i) {
		let info = gl.getActiveAttrib(program, i);
		gl.bindAttribLocation(program, i, info.name);
		attributes[info.name] = i;
	}
	program.activeAttributes = attributes;

	let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
	let uniforms = {};
	for (let i = 0; i < uniformCount; ++i) {
		let info = gl.getActiveUniform(program, i);
		uniforms[info.name] = {type: info.type, location: gl.getUniformLocation(program, info.name)};
	}
	program.activeUniforms = uniforms;
	
	let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!linked) {
		throw new Error('Linking error: ' + gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
		return null;
	}
	
	return program;
}

/**
 * Loads a shader from a string.
 */
function createShader(gl, source, type) {
	let shader = null;
	try {
		shader = loadShader(gl, source, type);
	} catch (e) {
		e.message = 'Error compiling\n\n' + source + '\n\n: ' + e.message;
		throw e;
	}
	
	return shader;
}

/**
 * Creates a program from 2 files
 */
function createProgram(gl, vertexShader, fragmentShader) {
	let shaders = [
		createShader(gl, vertexShader, gl.VERTEX_SHADER),
		createShader(gl, fragmentShader, gl.FRAGMENT_SHADER)
	];
	return loadProgram(gl, shaders);
}

function createDebugPrograms(gl) {
	let vsText = [
		"attribute vec2 aPosition;",
		"attribute vec2 aTexCoord;",

		"varying vec2 vTexCoord;",

		"void main() {",
		"	vTexCoord = aTexCoord;",
		"	gl_Position = vec4(aPosition, 0.5, 1.0);",
		"}"
	].join('\n');
	let fsText = [
		"precision mediump float;",

		"varying vec2 vTexCoord;",

		"uniform sampler2D uTexture;",

		"void main() {",
		"	gl_FragColor = vec4(texture2D(uTexture, vTexCoord).rgb, 1.0);",
		"}"
	].join('\n');
	let fsDepthText = [
		"precision mediump float;",

		"varying vec2 vTexCoord;",

		"uniform sampler2D uTexture;",

		"void main() {",
		"	float depth = texture2D(uTexture, vTexCoord).r;",
		"	float gray = log(1.0 / ((1.0 - depth) + 0.0001)) / log(10000.0);",
		"	gl_FragColor = vec4(gray, gray, gray, 1.0);",
		"}"
	].join('\n');

	return {
		textureCopy: createProgram(gl, vsText, fsText),
		depthTextureCopy: createProgram(gl, vsText, fsDepthText)
	};
}

module.exports = function(enableDebug) {
	function create3DContext(canvas, attributes, extensions) {
		let names = ["webgl", "experimental-webgl"];
		let context = null;
		for (let i = 0; i < names.length; ++i) {
			try {
				context = canvas.getContext(names[i], attributes);
			} catch(e) {
				console.log(e);
				console.log(e.stack);
			}
			if (context) {
				break;
			}
		}

		if (!context) {
			throw new Error('Couldn\'t create a WebGL context!');
		}

		context.extensions = getExtensions(context, extensions);

		return enableDebug ? WebGLDebugUtils.makeDebugContext(context) : context;
	}

	/**
	 * Creates a webgl context.
	 */
	function setupWebGL(canvas, attributes, extensions) {
		if (!window.WebGLRenderingContext) {
			throw new Error('Browser doesn\'t support WebGL!');
		}

		let context = create3DContext(canvas, attributes, extensions);
		if (!context) {
			throw new Error('Couldn\'t create a WebGL context!');
		}
		return context;
	};

	return {
		createShader: createShader,
		createProgram: createProgram,
		createDebugPrograms: createDebugPrograms,
		setupWebGL: setupWebGL
	}
};
