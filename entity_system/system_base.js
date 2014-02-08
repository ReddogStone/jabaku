var Jabaku = (function(module) {
	'use strict';

	function SystemBase(entitySystem, needEntityFunc) {
		entitySystem.registerSystem(this);
		
		this._entities = [];
		this._needEntity = needEntityFunc;
	}
	SystemBase.extends(Object, {
		onComponentAdded: function(entity) {
			if (this._needEntity(entity) && (this._entities.indexOf(entity) < 0)) {
				this._entities.push(entity);
			}
		},
		onComponentRemoved: function(entity) {
			if (!this._needEntity(entity)) {
				this._entities.remove(entity);
			}
		}
	});

	module.SystemBase = SystemBase;
	return module;
})(Jabaku || {});
