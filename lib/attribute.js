var _ = require('./util');
var camelize = require('./camelize');
var attrs = {
	applyAttributes: function(node, props) {
		for (var propName in props) {
			var propValue = props[propName];
			if (typeof propValue === 'undefined') {
				this.removeAttribute(node, propName);
			} else {
				if (_.isObject(propValue)) {
					this.patchObject(node, propName, propValue);
				} else {
					node.setAttribute(propName, propValue);
				}
			}
		}
	},
	removeAttribute: function(node, propName) {
		node.removeAttribute(propName);
	},
	patchObject: function(node, propName, propValue) {
		for (var k in propValue) {
			if (propValue[k] === undefined && propName === 'style') {
				node[propName].removeProperty(camelize.unCamel(k));
			} else {
				node[propName][k] = propValue[k];
			}
		}
	},
	getAttr: function(node) {
		var attrs = node.attributes;
		var ret = {};
		for (var i = 0; i < attrs.length; i++) {
			var attr = attrs[i];
			if (!_.isEmptyStr(attr.value)) {
				ret[attr.name] = attr.value;
			}
		}
		return ret;
	}
};

module.exports = exports = attrs;