module.exports = {
	camel: function(styleName) {
		var reg = /\-([a-z])/g;
		return styleName.replace(reg, function(all, key) {
			return key.toUpperCase();
		});
	},
	unCamel: function(styleName) {
		var reg = /[A-Z]/g;
		return styleName.replace(reg, function(all) {
			return '-' + all.toLowerCase();
		});
	}
};