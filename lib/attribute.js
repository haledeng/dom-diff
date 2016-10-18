var _ = require('./util');

var defaultStyleValue = {

}

// 获取样式属性的默认值
function getDefaultStyleValue(prop) {
	if (/(margin|padding|fontsize)/i.test(prop)) {
		return 0;
	} else if (/(background|border)/i.test(prop)) {
		return 'none';
	}
}

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
			// 删除的样式如何处理？
			if (propValue[k] === undefined) {
				node[propName][k] = getDefaultStyleValue(k);
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