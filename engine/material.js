'use strict';

function Material(engine, programId, blendMode) {
	this._program = engine.getProgram(programId);
	this.blendMode = blendMode;
}
Material.extends(Object, {
	get program() {
		return this._program;
	}
});

function SimpleMaterial(engine, texture, color, luminosity) {
	Material.call(this, engine, 'simple', BlendMode.SOLID);
	this._texture = texture;
	this._color = Color.clone(color) || Color.white;
	this._luminosity = luminosity || 0;
}
SimpleMaterial.extends(Material, {
	get color() {
		return this._color;
	},
	set color(value) {
		this._color = Color.clone(value);
	},
	get luminosity() {
		return this._luminosity;
	},
	set luminosity(value) {
		this._luminosity = value;
	},
	get texture() {
		return this._texture;
	},
	setParams: function(globalParams) {
		globalParams.uTexture = {texture: this._texture, sampler: 0};
		globalParams.uColor = this._color.toArray4();
		globalParams.uLuminosity = this._luminosity;
	}
});

function SimpleInstMaterial(engine, texture) {
	this._texture = texture;
	this._programs = {
		regular: engine.getProgram('simple_instanced'),
		wireframe: engine.getProgram('wireframe_instanced'),
		depthPeeling: engine.getProgram('simple_instanced_dp'),
		id: engine.getProgram('id_instanced')
	};
	this.blendMode = BlendMode.PREMUL_ALPHA;
}
SimpleInstMaterial.extends(Object, {
	get programs() {
		return this._programs;
	},
	get texture() {
		return this._texture;
	},
	setParams: function(globalParams) {
		globalParams.uTexture = {texture: this._texture, sampler: 0};
	}
});

function ScreenSpaceMaterial(engine, texture, color) {
	Material.call(this, engine, 'screenspace', BlendMode.PREMUL_ALPHA);
	this._texture = texture;
	this._color = Color.clone(color) || Color.white;
}
ScreenSpaceMaterial.extends(Material, {
	get color() {
		return this._color;
	},
	set color(value) {
		this._color = Color.clone(value);
	},
	get texture() {
		return this._texture;
	},
	setParams: function(globalParams) {
		globalParams.uTexture = {texture: this._texture, sampler: 0};
		globalParams.uColor = this._color.toArray4();
	}
});

function TextMaterial(engine, texture, color) {
	Material.call(this, engine, 'text', BlendMode.PREMUL_ALPHA);
	this._texture = texture;
	this._color = Color.clone(color) || Color.white;
}
TextMaterial.extends(Material, {
	get color() {
		return this._color;
	},
	set color(value) {
		this._color = Color.clone(value);
	},
	get texture() {
		return this._texture;
	},
	setParams: function(globalParams) {
		globalParams.uTexture = {texture: this._texture, sampler: 0};
		globalParams.uColor = this._color.toArray4();
	}
});

function PointSpriteMaterial(engine, texture, size, color) {
	Material.call(this, engine, 'pointsprite', BlendMode.PREMUL_ALPHA);
	this._size = size || new Vecmath.Vector2(64, 64);
	this._texture = texture;
	this._color = Color.clone(color) || Color.white;
}
PointSpriteMaterial.extends(Material, {
	get size() {
		return this._size;
	},
	set size(value) {
		this._size = value.clone();
	},
	get color() {
		return this._color;
	},
	set color(value) {
		this._color = Color.clone(value);
	},
	get texture() {
		return this._texture;
	},
	setParams: function(globalParams) {
		globalParams.uTexture = {texture: this._texture, sampler: 0};
		globalParams.uColor = this._color.toArray4();
		globalParams.uSize = this._size.toArray();
	}
});

function PointSpriteInstMaterial(engine, texture) {
	Material.call(this, engine, 'pointsprite_instanced', BlendMode.PREMUL_ALPHA);
	this._texture = texture;
}
PointSpriteInstMaterial.extends(Material, {
	get texture() {
		return this._texture;
	},
	setParams: function(globalParams) {
		globalParams.uTexture = {texture: this._texture, sampler: 0};
	}
});

function LineMaterial(engine, patternTexture, width, color) {
	Material.call(this, engine, 'line', BlendMode.PREMUL_ALPHA);
	this._width = width ? width : 1.0;
	this._texture = patternTexture;
	this._color = Color.clone(color) || Color.white;
}
LineMaterial.extends(Material, {
	get width() {
		return this._width;
	},
	set width(value) {
		this._width = value;
	},
	get color() {
		return this._color;
	},
	set color(value) {
		this._color = Color.clone(value);
	},
	get texture() {
		return this._texture;
	},
	setParams: function(globalParams) {
		globalParams.uTexture = {texture: this._texture, sampler: 0};
		globalParams.uColor = this._color.toArray4();
		globalParams.uWidth = [this._width];
	}
});

function LineInstMaterial(engine, texture) {
	Material.call(this, engine, 'line_instanced', BlendMode.PREMUL_ALPHA);
	this._texture = texture;
}
LineInstMaterial.extends(Material, {
	get texture() {
		return this._texture;
	},
	setParams: function(globalParams) {
		globalParams.uTexture = {texture: this._texture, sampler: 0};
	}
});
