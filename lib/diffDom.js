var _ = require('./util');
var VPatch = require('./vPatch');
var diffProps = require('./diffProps');
var isTextNode = require('./isTextNode');
var attr = require('./attribute');


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