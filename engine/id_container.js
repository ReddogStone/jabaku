var Jabaku = (function(module) {
	function IdContainer() {
		this._values = [];
		this._ids = [];
		this._idToIndex = {};
		this._currentId = 0;
	}
	IdContainer.extends(Object, {
		_newId: function() {
			return this._currentId++;
		},
		get: function(id) {
			var index = this._idToIndex[id];
			return this._values[index];
		},
		add: function(value) {
			var id = this._newId();
			this._values.push(value);
			this._ids.push(id);
			this._idToIndex[id] = this._ids.length - 1;
			return id;
		},
		remove: function(id) {
			var index = this._idToIndex[id];
			var lastIndex = this._ids.length - 1;
			var lastId = this._ids[lastIndex];
			this._values[index] = this._values[lastIndex];
			this._ids[index] = this._ids[lastIndex];
			delete this._idToIndex[id];
			this._idToIndex[lastId] = index;
		}		
	});

	module.IdContainer = IdContainer;
	return module;
})(Jabaku || {});
