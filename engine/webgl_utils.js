'use strict';

var Extensions = {
	DEPTH_TEXTURE: {
		id: 'DEPTH_TEXTURE',
		names: ['WEBGL_depth_texture', 'WEBKIT_WEBGL_depth_texture']
	}
};

var WebGL = (function() {
	var ENABLE_DEBUG = true;

	function getExtensions(gl, extensions) {
		var result = {};

		if (extensions) {
			for (var i = 0; i < extensions.length; ++i) {
				var extDesc = extensions[i];
				var extension;
				for (var extNameIdx = 0; extNameIdx < extDesc.names.length; ++j) {
					var extName = extDesc.names[extNameIdx];
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

	function create3DContext(canvas, attributes, extensions) {
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

		context.extensions = getExtensions(context, extensions);

		return ENABLE_DEBUG ? WebGLDebugUtils.makeDebugContext(context) : context;
	}

	/**
	 * Creates a webgl context.
	 */
	function setupWebGL(canvas, attributes, extensions) {
		if (!window.WebGLRenderingContext) {
			throw new Error('Browser doesn\'t support WebGL!');
		}

		var context = create3DContext(canvas, attributes, extensions);
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
	}

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
	}

	/**
	 * Creates a program from 2 files
	 */
	function createProgram(gl, vertexShader, fragmentShader) {
		var shaders = [
			createShader(gl, vertexShader, gl.VERTEX_SHADER),
			createShader(gl, fragmentShader, gl.FRAGMENT_SHADER)
		];
		return loadProgram(gl, shaders);
	}

	function createDebugProgram(gl) {
		var vsText = [
			"attribute vec2 aPosition;",
			"attribute vec2 aTexCoord;",

			"varying vec2 vTexCoord;",

			"void main() {",
			"	vTexCoord = aTexCoord;",
			"	gl_Position = vec4(aPosition, 0.5, 1.0);",
			"}"
		].join('\n');
		var fsText = [
			"precision mediump float;",

			"varying vec2 vTexCoord;",

			"uniform sampler2D uTexture;",

			"void main() {",
			"	gl_FragColor = vec4(texture2D(uTexture, vTexCoord).rgb, 1.0);",
			"}"
		].join('\n');

		return createProgram(gl, vsText, fsText);
	}

	return {
		createShader: createShader,
		createProgram: createProgram,
		createDebugProgram: createDebugProgram,
		setupWebGL: setupWebGL,
		setDebug: function(value) {
			ENABLE_DEBUG = !!value;
		}
	}
}());
