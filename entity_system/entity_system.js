var Jabaku = (function(module) {
	'use strict';

	function Entity(entitySystem, debugName, id) {
		this._id = id;
		this._debugName = debugName;
		this._entitySystem = entitySystem;
		this._components = {};
	}
	Entity.extends(Object, {
		get debugName() {
			return this._debugName;
		},
		get id() {
			return this._id;
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

			return component;
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
		this._entities = {};
		this._nextId = 0;
	}
	EntitySystem.extends(Object, {
		get entities() {
			return this._entities;
		},
		get: function(id) {
			return this._entities[id];
		},
		newEntity: function(debugName) {
			var id = this._nextId++;
			var entity = new Entity(this, debugName, id);
			this._entities[id] = entity;
			return entity;
		},
		registerSystem: function(system) {
			this._systems.push(system);
		},
		onComponentAdded: function(entity, component) {
			for (var i = 0; i < this._systems.length; ++i) {
				this._systems[i].onComponentAdded(entity, component);
			}
		},
		onComponentRemoved: function(entity, component) {
			for (var i = 0; i < this._systems.length; ++i) {
				this._systems[i].onComponentRemoved(entity, component);
			}
		}
	});

	module.EntitySystem = EntitySystem;
	return module;
})(Jabaku || {});
