var Jabaku = (function (module) {
	'use strict';
	
	function Font(family, size, weight, style) {
		this._family = family || 'Georgia';
		this._size = size || 12;
		this._weight = weight || '100';
		this._style = style || 'normal';
		this.onChanged = null;
	}
	Font.extends(Object, {
		get family() {
			return this._family;
		},
		set family(value) {
			this._family = value;
			if (this.onChanged) {
				this.onChanged();
			}
		},
		get size() {
			return this._size;
		},
		set size(value) {
			this._size = value;
			if (this.onChanged) {
				this.onChanged();
			}
		},
		get weight() {
			return this._weight;
		},
		set weight(value) {
			this._weight = value;
			if (this.onChanged) {
				this.onChanged();
			}
		},
		get style() {
			return this._style;
		},
		set style(value) {
			this._style = value;
			if (this.onChanged) {
				this.onChanged();
			}
		},
		toString: function() {
			return this.style + ' ' + this.weight + ' ' + this.size + 'pt ' + this.family;
		}
	});
	Font.clone = function(value) {
		return value ? new Font(value.family, value.size, value.weight, value.style) : new Font();
	}

	function TextBase(engine, text, font, color) {
		this._text = text || '';
		this._font = Font.clone(font) || new Font();
		this._color = Color.clone(color) || new Color();

		var canvas = this._bufferCanvas = document.createElement('canvas');
		canvas.width = canvas.height = 1;
		this._buffered = false;
	}
	TextBase.extends(Object, {
		_getSize: function() {
			var context = this._bufferCanvas.getContext('2d');
			context.font = this._font.toString();
			var width = context.measureText(this._text).width + 2;
			var height = 2 * this._font.size;
			return {x: width, y: height};
		},
		_adjustCanvasSize: function(size) {
			function nextPowerOf2(value) {
				--value;
				value = (value >> 1) | value;
				value = (value >> 2) | value;
				value = (value >> 4) | value;
				value = (value >> 8) | value;
				value = (value >> 16) | value;
				return ++value;
			}
		
			var width = nextPowerOf2(size.x);
			var height = nextPowerOf2(size.y);
//			width = height = Math.max(width, height);
			this._bufferCanvas.width = width;
			this._bufferCanvas.height = height;
			
			return {x: width, y: height};
		},
		get text() {
			return this._text;
		},
		set text(value) {
			if (value != this._text)  {
				this._text = value;
				this._buffered = false;
			}
		},
		prepare: function(engine) {
			var bufferCanvas = this._bufferCanvas;
			if (!this._buffered) {
				var size = this._getSize();
				var canvasSize = this._adjustCanvasSize(size);
				this._createMesh(engine, size, canvasSize);
				
				var context = bufferCanvas.getContext('2d');
				context.fillStyle = "rgba(0, 0, 0, 0)";
				context.fillRect(0, 0, bufferCanvas.width, bufferCanvas.height);			
				context.font = this._font.toString();
				context.fillStyle = 'white';
				context.textAlign = 'start';
				var sy = this._font.size;
				context.fillText(this._text, 0, 1.5 * sy);
				engine.reloadTextureImage(this.material.texture);
				
				this._buffered = true;
			}
		},
		setParams: function(globalParams) {
			if (this._screenOffset) {
				globalParams.uScreenOffset = this._screenOffset.toArray();
			}
			this.material.setParams(globalParams);
		},
		render: function(engine) {
			FrameProfiler.start('TextRender');
			this._mesh.render(engine);
			FrameProfiler.stop();
		}
	});
	
	function Text(engine, text, font, color, screenOffset) {
		TextBase.call(this, engine, text, font, color);
		this.material = new TextMaterial(engine, engine.createTexture(this._bufferCanvas), this._color);		
		this._screenOffset = screenOffset ? screenOffset.clone() : new Vecmath.Vector2(0.0, 0.0);
	}
	Text.extends(TextBase, {
		_createMesh: function(engine, size, canvasSize) {
			var su = size.x / canvasSize.x;
			var sv = size.y / canvasSize.y;
			var meshData = [
				{
					"vertices": [
						//x, y, tu, tv
						-0.5 * size.x,    0.0, 0.0,  sv,
						 0.5 * size.x,    0.0,  su,  sv,
						-0.5 * size.x, size.y, 0.0, 0.0,
						 0.5 * size.x, size.y,  su, 0.0],
					"indices": [0, 1, 2, 2, 1, 3],
					"description": {
						"aPosition": { "components": 2, "type": "FLOAT", "normalized": false, "stride": 4 * 4, "offset": 0 },
						"aTexCoord": { "components": 2, "type": "FLOAT", "normalized": false, "stride": 4 * 4, "offset": 2 * 4 }
					}
				}
			];
			this._mesh = Mesh.loadFromJson(engine, meshData);
		},
		get screenOffset() {
			return this._screenOffset;
		},
		set screenOffset(value) {
			this._screenOffset = value.clone();
		}
	});
	
	function ScreenText(engine, text, font, color) {
		TextBase.call(this, engine, text, font, color);
		this.material = new ScreenSpaceMaterial(engine, engine.createTexture(this._bufferCanvas), this._color);		
	}
	ScreenText.extends(TextBase, {
		_createMesh: function(engine, size, canvasSize) {
			var su = size.x / canvasSize.x;
			var sv = size.y / canvasSize.y;
			var meshData = [
				{
					"vertices": [
						//x, y, z, tu, tv
						0.0   , 0.0   , 0.0, 0.0,  sv,
						size.x, 0.0   , 0.0,  su,  sv,
						0.0   , size.y, 0.0, 0.0, 0.0,
						size.x, size.y, 0.0,  su, 0.0],
					"indices": [0, 1, 2, 2, 1, 3],
					"description": {
						"aPosition": { "components": 3, "type": "FLOAT", "normalized": false, "stride": 5 * 4, "offset": 0 },
						"aTexCoord": { "components": 2, "type": "FLOAT", "normalized": false, "stride": 5 * 4, "offset": 3 * 4 }
					}
				}
			];
			this._mesh = Mesh.loadFromJson(engine, meshData);
		}
	});

	module.Font = Font;
	module.Text = Text;
	module.ScreenText = ScreenText;
	return module;
})(Jabaku || {});