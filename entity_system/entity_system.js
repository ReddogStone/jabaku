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
			if (componentConstructor.type === undefined) {
				throw new Error(componentConstructor.name + ' is not a component!');
			}

			return this._components[componentConstructor.type];
		},
		add: function(component) {
			if (component.type === undefined) {
				throw new Error(component.constructor.name + ' is not a component!');
			}

			this._components[component.type] = component;
			this._entitySystem.onComponentAdded(this, component);
		},
		remove: function(componentConstructor) {
			if (componentConstructor.type === undefined) {
				throw new Error(componentConstructor.name + ' is not a component!');
			}

			if (componentConstructor.type in this._components) {
				var component = this._components[componentConstructor.type];
				delete this._components[componentConstructor.type];
				this._entitySystem.onComponentRemoved(this, component);
			}
		},
		contains: function(componentConstructor) {
			if (componentConstructor.type === undefined) {
				throw new Error(componentConstructor.name + ' is not a component!');
			}
			
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
