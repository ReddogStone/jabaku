function AtlasDesc(columns, rows) {
	this.columns = columns;
	this.rows = rows;
}
AtlasDesc.extends(Object, {
	toArray: function() {
		return [this.columns, this.rows];
	}
});
AtlasDesc.clone = function(value) {
	return new AtlasDesc(value.columns, value.rows);
};