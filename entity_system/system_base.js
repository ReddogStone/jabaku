var Jabaku = (function(module) {
	'use strict';

	function SystemBase(entitySystem, needEntityFunc) {
		entitySystem.registerSystem(this);
		
		this._entities = [];
		this._needEntity = needEntityFunc;
	}
	SystemBase.extends(Object, {
		_componentsChanged: function(entity) {
			if (this._needEntity(entity)) {
				if (this._entities.indexOf(entity) < 0) {
					this._entities.push(entity);
				}
			} else if (this._entities.indexOf(entity) >= 0) {
				this._entities.remove(entity);
			}
		},
		onComponentAdded: function(entity) {
			this._componentsChanged(entity);
		},
		onComponentRemoved: function(entity) {
			this._componentsChanged(entity);
		}
	});

	module.SystemBase = SystemBase;
	return module;
})(Jabaku || {});
