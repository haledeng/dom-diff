/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var VNode = __webpack_require__(1);
	var applyProps = __webpack_require__(3);
	var diffProps = __webpack_require__(5);
	var diffDom = __webpack_require__(7);
	var patch = __webpack_require__(10);
	window.domDiff = {
		applyProps: applyProps,
		diffProps: diffProps,
		VNode: VNode,
		diffDom: diffDom,
		patch: patch
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var _ = __webpack_require__(2);

	function VNode(opts) {
		var len = arguments.length;
		if (len > 1) {
			opts = {};
			if (len >= 3) {
				opts.tagName = arguments[0];
				opts.attr = arguments[1];
				opts.children = _.isArray(arguments[2]) ? arguments[2] : [arguments[2]];
			} else {
				opts.tagName = arguments[0];
				opts.children = _.isArray(arguments[1]) ? arguments[1] : [arguments[1]];
			}
		}
		this.tagName = opts.tagName;
		this.attr = opts.attr || {};
		this.children = opts.children || [];
	}

	/*
	 * parse dom to Element structure.
	 */
	VNode._parseDom2Element = function(dom) {
		var self = this;
		var attrs = {};
		var _attrs = dom.attributes;
		var item = null;
		for (var i = 0; i < _attrs.length; i++) {
			item = _attrs[i];
			attrs[item.name] = item.value;
		}

		var children = [];
		var _children = dom.childNodes;
		_children = [].slice.call(_children);
		_children.forEach(function(_child, index) {
			if (_child.nodeType === 1) {
				children.push(self._parseDom2Element(_child));
			} else if (_child.nodeType === 3 && _.trim(_child.data).length) {
				// text node
				children.push(_child.data);
			}
		});
		return new VNode({
			tagName: dom.tagName.toLowerCase(),
			attr: attrs,
			children: children
		})
	};

	/**
	 * parse dom to Element Object
	 */
	VNode.parse = function(selector) {
		var dom = null;
		if (typeof selector === 'string') {
			dom = document.querySelector(selector);
		} else if (typeof selector === 'object') {
			dom = selector;
		} else {
			console.log('`VNode.parse` function receive a selector string or dom object');
			return;
		}
		return this._parseDom2Element(dom);
	}

	/**
	 * render Element to HTML string
	 */
	VNode.prototype.render = function() {
		var dom = document.createElement(this.tagName);
		for (var prop in this.attr) {
			dom.setAttribute(prop, this.attr[prop]);
		}
		this.children.forEach(function(child) {
			var childEl = (child instanceof VNode) ? child.render() : document.createTextNode(child);
			dom.appendChild(childEl);
		});
		return dom;
	};


	module.exports = exports = VNode;

/***/ },
/* 2 */
/***/ function(module, exports) {

	var _ = exports = module.exports = {};

	var toString = Object.prototype.toString;
	_.trim = function(str) {
		return str.replace(/(^\s*)|(\s*$)/, '');
	};

	/**
	 * is Object
	 * @param    {[type]}                 obj [description]
	 * @return   {Boolean}                    [description]
	 */
	_.isObject = function(obj) {
		return '[object Object]' === toString.call(obj);
	}

	/**
	 * is object an array
	 * @param    {object}                 obj [description]
	 * @return   {Boolean}                    [description]
	 */
	_.isArray = function(obj) {
		return '[object Array]' === toString.call(obj);
	}

	/**
	 * is empty string
	 * @param    {string}                 obj [description]
	 * @return   {Boolean}                    [description]
	 */
	_.isEmptyStr = function(obj) {
		return obj === '';
	}


	_.isFunction = function(fn) {
		return fn && typeof fn === 'function';
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(2);
	var camelize = __webpack_require__(4);
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

/***/ },
/* 4 */
/***/ function(module, exports) {

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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var parse = __webpack_require__(6);

	function parseStyle(one, two, key) {
		if (key === 'style') {
			var oneStyles = parse(one[key]);
			var twoStyles = parse(two[key]);
			return diffProps(oneStyles, twoStyles);
		} else {
			return two[key];
		}
	}

	function diffProps(one, two) {
		var diff;
		for (var k in one) {
			if (!(k in two)) {
				diff = diff || {};
				diff[k] = undefined;
			}

			if (one[k] !== two[k]) {
				diff = diff || {};
				// style增量更新
				diff[k] = parseStyle(one, two, k);
			}
		}

		for (var key in two) {
			if (!(key in one)) {
				diff = diff || {};
				diff[key] = parseStyle(one, two, key);
				// diff[key] = two[key];
			}
		}

		return diff;
	};


	module.exports = diffProps;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(2);
	var camelize = __webpack_require__(4);

	module.exports = function(attr) {

	    // style
	    var attrReg = /([a-zA-Z\-]*)\s*?\:\s*?([a-zA-Z0-9%\-\s\#]*);?/g;
	    var attrs = {};
	    attr && attr.replace(attrReg, function(all, key, value) {
	        // key = camelize.camel(key);
	        attrs[key] = _.trim(value);
	    });
	    return attrs;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(2);
	var VPatch = __webpack_require__(8);
	var diffProps = __webpack_require__(5);
	var isTextNode = __webpack_require__(9);
	var attr = __webpack_require__(3);


	function appendPatch(apply, patch) {
		if (apply) {
			if (_.isArray(apply)) {
				return apply.push(patch);
			} else {
				return [apply, patch];
			}
		} else {
			return patch;
		}
	}

	// textNode diff
	function diffTextNode(one, two) {
		var isOneText = isTextNode(one);
		var isTwoText = isTextNode(two);
		if (isOneText) {
			if (isTwoText) {
				// both textNode
				var oneText = one.childNodes[0].data;
				var twoText = two.childNodes[0].data;
				if (_.trim(oneText) !== _.trim(twoText)) {
					return new VPatch(VPatch.TEXTNODE, one, twoText);
				}
			} else {
				return new VPatch(VPatch.REPLACE, one, two);
			}
		} else {
			if (isTwoText) {
				return new VPatch(VPatch.TEXTNODE, one, _.trim(two.childNodes[0].data));
			}
		}
	}

	// remove/replace 节点，需要将对应的prop操作删掉
	function deleteChangeProp(apply) {
		if (!apply) return apply;
		if (_.isObject(apply)) {
			return apply.type === VPatch.PROPS ? null : apply;
		}
		if (_.isArray(apply)) {
			var newApply = [];
			apply.forEach(function(a) {
				if (a.type !== VPatch.PROPS) {
					newApply.push(a);
				}
			});
			if (newApply.length === 1) {
				return newApply[0];
			}
			return newApply;
		}
	}


	// 对比dom差异
	function diffDom(one, two, patch, index) {
		var apply = patch[index];
		if (two) {
			if (one.tagName === two.tagName) {
				var oneAttr = attr.getAttr(one);
				var twoAttr = attr.getAttr(two);
				var props = diffProps(oneAttr, twoAttr);
				if (props) {
					apply = appendPatch(apply, new VPatch(VPatch.PROPS, one, props));
				}
				// innerText
				var textNode = diffTextNode(one, two);
				if (textNode) {
					apply = appendPatch(apply, textNode);
					if (textNode.type === VPatch.REPLACE) {
						apply = deleteChangeProp(apply);
					}
				}
				if (one.children.length && two.children.length) {
					apply = diffChildren(one, two, patch, apply, index);
				}
			} else {
				apply = appendPatch(apply, new VPatch(VPatch.REPLACE, one, two));
				apply = deleteChangeProp(apply);
			}
		} else {
			apply = appendPatch(apply, new VPatch(VPatch.REMOVE, one, two));
			apply = deleteChangeProp(apply);
		}
		if (apply) {
			patch[index] = apply;
		}
	}

	// 对比dom中childrend差异
	function diffChildren(one, two, patch, apply, index) {
		var aLen = one.children.length;
		var bLen = two.children.length;
		var len = Math.max(aLen, bLen);
		for (var i = 0; i < len; i++) {
			index++;
			var leftNode = one.children[i];
			var rightNode = two.children[i];
			if (leftNode) {
				diffDom(leftNode, rightNode, patch, index);
				index += leftNode.children.length;
			} else {
				if (rightNode) {
					apply = appendPatch(apply, new VPatch(VPatch.INSERT, null, rightNode));
				}
			}
		}
		return apply;
	}


	module.exports = exports = function(one, two) {
		var patch = {
			left: one
		};
		diffDom(one, two, patch, 0);
		return patch;
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	function VPatch(type, node, right) {
		this.type = type;
		this.left = node;
		this.right = right;
	}

	// 删除节点
	VPatch.REMOVE = 0;
	// 插入节点
	VPatch.INSERT = 1;
	VPatch.REPLACE = 2;
	VPatch.PROPS = 3;
	VPatch.TEXTNODE = 4;

	module.exports = VPatch;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = function(node) {
		return node.children.length === 0 && node.childNodes.length !== 0;
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var VPatch = __webpack_require__(8);
	var _ = __webpack_require__(2);
	var findIndexNode = __webpack_require__(11);
	var curd = __webpack_require__(12);


	var findPatchNode = function(node, patch) {
		var children = {};
		for (var index in patch) {
			if (index !== 'left') {
				var child = findIndexNode(node, index);
				children[index] = child;
			}
		}
		return children;
	}

	// 每个type对应的操作函数
	var typeOpMaps = {};
	typeOpMaps[VPatch.REMOVE] = curd.removeChild;
	typeOpMaps[VPatch.INSERT] = curd.insertChild;
	typeOpMaps[VPatch.REPLACE] = curd.replaceChild;
	typeOpMaps[VPatch.PROPS] = curd.applyAttributes;
	typeOpMaps[VPatch.TEXTNODE] = curd.replaceContent;


	// 增量渲染
	// 边查找边操作有bug
	var patchDom = function(node, patch, index) {
		// 先把dom和index关系查找完毕，在进行dom操作
		var domIndex = findPatchNode(node, patch);
		for (var index in patch) {
			if (index !== 'left') {
				var child = domIndex[index];
				var applies = patch[index];
				if (!_.isArray(applies)) {
					applies = [applies];
				}
				applies.forEach(function(apply) {
					if (_.isFunction(typeOpMaps[apply.type])) {
						typeOpMaps[apply.type](child, apply);
					}
				});
			}
		}
	};

	module.exports = exports = function(patch) {
		var node = patch.left;
		patchDom(node, patch, 0);
	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * 根据序号，查找dom数，深度优先遍历
	 */
	module.exports = function(node, index) {
		var count = 0;
		var lastChild;
		var _find = function(node, index) {
			if (index == count) return node;
			for (var i = 0; i < node.children.length; i++) {
				lastChild = node.children[i];
				count++;
				if (index == count) return lastChild;
				if (lastChild.children.length) {
					lastChild = _find(lastChild, index);
					if (lastChild) return lastChild;
				}
			}
		};
		var findNode = _find(node, index);
		if (!findNode && index >= count) {
			return lastChild;
		} else {
			return findNode;
		}
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dom增、删、改
	 */
	var applyAttr = __webpack_require__(3);

	function insertChild(node, apply) {
		if (!apply.left && apply.right) {
			node.appendChild(apply.right)
		}
	}


	// 替换节点
	function replaceChild(node, apply) {
		var parent = node.parentNode;
		var newNode = apply.right.cloneNode(true);
		parent.replaceChild(newNode, node);
	}

	// 删除节点
	function removeChild(node, apply) {
		apply.left.parentNode.removeChild(apply.left);
	}

	// textNode节点，替换内容
	function replaceContent(node, apply) {
		if (apply && typeof apply.right === 'string') {
			node.innerHTML = apply.right;
		}
	}

	function applyAttributes(node, apply) {
		applyAttr.applyAttributes(node, apply.right);
	}


	module.exports = {
		insertChild: insertChild,
		removeChild: removeChild,
		replaceContent: replaceContent,
		replaceChild: replaceChild,
		applyAttributes: applyAttributes
	};

/***/ }
/******/ ]);