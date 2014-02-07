var Jabaku = (function(module) {
	function EntitySystem() {
		this._entities = [];
		this._nextId = 0;
	}
	EntitySystem.extends(Object, {
		get entities() {
			return this._entities;
		},
		add: function() {
			var id = this._nextId++;
			this._entities.push(id);
			return id;
		},
		remove: function() {
			this._entities.remove(id);
		}
	});

	module.EntitySystem = EntitySystem;
	return module;
})(Jabaku || {});
