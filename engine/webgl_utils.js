'use strict';

var WebGL = (function() {
	var ENABLE_DEBUG = true;

	/**
	 * Creates a webgl context.
	 */
	function create3DContext(canvas, attributes) {
		var names = ["webgl", "experimental-webgl"];
		var context = null;
		for (var i = 0; i < names.length; ++i) {
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

		return ENABLE_DEBUG ? WebGLDebugUtils.makeDebugContext(context) : context;
	}

	/**
	 * Creates a webgl context.
	 */
	function setupWebGL(canvas, attributes) {
		if (!window.WebGLRenderingContext) {
			throw new Error('Browser doesn\'t support WebGL!');
		}

		var context = create3DContext(canvas, attributes);
		if (!context) {
			throw new Error('Couldn\'t create a WebGL context!');
		}
		return context;
	};

	/**
	 * Loads a shader.
	 */
	function loadShader(gl, source, type) {
		var shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
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
		var program = gl.createProgram();
		for (var i = 0; i < shaders.length; ++i) {
			gl.attachShader(program, shaders[i]);
		}
		gl.linkProgram(program);

		var attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
		var attributes = {};
		for (var i = 0; i < attributeCount; ++i) {
			var info = gl.getActiveAttrib(program, i);
			gl.bindAttribLocation(program, i, info.name);
			attributes[info.name] = i;
		}
		program.activeAttributes = attributes;

		var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
		var uniforms = {};
		for (var i = 0; i < uniformCount; ++i) {
			var info = gl.getActiveUniform(program, i);
			uniforms[info.name] = {type: info.type, location: gl.getUniformLocation(program, info.name)};
		}
		program.activeUniforms = uniforms;
		
		var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (!linked) {
			throw new Error('Linking error: ' + gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
			return null;
		}
		
		return program;
	};

	/**
	 * Loads a shader from a string.
	 */
	function createShader(gl, source, type) {
		var shader = null;
		try {
			shader = loadShader(gl, source, type);
		} catch (e) {
			e.message = 'Error compiling\n\n' + source + '\n\n: ' + e.message;
			throw e;
		}
		
		return shader;
	};

	/**
	 * Creates a program from 2 files
	 */
	function createProgram(gl, vertexShader, fragmentShader) {
		var shaders = [
			createShader(gl, vertexShader, gl.VERTEX_SHADER),
			createShader(gl, fragmentShader, gl.FRAGMENT_SHADER)
		];
		return loadProgram(gl, shaders);
	};


	return {
		createShader: createShader,
		createProgram: createProgram,
		setupWebGL: setupWebGL
	}
}());
