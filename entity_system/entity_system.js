var Jabaku = (function(module) {
	'use strict';

	function Entity(entitySystem, debugName) {
		this._debugName = debugName;
		this._entitySystem = entitySystem;
		this._components = {};
	}
	Entity.extends(Object, {
		get debugName() {
			return this._debugName;
		},
		get: function(componentConstructor) {
			return this._components[componentConstructor.type];
		},
		add: function(component) {
			this._components[component.type] = component;
			this._entitySystem.onComponentAdded(this);
		},
		remove: function(componentConstructor) {
			delete this._components[componentConstructor.type];
			this._entitySystem.onComponentRemoved(this);
		},
		contains: function(componentConstructor) {
			return (componentConstructor.type in this._components);
		}
	});

	function EntitySystem() {
		this._systems = [];
	}
	EntitySystem.extends(Object, {
		newEntity: function(debugName) {
			return new Entity(this, debugName);
		},
		registerSystem: function(system) {
			this._systems.push(system);
		},
		onComponentAdded: function(entity) {
			for (var i = 0; i < this._systems.length; ++i) {
				this._systems[i].onComponentAdded(entity);
			}
		},
		onComponentRemoved: function(entity) {
			for (var i = 0; i < this._systems.length; ++i) {
				this._systems[i].onComponentRemoved(entity);
			}
		}
	});

	module.EntitySystem = EntitySystem;
	return module;
})(Jabaku || {});
